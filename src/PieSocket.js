import Channel from './Channel.js';
import Logger from './Logger.js';
import pjson from '../package.json';

const defaultOptions = {
    version: 3,
    clusterId: 'demo',
    apiKey: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm',
    consoleLogs: false,
    notifySelf: true,
    jwt: null,
}

export default class PieSocket {

    constructor(options) {
        options = options || {};

        this.options = {...defaultOptions, ...options };
        this.connections = {}
        this.logger = new Logger(this.options);
    }

    subscribe(channelId) {
        var endpoint = this.getEndpoint(channelId);

        if (this.connections[channelId]) {
            this.logger.log("Returning existing channel", endpoint);
            return this.connections[channelId];
        }

        this.logger.log("Creating new channel", endpoint);
        var channel = new Channel(endpoint, {
            channelId: channelId,
            ...this.options
        });
        this.connections[channelId] = channel;
        return channel;
    }

    unsubscribe(channelId){
        if(this.connections[channelId]){
            this.connections[channelId].shouldReconnect = false;
            this.connections[channelId].connection.close();
            delete this.connections[channelId];
            return true;
        }

        return false;
    }

    getConnections(){
        return this.connections;
    }

    getEndpoint(channelId) {
        let endpoint = `wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${pjson.version}`
        if(this.options.jwt){
            endpoint = endpoint+"&jwt="+this.options.jwt;
        }
        return endpoint;
    }
}