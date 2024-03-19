import Channel from './Channel.js';
import Logger from './Logger.js';
import Portal from './Portal.js';
import InvalidAuthException from './InvalidAuthException.js';
import defaultOptions from './misc/DefaultOptions.js';
import {v4 as uuidv4} from 'uuid';

export default class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {...defaultOptions, ...options};
    this.connections = {};
    this.logger = new Logger(this.options);
  }

  async subscribe(channelId, roomOptions={}) {
    return new Promise(async (resolve, reject) => {
      if (roomOptions.video || roomOptions.audio || roomOptions.portal) {
        // Force config when video is required
        this.options.notifySelf = true;
      }

      const uuid = uuidv4();
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
            if (roomOptions.video || roomOptions.audio || roomOptions.portal) {
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

  unsubscribe(channelId) {
    if (this.connections[channelId]) {
      this.connections[channelId].shouldReconnect = false;
      this.connections[channelId].connection.close();
      delete this.connections[channelId];
      return true;
    }

    return false;
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

  async getEndpoint(channelId, uuid) {
    const clusterDomain = this.options.clusterDomain == null ? `${this.options.clusterId}.piesocket.com`:this.options.clusterDomain;
    let endpoint = `wss://${clusterDomain}/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=5.0.8&presence=${this.options.presence}`;

    // Set auth
    if (this.options.jwt) {
      endpoint = endpoint+'&jwt='+this.options.jwt;
    } else if (this.isGuarded(channelId)) {
      const auth = await this.getAuthToken(channelId);
      if (auth.auth) {
        endpoint = endpoint + '&jwt='+auth.auth;
      }
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
