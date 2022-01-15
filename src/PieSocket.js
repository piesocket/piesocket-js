import Channel from './Channel.js';
import Logger from './Logger.js';
import pjson from '../package.json';
import InvalidAuthException from './InvalidAuthException.js';
import defaultOptions from './misc/DefaultOptions.js';

export default class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {...defaultOptions, ...options};
    this.connections = {};
    this.logger = new Logger(this.options);
  }

  subscribe(channelId) {
    const makeEndpoint = this.getEndpoint(channelId);

    if (this.connections[channelId]) {
      this.logger.log('Returning existing channel', channelId);
      return this.connections[channelId];
    }

    this.logger.log('Creating new channel', channelId);
    const channel = new Channel(null, null, false);

    makeEndpoint.then((endpoint)=>{
      channel.init(endpoint, {
        channelId: channelId,
        ...this.options,
      });
    });

    this.connections[channelId] = channel;
    return channel;
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

  async getEndpoint(channelId) {
    let endpoint = `wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${pjson.version}&presence=${this.options.presence}`;

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

    return endpoint;
  }
}
