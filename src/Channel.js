import Logger from './Logger.js';
import Blockchain from './Blockchain.js';
import Socket from './misc/WebSocket.js';

export default class Channel {
  constructor(endpoint, identity, init=true) {
    this.events = {};
    this.listeners = {};
    this.members = [];
    this.portal = null;
    this.pieRTC = null;
    this.uuid = null;
    this.onSocketConnected = () => {};
    this.onSocketError = () => {};

    if (!init) {
      return;
    }

    this.init(endpoint, identity);
  }

  init(endpoint, identity) {
    this.endpoint = endpoint;
    this.identity = identity;
    this.connection = this.connect();
    this.shouldReconnect = false;
    this.logger = new Logger(identity);
  }

  /**
   * Wire this handle to a shared {@link Connection} (PieSocket v4). The socket
   * lifecycle lives on the Connection; this handle only routes frames.
   * @param {*} connection Shared Connection instance (null in non-browser envs)
   * @param {string} channelId
   * @param {*} identity
   */
  attachToConnection(connection, channelId, identity) {
    this.hub = connection;
    this.channelId = channelId;
    this.identity = identity;
    this.shouldReconnect = false;
    this.logger = new Logger(identity);
  }

  memberKey(member) {
    if (member && typeof member === 'object') {
      return member.uuid != null ? 'uuid:' + member.uuid : 'obj:' + JSON.stringify(member);
    }
    return 'val:' + String(member);
  }

  addMember(member) {
    if (member == null) {
      return;
    }
    const key = this.memberKey(member);
    if (!this.members.some((m) => this.memberKey(m) === key)) {
      this.members.push(member);
    }
  }

  removeMember(member) {
    if (member == null) {
      return;
    }
    const key = this.memberKey(member);
    this.members = this.members.filter((m) => this.memberKey(m) !== key);
  }

