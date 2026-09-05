import Channel from './Channel.js';
import Connection from './Connection.js';
import Logger from './Logger.js';
import Portal from './Portal.js';
import PieRTC from './PieRTC.js';
import InvalidAuthException from './InvalidAuthException.js';
import defaultOptions from './misc/DefaultOptions.js';
import {v4 as uuidv4} from 'uuid';

const SDK_VERSION = '7.1.0';

export default class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {...defaultOptions, ...options};
    this.connections = {};
    this.logger = new Logger(this.options);
  }

  async subscribe(channelId, roomOptions={}) {
    // v4 multi-channel: one shared WebSocket for every subscribe() call.
    // PieRTC (v4's WebRTC room) rides the same shared connection; v3's Portal
    // still gets its own dedicated standalone connection. The two are flagged
    // differently on purpose: v4 rooms use `piertc: true`, not v3's `portal: true`.
    if (this.options.version == 4) {
      const isPieRTC = !!(roomOptions.video || roomOptions.audio || roomOptions.piertc);
      return this.subscribeMultiplexed(channelId, roomOptions, isPieRTC);
    }

    const isPortal = !!(roomOptions.video || roomOptions.audio || roomOptions.portal);
    return this.subscribeStandalone(channelId, roomOptions, isPortal);
  }

  subscribeStandalone(channelId, roomOptions, isPortal) {
    return new Promise(async (resolve, reject) => {
      if (isPortal) {
        // Force config when video is required
        this.options.notifySelf = true;
      }

      const uuid = uuidv4();
      // subscribe() only reaches here when this.options.version != 4 (v4 goes
      // through subscribeMultiplexed instead), so this always speaks that version.
      const endpoint = await this.getEndpoint(channelId, uuid);

      if (this.connections[channelId]) {
        this.logger.log('Returning existing channel', channelId);
        resolve(this.connections[channelId]);
      } else {
        this.logger.log('Creating new channel', channelId);
        const channel = new Channel(endpoint, {
          channelId: channelId,
          onSocketConnected: () => {
            channel.uuid = uuid;
            if (isPortal) {
              channel.portal = new Portal(channel, {
                ...this.options,
                ...roomOptions,
              }); ``;
            }
            this.connections[channelId] = channel;
            resolve(channel);
          },
          onSocketError: () => {
            reject('Failed to make websocket connection');
          },
          ...this.options,
        });

        if (typeof WebSocket == 'undefined') {
          // Resolves the promise in case WebSocket is not defined
          channel.uuid = uuid;
          this.connections[channelId] = channel;
          resolve(channel);
        }
      }
    });
  }

  async subscribeMultiplexed(channelId, roomOptions={}, isPieRTC=false) {
    if (this.connections[channelId]) {
      this.logger.log('Returning existing channel', channelId);
      return this.connections[channelId];
    }

    const uuid = uuidv4();
    const presence =
      this.options.presence == 1 ||
      this.options.presence === true ||
      ('' + channelId).startsWith('presence-');
    const noWebSocket = typeof WebSocket == 'undefined';

    // First subscription opens the shared socket, with this channel as
    // primary. Two subscribe() calls fired without awaiting each other (e.g.
    // Promise.all right after construction) would otherwise both observe
    // `_multiplex` unset — before either's `getEndpoint()` await resolves —
    // and each open their own socket, silently orphaning one. A racing call
    // waits on the in-flight open instead, then retries as a secondary
    // subscribe once `_multiplex` is set.
    if (!this._multiplex) {
      if (isPieRTC) {
        // Mirrors subscribeStandalone: PieRTC wants its own signalling
        // echoed back. Only takes effect if this call is the one opening
        // the primary connection — see the warning below otherwise.
        this.options.notifySelf = true;
      }

      if (this._multiplexOpening) {
        await this._multiplexOpening.catch(() => {});
        return this.subscribeMultiplexed(channelId, roomOptions, isPieRTC);
      }

      this._multiplexOpening = this._openPrimaryConnection(channelId, uuid, presence, noWebSocket)
          .finally(() => {
            this._multiplexOpening = null;
          });

      // Non-PieRTC path returns the in-flight promise directly (no extra
      // await tick) — a concurrent secondary subscribe() races against this
      // same resolution to send its own control frame, and adding a tick
      // here throws that race off (see PieSocketV4.test.js).
      if (!isPieRTC) {
        return this._multiplexOpening;
      }

      const channel = await this._multiplexOpening;
      if (!noWebSocket) {
        this.attachPieRTC(channel, roomOptions);
      }
      return channel;
    }

    if (isPieRTC && !this.options.notifySelf) {
      this.logger.warn(
          'PieSocket: PieRTC channel "' + channelId + '" is joining a socket ' +
          'that was already opened without notifySelf — pass notifySelf: true ' +
          'to the PieSocket constructor if peers need their own signalling echoed back.',
      );
    }

    // Shared socket already exists — subscribe with a control frame.
    const jwt = await this.resolveAuth(channelId);
    const channel = new Channel(null, null, false);
    channel.attachToConnection(this._multiplex, channelId, {...this.options, channelId});
    channel.uuid = uuid;
    const params = this.buildSubscribeParams(channelId, presence, uuid, jwt);
    channel.subscribeParams = params;

    if (!noWebSocket) {
      await this._multiplex.subscribeChannel(channelId, params);
    }

    this._multiplex.attachChannel(channelId, channel);
    this.connections[channelId] = channel;

    if (isPieRTC && !noWebSocket) {
      this.attachPieRTC(channel, roomOptions);
    }

    return channel;
  }

  attachPieRTC(channel, roomOptions) {
    channel.pieRTC = new PieRTC(channel, {
      ...this.options,
      ...roomOptions,
    });
  }

  async _openPrimaryConnection(channelId, uuid, presence, noWebSocket) {
    const endpoint = await this.getEndpoint(channelId, uuid);

    return new Promise((resolve, reject) => {
      const conn = new Connection(endpoint, this.options, channelId);
      this._multiplex = conn;

      const channel = new Channel(null, null, false);
      channel.attachToConnection(conn, channelId, {...this.options, channelId});
      channel.uuid = uuid;
      channel.subscribeParams = this.buildSubscribeParams(
          channelId, presence, uuid, this.options.jwt || null,
      );
      conn.attachChannel(channelId, channel);

      conn.onPrimaryConnected = () => {
        this.connections[channelId] = channel;
        resolve(channel);
      };
      conn.onPrimaryError = () => {
        this._multiplex = null;
        reject('Failed to make websocket connection');
      };

      if (noWebSocket) {
        // Mirrors subscribeStandalone: resolve without waiting for onopen.
        this.connections[channelId] = channel;
        resolve(channel);
      }
    });
  }

  buildSubscribeParams(channelId, presence, uuid, jwt) {
    const params = {channel: channelId, presence: presence, uuid: uuid};
    if (jwt) {
      params.jwt = jwt;
    }
    if (this.options.userId) {
      params.user = this.options.userId;
    }
    return params;
  }

  unsubscribe(channelId) {
    const channel = this.connections[channelId];
    if (!channel) {
      return false;
    }

    // v4 multiplexed handle — no socket of its own.
    if (this._multiplex && channel.hub) {
      const conn = this._multiplex;

      if (channelId === conn.primaryChannelId) {
        const others = Object.keys(conn.channels).filter((id) => id !== channelId);
        if (others.length === 0) {
          conn.close();
          this._multiplex = null;
        } else {
          // Promote another subscription to primary and keep the rest.
          const newPrimaryId = others[0];
          const newPrimary = conn.channels[newPrimaryId];
          conn.detachChannel(channelId);
          this.getEndpoint(newPrimaryId, newPrimary.uuid)
              .then((endpoint) => conn.migratePrimary(newPrimaryId, endpoint))
              .catch((e) => this.logger.error('PieSocket: primary migration failed', e));
        }
      } else {
        conn.unsubscribeChannel(channelId).catch(() => {});
        conn.detachChannel(channelId);
      }

      delete this.connections[channelId];
      return true;
    }

    // Standalone (v3 / portal) channel owns its own socket.
    channel.shouldReconnect = false;
    if (channel.connection) {
      channel.connection.close();
    }
    delete this.connections[channelId];
    return true;
  }

  getConnections() {
    return this.connections;
  }

  async getAuthToken(channel) {
    return new Promise((resolve, reject)=>{
      const data = new FormData();
      data.append('channel_name', channel);

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          try {
            const response = JSON.parse(this.responseText);
            resolve(response);
          } catch (e) {
            reject(new InvalidAuthException('Could not fetch auth token', 'AuthEndpointResponseError'));
          }
        }
      });
      xhr.addEventListener('error', ()=>{
        reject(new InvalidAuthException('Could not fetch auth token', 'AuthEndpointError'));
      });

      xhr.open('POST', this.options.authEndpoint);

      const headers = Object.keys(this.options.authHeaders);
      headers.forEach((header) => {
        xhr.setRequestHeader(header, this.options.authHeaders[header]);
      });

      xhr.send(data);
    });
  }

  isGuarded(channel) {
    if (this.options.forceAuth) {
      return true;
    }

    return (''+channel).startsWith('private-');
  }

  /**
   * Resolve the JWT for a channel: the configured token, or one fetched from the
   * auth endpoint for guarded channels. Returns null when none applies.
   * @param {string} channelId
   * @return {Promise<?string>}
   */
  async resolveAuth(channelId) {
    if (this.options.jwt) {
      return this.options.jwt;
    }
    if (this.isGuarded(channelId)) {
      const auth = await this.getAuthToken(channelId);
      if (auth && auth.auth) {
        return auth.auth;
      }
    }
    return null;
  }

  async getEndpoint(channelId, uuid, version) {
    version = version || this.options.version;
    const clusterDomain = this.options.clusterDomain == null ? `${this.options.clusterId}.piesocket.com` : this.options.clusterDomain;
    const protocol = this.options.ssl ? 'wss' : 'ws';
    const query = `api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${SDK_VERSION}&presence=${this.options.presence}`;
    let endpoint = `${protocol}://${clusterDomain}/v${version}/${channelId}?${query}`;

    // Set auth
    const jwt = await this.resolveAuth(channelId);
    if (jwt) {
      endpoint = endpoint + '&jwt=' + jwt;
    }

    // Set user identity
    if (this.options.userId) {
      endpoint = endpoint + '&user='+this.options.userId;
    }

    // Add uuid
    endpoint = endpoint+'&uuid='+uuid;

    return endpoint;
  }
}
