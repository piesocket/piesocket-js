import Logger from './Logger.js';
import Blockchain from './Blockchain';

export default class Channel {

    constructor(endpoint, identity, init=true) {
        this.events = {};
        this.listeners = {};

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
        //Register lifecycle callbacks
        this.events[event] = callback;
    }

    listen(event, callback) {
        //Register user defined callbacks
        this.listeners[event] = callback;
    }


    send(data){
        return this.connection.send(data);
    }

    publish(event, data, meta) {
        if (meta && meta.blockchain) {
            return this.sendOnBlockchain(event, data, meta);
        }
        return this.connection.send(JSON.stringify({
            event: event,
            data: data,
            meta: meta
        }));
    }


    sendOnBlockchain(event, data, meta) {
        if (!this.blockchain) {
            this.blockchain = new Blockchain(this.identity);
        }
        this.blockchain.send(data)
            .then((receipt) => {
                if (this.events['blockchain-hash']) {
                    this.events['blockchain-hash'].bind(this)({
                        event: event,
                        data: data,
                        meta: meta,
                        transactionHash: receipt.hash
                    });
                }
                return this.connection.send(JSON.stringify({ "event": event, "data": data, "meta": { ...meta, "transaction_id": receipt.id, "transaction_hash": receipt.hash } }));
            })
            .catch((e) => {
                if (this.events['blockchain-error']) {
                    this.events['blockchain-error'].bind(this)(e);
                }
            });
    }

    confirmOnBlockchain(event, transactionHash) {
        if (!this.blockchain) {
            this.blockchain = new Blockchain(this.identity);
        }

        this.blockchain.confirm(transactionHash)
            .then((hash) => {
                if (this.events['blockchain-hash']) {
                    this.events['blockchain-hash'].bind(this)({
                        event: event,
                        confirmationHash: transactionHash,
                        transactionHash: hash
                    });
                }
                return this.connection.send(JSON.stringify({ "event": event, "data": transactionHash, "meta": { "transaction_id": 1, "transaction_hash": hash } }));
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

            // Fire event listeners
            if (message.event) {
                if (this.listeners[message.event]) {
                    this.listeners[message.event].bind(this)(message.data, message.meta);
                }

                if (this.listeners["*"]) {
                    this.listeners["*"].bind(this)(message.event, message.data, message.meta);
                }
            }
        } catch (jsonException) {
            console.error(jsonException);
        }

        //Fire lifecycle callback
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