  getMemberByUUID(uuid) {
    let member = null;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].uuid == uuid) {
        member = this.members[i];
        break;
      }
    }
    return member;
  }

  getCurrentMember() {
    return this.getMemberByUUID(this.uuid);
  }

  connect() {
    const connection = new Socket(this.endpoint);
    connection.onmessage = this.onMessage.bind(this);
    connection.onopen = this.onOpen.bind(this);
    connection.onerror = this.onError.bind(this);
    connection.onclose = this.onClose.bind(this);

    if (this.identity.onSocketConnected) {
      this.onSocketConnected = this.identity.onSocketConnected;
    }

    if (this.identity.onSocketError) {
      this.onSocketError = this.identity.onSocketError;
    }

    return connection;
  }

  on(event, callback) {
    // Register lifecycle callbacks
    this.events[event] = callback;
  }

  listen(event, callback) {
    // Register user defined callbacks
    this.listeners[event] = callback;
  }


  send(data) {
    if (this.hub) {
      return this.hub.send(this.channelId, data);
    }
    return this.connection.send(data);
  }

  async publish(event, data, meta) {
    if (meta && meta.blockchain) {
      return await this.sendOnBlockchain(event, data, meta);
    }

    const payload = {
      event: event,
      data: data,
      meta: meta,
    };

    if (this.hub) {
      return this.hub.send(this.channelId, payload);
    }
    return this.connection.send(JSON.stringify(payload));
  }

  /**
   * Re-sync this channel's presence roster from the server via
   * `system:get_members`. Resolves with the refreshed member list.
   * @return {Promise<Array>}
   */
  refreshMembers() {
    if (this.hub) {
      return this.hub.requestMembers(this.channelId);
    }
    return Promise.resolve(this.members);
  }


  async sendOnBlockchain(event, data, meta) {
    if (!this.blockchain) {
      this.blockchain = new Blockchain(this.identity);
    }

    try {
      const receipt = await this.blockchain.send(data);

      if (this.events['blockchain-hash']) {
        this.events['blockchain-hash'].bind(this)({
          event: event,
          data: data,
          meta: meta,
          transactionHash: receipt.hash,
        });
      }

      return this.send(JSON.stringify({'event': event, 'data': data, 'meta': {...meta, 'transaction_id': receipt.id, 'transaction_hash': receipt.hash}}));
    } catch (e) {
      if (this.events['blockchain-error']) {
        this.events['blockchain-error'].bind(this)(e);
      }
    };
  }

  async confirmOnBlockchain(event, transactionHash) {
    if (!this.blockchain) {
      this.blockchain = new Blockchain(this.identity);
    }

    try {
      const hash = await this.blockchain.confirm(transactionHash);

      if (this.events['blockchain-hash']) {
        this.events['blockchain-hash'].bind(this)({
          event: event,
          confirmationHash: transactionHash,
          transactionHash: hash,
        });
      }

      return this.send(JSON.stringify({'event': event, 'data': transactionHash, 'meta': {'transaction_id': 1, 'transaction_hash': hash}}));
    } catch (e) {
      if (this.events['blockchain-error']) {
        this.events['blockchain-error'].bind(this)(e);
      }
    }
  }

  onMessage(e) {
    this.logger.log('Channel message:', e);

    let message = null;
    try {
      message = JSON.parse(e.data);
    } catch (jsonException) {
      console.error(jsonException);
    }

    this.dispatch(message, e);
  }

  /**
   * Route a parsed frame to listeners + presence handling, then fire the
   * `message` lifecycle callback. Shared by the v3 socket path and the v4
   * multiplexed {@link Connection}.
   * @param {*} message Parsed frame, or null for a non-JSON payload
   * @param {*} rawEvent Original socket MessageEvent
   */
  dispatch(message, rawEvent) {
    if (message) {
      this.handleFrame(message);
    }

    // Fire lifecycle callback
    if (this.events['message']) {
      this.events['message'].bind(this)(rawEvent);
    }
  }

  handleFrame(message) {
    if (message.error && message.error.length) {
      this.shouldReconnect = false;
    }

    if (message.event) {
      this.handleMemberHandshake(message);

      if (this.listeners[message.event]) {
        this.listeners[message.event].bind(this)(message.data, message.meta);
      }

      if (this.listeners['*']) {
        this.listeners['*'].bind(this)(message.event, message.data, message.meta);
      }
    }
  }

  handleMemberHandshake(message) {
    // v4 delivers presence as deltas: member_joined / member_left carry only the
    // member that changed, and the full roster arrives once as member_list (on
    // join or in response to system::get_members / refreshMembers()). v4's
    // system events are double-colon (`system::x`) end-to-end; v3's stay
    // single-colon. Portal (v3 WebRTC) events below stay single-colon `system:`;
    // PieRTC (v4 WebRTC) uses its own `rtc::` namespace so it never collides
    // with either system event convention.
    const deltaPresence = this.identity && this.identity.version == 4;
    const memberListEvent = deltaPresence ? 'system::member_list' : 'system:member_list';
    const memberJoinedEvent = deltaPresence ? 'system::member_joined' : 'system:member_joined';
    const memberLeftEvent = deltaPresence ? 'system::member_left' : 'system:member_left';

    if (message.event == memberListEvent) {
      this.members = Array.isArray(message.data.members) ? message.data.members : [];
    } else if (message.event == memberJoinedEvent) {
      if (deltaPresence) {
        this.addMember(message.data.member);
      } else {
        this.members = message.data.members;
      }
    } else if (message.event == memberLeftEvent) {
      if (deltaPresence) {
        this.removeMember(message.data.member);
      } else {
        this.members = message.data.members;
      }
      if (this.portal && message.data.member) {
        this.portal.removeParticipant(message.data.member.uuid);
      }
      if (this.pieRTC && message.data.member) {
        this.pieRTC.removeParticipant(message.data.member.uuid);
      }
    } else if (message.event == 'system:portal_broadcaster' && message.data.from != this.uuid) {
      this.portal.requestOfferFromPeer(message.data);
    } else if (message.event == 'system:stopped_screen' && message.data.from != this.uuid) {
      this.portal.onRemoteScreenStopped(message.data.from, message.data.streamId);
    } else if (message.event == 'system:portal_watcher' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } else if (message.event == 'system:video_request' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } else if (message.event == 'system:portal_candidate' && message.data.to == this.uuid) {
      this.portal.addIceCandidate(message.data);
    } else if (message.event == 'system:video_offer' && message.data.to == this.uuid) {
      this.portal.createAnswer(message.data);
    } else if (message.event == 'system:video_answer' && message.data.to == this.uuid) {
      this.portal.handleAnswer(message.data);
    } else if (message.event == 'rtc::broadcaster' && message.data.from != this.uuid) {
      this.pieRTC.requestOfferFromPeer(message.data);
    } else if (message.event == 'rtc::stopped_screen' && message.data.from != this.uuid) {
      this.pieRTC.onRemoteScreenStopped(message.data.from, message.data.streamId);
    } else if (message.event == 'rtc::watcher' && message.data.from != this.uuid) {
      this.pieRTC.shareVideo(message.data);
    } else if (message.event == 'rtc::request' && message.data.from != this.uuid) {
      this.pieRTC.shareVideo(message.data);
    } else if (message.event == 'rtc::candidate' && message.data.to == this.uuid) {
      this.pieRTC.addIceCandidate(message.data);
    } else if (message.event == 'rtc::offer' && message.data.to == this.uuid) {
      this.pieRTC.createAnswer(message.data);
    } else if (message.event == 'rtc::answer' && message.data.to == this.uuid) {
      this.pieRTC.handleAnswer(message.data);
    }
  }

  onOpen(e) {
    this.logger.log('Channel connected:', e);
    this.shouldReconnect = true;

    // System init callback
    this.onSocketConnected(e);
  }

  onError(e) {
    this.logger.error('Channel error:', e);
    this.connection.close();

    // System init error callback
    this.onSocketError(e);

    // User defined callback
    if (this.events['error']) {
      this.events['error'].bind(this)(e);
    }
  }

  onClose(e) {
    this.logger.warn('Channel closed:', e);
    this.reconnect();

    // User defined callback
    if (this.events['close']) {
      this.events['close'].bind(this)(e);
    }
  }

  reconnect() {
    if (!this.shouldReconnect) {
      return;
    }
    this.logger.log('Reconnecting');
    this.connection = this.connect();
  }
}
