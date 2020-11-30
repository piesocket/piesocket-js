export default class Channel {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.connection = this.connect();
        this.events = {};
    }

    connect() {
        var connection = new WebSocket(this.endpoint);
        connection.onmessage = this.onMessage.bind(this);
        connection.onopen = this.onOpen.bind(this);
        connection.onerror = this.onError.bind(this);
        connection.onclose = this.onClose.bind(this);

        return connection;
    }

    on(event, callback) {
        //Register user defined callbacks
        this.events[event] = callback;
    }


    onMessage(e) {
        console.log('Channel message:', e);

        //User defined callback
        if (this.events['message']) {
            this.events['message'](e);
        }
    }

    onOpen(e) {
        console.log('Channel connected:', e);

        //User defined callback
        if (this.events['open']) {
            this.events['open'](e);
        }
    }

    onError(e) {
        console.error('Channel error:', e);

        //User defined callback
        if (this.events['error']) {
            this.events['error'](e);
        }
    }

    onClose(e) {
        console.warn('Channel closed:', e);

        //User defined callback
        if (this.events['close']) {
            this.events['close'](e);
        }
    }


}