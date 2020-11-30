import Channel from './Channel';
const defaultOptions = {
    version: 3,
    cluster_id: 'demo',
    api_key: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm'
}

export default class PieSocket {

    constructor(options) {
        options = options || {};

        this.options = {...defaultOptions, ...options };
        this.connections = {}
        console.log(this.options);
    }

    subscribe(channelId) {
        var endpoint = this.getEndpoint(channelId);
        if (this.connections[channelId]) {
            console.log("Returning existing channel", endpoint);
            return this.connections[channelId];
        }

        console.log("Creating new channel", endpoint);
        var channel = new Channel(endpoint);
        this.connections[channelId] = channel;
    }

    getEndpoint(channelId) {
        return `wss://${this.options.cluster_id}.websocket.me/v${this.options.version}/${channelId}?api_key=${this.options.api_key}`
    }
}