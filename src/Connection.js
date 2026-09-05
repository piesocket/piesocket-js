import Logger from './Logger.js';
import Socket from './misc/WebSocket.js';

const CONTROL_TIMEOUT_MS = 10000;

// setTimeout in Node returns a Timeout with unref(); in browsers it returns a
// number. Keep a pending control frame from holding a Node process open.
const timeout = (fn, ms) => {
  const t = setTimeout(fn, ms);
  if (t && typeof t.unref === 'function') {
    t.unref();
  }
  return t;
};

/**
 * A single WebSocket shared by many {@link Channel} handles (PieSocket v4).
 *
 * The channel named in the connect URL is the "primary" — its lifecycle is the
 * socket's lifecycle. Every other channel is subscribed with a
 * `system::subscribe` control frame and rides the same socket; outbound frames
 * for it are tagged with `system::channel`, and inbound frames are routed back
 * to it by the `system::channel` / `data.channel` the server stamps on them.
 *
 * All v4 control/system events are `system::x` (double colon), on the wire
 * and in the frames handed to Channel — including the event name app code
 * passes to `channel.listen(...)`. This matches the `system::channel` /
 * `system::to` field convention and keeps v4 consistently double-colon
 * end-to-end; v3's single-colon events (`system:member_joined`, etc.) are a
 * separate, untouched convention that Channel still speaks natively.
 */
export default class Connection {
  constructor(endpoint, options, primaryChannelId) {
    this.options = options || {};
    this.logger = new Logger(this.options);
    this.primaryChannelId = primaryChannelId;

    this.channels = {}; // channelId -> Channel
    this.pending = {}; // channelId -> { resolve, reject, timer, params }
    this.memberRequests = {}; // channelId -> [{ resolve, reject, timer }]

    this.connected = false;
    this.shouldReconnect = false;
    this._migrating = false;
    this._openedOnce = false;

    // Set by PieSocket to settle the first subscribe() promise.
    this.onPrimaryConnected = () => {};
    this.onPrimaryError = () => {};

    this.connect(endpoint);
  }

  connect(endpoint) {
    if (endpoint) {
      this.endpoint = endpoint;
    }

    const socket = new Socket(this.endpoint);
    try {
      socket.binaryType = 'arraybuffer';
    } catch (e) {
      // Some environments expose a read-only binaryType — ignore.
    }
    socket.onopen = this.onOpen.bind(this);
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);

