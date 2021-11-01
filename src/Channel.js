import Logger from './Logger.js';
import Blockchain from './Blockchain';

export default class Channel {

    constructor(endpoint, identity, init=true) {
        this.events = {};


        if(!init){
            return;
        }

        this.init(endpoint, identity);
    }

    init(endpoint, identity){        
        this.endpoint = endpoint;
        this.identity = identity;
        this.connection = this.connect();
        this.shouldReconnect = false;
        this.logger = new Logger(identity);

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

    send(data){
        return this.connection.send(data);
    }

    sendOnBlockchain(data) {
        if (!this.blockchain) {
            this.blockchain = new Blockchain(this.identity.apiKey, this.identity.channelId);
        }
        this.blockchain.send(data)
            .then((hash) => {
                return this.connection.send(JSON.stringify({ "message": data, "transaction_id": hash }));
            })
            .catch((e) => {
                if (this.events['blockchain-error']) {
                    this.events['blockchain-error'].bind(this)(e);
                }
            });
    }

    confirmOnBlockchain(transactionHash) {
        if (!this.blockchain) {
            this.blockchain = new Blockchain(identity.apiKey, identity.channelId);
        }

        this.blockchain.confirm(transactionHash)
            .then((hash) => {
                return this.connection.send(JSON.stringify({ "event": "confirm-transaction", "transaction_id": hash }));
            })
            .catch((e) => {
                if (this.events['blockchain-error']) {
                    this.events['blockchain-error'].bind(this)(e);
                }
            });
    }

    onMessage(e) {
        this.logger.log('Channel message:', e);

        try {
            var message = JSON.parse(e.data);
            if (message.error && message.error.length) {
                this.shouldReconnect = false;
            }
        } catch (jsonException) {
            console.error(jsonException);
        }

        //User defined callback
        if (this.events['message']) {
            this.events['message'].bind(this)(e);
        }
    }

    onOpen(e) {
        this.logger.log('Channel connected:', e);
        this.shouldReconnect = true;

        //User defined callback
        if (this.events['open']) {
            this.events['open'].bind(this)(e);
        }
    }

    onError(e) {
        this.logger.error('Channel error:', e);
        this.connection.close();

        //User defined callback
        if (this.events['error']) {
            this.events['error'].bind(this)(e);
        }
    }

    onClose(e) {
        this.logger.warn('Channel closed:', e);
        this.reconnect();

        //User defined callback
        if (this.events['close']) {
            this.events['close'].bind(this)(e);
        }
    }

    reconnect() {
        if (!this.shouldReconnect) {
            return;
        }
        this.logger.log("Reconnecting");
        this.connect();
    }


}