    this.socket = socket;
    return socket;
  }

  isPrimary(channelId) {
    return channelId === this.primaryChannelId;
  }

  attachChannel(channelId, channel) {
    this.channels[channelId] = channel;
  }

  detachChannel(channelId) {
    delete this.channels[channelId];
    this._settleMemberRequests(channelId, 'reject', new Error('Channel detached'));
  }

  // ===== Outbound =====

  sendControl(event, data) {
    try {
      this.socket.send(JSON.stringify({event: event, data: data}));
    } catch (e) {
      this.logger.error('PieSocket: control frame send failed', e);
    }
  }

  /**
   * Send an application frame on behalf of `channelId`. Accepts either an
   * object (from Channel#publish) or a pre-serialised string (raw Channel#send
   * / blockchain payloads). Secondary channels get a `system::channel` tag.
   * @param {string} channelId
   * @param {(object|string)} data
   * @return {*}
   */
  send(channelId, data) {
    if (data && typeof data === 'object') {
      const payload = this.isPrimary(channelId) ?
        data :
        {...data, 'system::channel': channelId};
      return this.socket.send(JSON.stringify(payload));
    }

    if (!this.isPrimary(channelId)) {
      try {
        const obj = JSON.parse(data);
        if (obj && typeof obj === 'object') {
          obj['system::channel'] = channelId;
          return this.socket.send(JSON.stringify(obj));
        }
      } catch (e) {
        // Not JSON — fall through and send verbatim.
      }
    }

    return this.socket.send(data);
  }

  // ===== Subscription control =====

  subscribeChannel(channelId, params) {
    return new Promise((resolve, reject) => {
      const timer = timeout(() => {
        delete this.pending[channelId];
        reject(new Error(`system::subscribe timed out for "${channelId}"`));
      }, CONTROL_TIMEOUT_MS);

      this.pending[channelId] = {resolve, reject, timer, params};

      if (this.connected) {
        this.sendControl('system::subscribe', params);
      }
      // Otherwise onOpen() replays every pending subscribe.
    });
  }

  unsubscribeChannel(channelId) {
    return new Promise((resolve, reject) => {
      if (this.isPrimary(channelId)) {
        reject(new Error('Cannot unsubscribe the primary channel directly'));
        return;
      }

      const timer = timeout(() => {
        delete this.pending[channelId];
        resolve();
      }, CONTROL_TIMEOUT_MS);

      this.pending[channelId] = {resolve, reject, timer};
      this.sendControl('system::unsubscribe', {channel: channelId});
    });
  }

  requestMembers(channelId) {
    return new Promise((resolve, reject) => {
      if (!this.memberRequests[channelId]) {
        this.memberRequests[channelId] = [];
      }

      const timer = timeout(() => {
        this._settleMemberRequests(
            channelId,
            'reject',
            new Error(`system::get_members timed out for "${channelId}"`),
        );
      }, CONTROL_TIMEOUT_MS);

      this.memberRequests[channelId].push({resolve, reject, timer});
      this.sendControl('system::get_members', {channel: channelId});
    });
  }

  /**
   * Re-open the socket with `newPrimaryId` as the primary channel, keeping every
   * other subscription. Used when the current primary is unsubscribed. Frames in
   * flight during the swap may be missed.
   * @param {string} newPrimaryId
   * @param {string} endpoint New primary connect URL
   * @return {void}
   */
  migratePrimary(newPrimaryId, endpoint) {
    this._migrating = true;

    const old = this.socket;
    try {
      old.onclose = () => {};
      old.onmessage = () => {};
      old.close();
    } catch (e) {
      // ignore
    }

    this.primaryChannelId = newPrimaryId;
    if (this.channels[newPrimaryId]) {
      // The new primary is subscribed via the URL now, not a control frame.
      delete this.channels[newPrimaryId].subscribeParams;
    }

    this.connected = false;
    this.connect(endpoint);
    this._migrating = false;
  }

  close() {
    this.shouldReconnect = false;
    try {
      this.socket.close();
    } catch (e) {
      // ignore
    }
  }

  // ===== Socket events =====

  onOpen(e) {
    this.connected = true;
    this.shouldReconnect = true;

    // Replay every secondary subscription (reconnect / primary migration).
    Object.keys(this.channels).forEach((channelId) => {
      if (this.isPrimary(channelId)) {
        return;
      }
      const params = this.channels[channelId].subscribeParams;
      if (params) {
        this.sendControl('system::subscribe', params);
      }
    });

    // Replay subscribes that were still in flight across a reconnect.
    Object.keys(this.pending).forEach((channelId) => {
      if (this.pending[channelId].params) {
        this.sendControl('system::subscribe', this.pending[channelId].params);
      }
    });

    // Settle the first subscribe() promise exactly once — a reconnect or a
    // primary migration must not re-run that closure (it captured the original
    // primary channel).
    if (!this._openedOnce) {
      this._openedOnce = true;
      this.onPrimaryConnected(e);
    }

    const primary = this.channels[this.primaryChannelId];
    if (primary && typeof primary.onOpen === 'function') {
      primary.onOpen(e);
    }
  }

  onMessage(e) {
    let message;
    try {
      message = JSON.parse(e.data);
    } catch (jsonException) {
      const primary = this.channels[this.primaryChannelId];
      if (primary) {
        primary.dispatch(null, e);
      }
      return;
    }

    const event = message && message.event;

    if (
      event === 'system::subscribe_success' ||
      event === 'system::subscribe_error' ||
      event === 'system::unsubscribe_success' ||
      event === 'system::unsubscribe_error'
    ) {
      return this._settleControl(message);
    }

    if (event === 'system::member_list_error') {
      const channelId = (message.data && message.data.channel) || this.primaryChannelId;
      return this._settleMemberRequests(
          channelId,
          'reject',
          new Error((message.data && message.data.error) || 'Could not fetch members'),
      );
    }

    if (event === 'system::binary') {
      const channelId = message['system::channel'] || this.primaryChannelId;
      const channel = this.channels[channelId] || this.channels[this.primaryChannelId];
      if (channel) {
        channel.dispatch(
            {event: 'system::binary', data: this._decodeBase64(message.data), meta: message.meta},
            e,
        );
      }
      return;
    }

    const channelId =
      message['system::channel'] ||
      (message.data && message.data.channel) ||
      this.primaryChannelId;
    const channel = this.channels[channelId] || this.channels[this.primaryChannelId];
    if (!channel) {
      return;
    }

    channel.dispatch(message, e);

    if (event === 'system::member_list') {
      this._settleMemberRequests(channelId, 'resolve', channel.members);
    }
  }

  onError(e) {
    this.logger.error('PieSocket: connection error', e);

    if (!this.connected) {
      this.onPrimaryError(e);
    }

    Object.keys(this.channels).forEach((channelId) => {
      const channel = this.channels[channelId];
      if (channel.events && channel.events['error']) {
        channel.events['error'].bind(channel)(e);
      }
    });

    try {
      this.socket.close();
    } catch (err) {
      // ignore
    }
  }

  onClose(e) {
    this.connected = false;

    Object.keys(this.channels).forEach((channelId) => {
      const channel = this.channels[channelId];
      if (channel.events && channel.events['close']) {
        channel.events['close'].bind(channel)(e);
      }
    });

    if (this.shouldReconnect && !this._migrating) {
      this.logger.log('PieSocket: reconnecting multiplexed connection');
      this.connect();
    }
  }

  // ===== Internals =====

  _settleControl(message) {
    const channelId = message.data && message.data.channel;
    const entry = channelId && this.pending[channelId];
    if (!entry) {
      return;
    }

    clearTimeout(entry.timer);
    delete this.pending[channelId];

    if (message.event.endsWith('_success')) {
      entry.resolve(message.data);
    } else {
      entry.reject(new Error((message.data && message.data.error) || message.event));
    }
  }

  _settleMemberRequests(channelId, how, value) {
    const list = this.memberRequests[channelId];
    if (!list || !list.length) {
      return;
    }
    delete this.memberRequests[channelId];
    list.forEach(({resolve, reject, timer}) => {
      clearTimeout(timer);
      if (how === 'resolve') {
        resolve(value);
      } else {
        reject(value);
      }
    });
  }

  _decodeBase64(b64) {
    if (typeof b64 !== 'string') {
      return b64;
    }
    if (typeof atob === 'function') {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      return bytes.buffer;
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64');
    }
    return b64;
  }
}
