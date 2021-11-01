var PieSocket;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Blockchain.js":
/*!***************************!*\
  !*** ./src/Blockchain.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Blockchain)
/* harmony export */ });
/* harmony import */ var _PieMessage_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PieMessage.json */ "./src/PieMessage.json");

const BCMEndpoint = 'https://www.piesocket.com/api/blockchain/payloadHash';
const PieMessageAddress = '0x2321c321828946153a845e69ee168f413e85c90d';

class Blockchain {

	constructor(apiKey, channel) {
		this.apiKey = apiKey;
		this.channel = channel;

		if (this.checkWeb3()) {
			this.init();
		}
	}

	async init() {
		const w3 = new Web3(window.ethereum);
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		this.account = accounts[0];

		this.contract = new w3.eth.Contract(_PieMessage_json__WEBPACK_IMPORTED_MODULE_0__.abi, PieMessageAddress);
	}

	checkWeb3() {
		if (typeof Web3 == 'undefined') {
			console.error('Web.js is not installed!');
			return false;
		}

		if (typeof window.ethereum == 'undefined') {
			console.error('MetaMask is not installed!');
			return false;
		}

		return true;
	}

	async confirm(hash) {
		return new Promise(async (resolve, reject) => {

			if (this.checkWeb3()) {
				const receipt = this.contract.methods.confirm(hash).send({ from: this.account });
				receipt.on('transactionHash', resolve)
				receipt.on('error', (error) => {
					reject(error);
				});
			}

		});
	}

	async send(message) {
		return new Promise(async (resolve, reject) => {

			if (this.checkWeb3()) {

				const bacmHash = await this.getTransactionHash(message);

				const receipt = this.contract.methods.send(bacmHash).send({ from: this.account });
				receipt.on('transactionHash', resolve)
				receipt.on('error', (error) => {
					reject(error);
				});

			} else {
				reject()
			}
		});
	}

	async getTransactionHash(message) {
		return new Promise((resolve, reject) => {
			var data = new FormData();

			data.append("apiKey", this.apiKey);
			data.append("channel", this.channel);
			data.append("message", message);

			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					try {
						const response = JSON.parse(this.responseText);
						if (response.errors) {
							console.error(`PieSocket Error: ${JSON.stringify(response.errors)}`);
							reject();
						}

						if (response.success) {
							resolve(response.success);
						} else {
							reject("Unknown error");
						}
					} catch (e) {
						console.error("Could not connect to Blockchain Messaging API, try later");
						reject();
					}
				}
			});
			xhr.addEventListener('error', () => {
				console.error("Blockchain Messaging API seems unreachable at the moment, try later");
				reject();
			});

			xhr.open("POST", BCMEndpoint);
			xhr.setRequestHeader("Accept", "application/json");
			xhr.send(data);
		});
	}
}

/***/ }),

/***/ "./src/Channel.js":
/*!************************!*\
  !*** ./src/Channel.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Channel)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _Blockchain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Blockchain */ "./src/Blockchain.js");



class Channel {

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
        this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](identity);

        this.blockchain = new _Blockchain__WEBPACK_IMPORTED_MODULE_1__["default"](identity.apiKey, identity.channelId);
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

/***/ }),

/***/ "./src/InvalidAuthException.js":
/*!*************************************!*\
  !*** ./src/InvalidAuthException.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InvalidAuthException)
/* harmony export */ });
class InvalidAuthException{
  constructor(message, name="InvalidAuthException") {
    this.message = "Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication";
    this.name = name;  
  }
}

/***/ }),

/***/ "./src/Logger.js":
/*!***********************!*\
  !*** ./src/Logger.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Logger)
/* harmony export */ });
class Logger {

    constructor(options) {
        this.options = options;
    }

    log(...data) {
        if (this.options.consoleLogs) {
            console.log(...data);
        }
    }

    warn(...data) {
        if (this.options.consoleLogs) {
            console.warn(...data);
        }
    }

    error(...data) {
        if (this.options.consoleLogs) {
            console.error(...data);
        }
    }

}

/***/ }),

/***/ "./src/PieSocket.js":
/*!**************************!*\
  !*** ./src/PieSocket.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PieSocket)
/* harmony export */ });
/* harmony import */ var _Channel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Channel.js */ "./src/Channel.js");
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../package.json */ "./package.json");
/* harmony import */ var _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InvalidAuthException.js */ "./src/InvalidAuthException.js");





const defaultOptions = {
    version: 3,
    clusterId: 'demo',
    apiKey: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm',
    consoleLogs: false,
    notifySelf: 0,
    jwt: null,
    presence: 0,
    authEndpoint: "/broadcasting/auth",
    authHeaders: {},
    forceAuth: false, 
    userId: null
}

class PieSocket {

    constructor(options) {
        options = options || {};

        this.options = {...defaultOptions, ...options };
        this.connections = {}
        this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.options);
    }

    subscribe(channelId) {
        var makeEndpoint = this.getEndpoint(channelId);

        if (this.connections[channelId]) {
            this.logger.log("Returning existing channel", channelId);
            return this.connections[channelId];
        }
        
        this.logger.log("Creating new channel", channelId);
        var channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, null, false);

        makeEndpoint.then((endpoint)=>{
            channel.init(endpoint, {
                channelId: channelId,
                ...this.options
            });
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

    async getAuthToken(channel){
        return new Promise((resolve, reject)=>{
            var data = new FormData();
            data.append("channel_name", channel);
    
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
    
            xhr.addEventListener("readystatechange", function() {
                if(this.readyState === 4) {
                    try{
                        const response =  JSON.parse(this.responseText);
                        resolve(response);
                    }catch(e){
                        reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]("Could not fetch auth token", "AuthEndpointResponseError"));
                    }
                }
            });
            xhr.addEventListener('error', ()=>{
                reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]("Could not fetch auth token", "AuthEndpointError"));
            });

            xhr.open("POST", this.options.authEndpoint);

            const headers = Object.keys(this.options.authHeaders);
            headers.forEach(header => {
                xhr.setRequestHeader(header, this.options.authHeaders[header]);
            });
    
            xhr.send(data); 
        });
    }

    isGuarded(channel){
        if(this.options.forceAuth){
            return true;
        }

        return (""+channel).startsWith("private-");
    }

    async getEndpoint(channelId) {
        let endpoint = `wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${_package_json__WEBPACK_IMPORTED_MODULE_2__.version}&presence=${this.options.presence}`

        //Set auth
        if(this.options.jwt){
            endpoint = endpoint+"&jwt="+this.options.jwt;
        }
        else if(this.isGuarded(channelId)){
            const auth = await this.getAuthToken(channelId);
            if(auth.auth){
                endpoint = endpoint + "&jwt="+auth.auth;
            }
        }

        //Set user identity
        if(this.options.userId){
            endpoint = endpoint + "&user="+this.options.userId;
        }

        return endpoint;
    }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./PieSocket */ "./src/PieSocket.js")["default"];

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"piesocket-js","version":"1.2.4","description":"PieSocket Javascript Client","main":"src/index.js","unpkg":"dist/piesocket.js","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","start":"NODE_ENV=development webpack serve --mode=development --config webpack.dev.js ","build":"webpack --mode=production --config webpack.prod.js","prepare":"npm run build","watch":"webpack --mode=development --config webpack.dev.js --watch"},"repository":{"type":"git","url":"git+https://github.com/piesocket/piesocket-js.git"},"keywords":["piesocket","client","websocket","pubsub","http"],"author":"PieSocket","license":"MIT","bugs":{"url":"https://github.com/piesocket/piesocket-js/issues"},"homepage":"https://github.com/piesocket/piesocket-js#readme","devDependencies":{"@webpack-cli/serve":"^1.1.0","webpack":"^5.9.0","webpack-cli":"^4.2.0","webpack-dev-server":"^3.11.2","webpack-merge":"^5.4.0"}}');

/***/ }),

/***/ "./src/PieMessage.json":
/*!*****************************!*\
  !*** ./src/PieMessage.json ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"contractName":"PieMessage","abi":[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"string","name":"transaction_hash","type":"string"}],"name":"Confirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"string","name":"payload","type":"string"}],"name":"Sent","type":"event"},{"inputs":[{"internalType":"string","name":"payload","type":"string"}],"name":"send","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"transaction_hash","type":"string"}],"name":"confirm","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],"metadata":"{\\"compiler\\":{\\"version\\":\\"0.8.9+commit.e5eed63a\\"},\\"language\\":\\"Solidity\\",\\"output\\":{\\"abi\\":[{\\"anonymous\\":false,\\"inputs\\":[{\\"indexed\\":true,\\"internalType\\":\\"address\\",\\"name\\":\\"sender\\",\\"type\\":\\"address\\"},{\\"indexed\\":true,\\"internalType\\":\\"string\\",\\"name\\":\\"transaction_hash\\",\\"type\\":\\"string\\"}],\\"name\\":\\"Confirmed\\",\\"type\\":\\"event\\"},{\\"anonymous\\":false,\\"inputs\\":[{\\"indexed\\":true,\\"internalType\\":\\"address\\",\\"name\\":\\"sender\\",\\"type\\":\\"address\\"},{\\"indexed\\":true,\\"internalType\\":\\"string\\",\\"name\\":\\"payload\\",\\"type\\":\\"string\\"}],\\"name\\":\\"Sent\\",\\"type\\":\\"event\\"},{\\"inputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"transaction_hash\\",\\"type\\":\\"string\\"}],\\"name\\":\\"confirm\\",\\"outputs\\":[{\\"internalType\\":\\"bool\\",\\"name\\":\\"\\",\\"type\\":\\"bool\\"}],\\"stateMutability\\":\\"nonpayable\\",\\"type\\":\\"function\\"},{\\"inputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"payload\\",\\"type\\":\\"string\\"}],\\"name\\":\\"send\\",\\"outputs\\":[{\\"internalType\\":\\"bool\\",\\"name\\":\\"\\",\\"type\\":\\"bool\\"}],\\"stateMutability\\":\\"nonpayable\\",\\"type\\":\\"function\\"}],\\"devdoc\\":{\\"kind\\":\\"dev\\",\\"methods\\":{},\\"version\\":1},\\"userdoc\\":{\\"kind\\":\\"user\\",\\"methods\\":{},\\"version\\":1}},\\"settings\\":{\\"compilationTarget\\":{\\"project:/contracts/PieMessage.sol\\":\\"PieMessage\\"},\\"evmVersion\\":\\"london\\",\\"libraries\\":{},\\"metadata\\":{\\"bytecodeHash\\":\\"ipfs\\"},\\"optimizer\\":{\\"enabled\\":false,\\"runs\\":200},\\"remappings\\":[]},\\"sources\\":{\\"project:/contracts/PieMessage.sol\\":{\\"keccak256\\":\\"0x9c7fd072b12b9cfd1d346a301a45812c72e7989a14dda9e3eddbc9b1ed469730\\",\\"license\\":\\"MIT\\",\\"urls\\":[\\"bzz-raw://5b50f896c5bcdf8293a81770c5bc9b3d143a4780ec82ef7f61e8c91f464545c4\\",\\"dweb:/ipfs/QmSb8eKYU6ooisYUcnoeax5uJ9d5f4XZymKQ8wRMonpeUs\\"]}},\\"version\\":1}","bytecode":"0x608060405234801561001057600080fd5b50610403806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806366792ba11461003b578063c7ab74a41461006b575b600080fd5b610055600480360381019061005091906102bd565b61009b565b6040516100629190610321565b60405180910390f35b610085600480360381019061008091906102bd565b6100ff565b6040516100929190610321565b60405180910390f35b6000816040516100ab91906103b6565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f2873db4c443f2bdfc1ca9161c995c63088d84fd7ce820c720d1aa338f8df3ac560405160405180910390a360019050919050565b60008160405161010f91906103b6565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f32ca789b21b5e34d5ccf1f368636531fed1844b1063c788dbe989e515b2d756f60405160405180910390a360019050919050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6101ca82610181565b810181811067ffffffffffffffff821117156101e9576101e8610192565b5b80604052505050565b60006101fc610163565b905061020882826101c1565b919050565b600067ffffffffffffffff82111561022857610227610192565b5b61023182610181565b9050602081019050919050565b82818337600083830152505050565b600061026061025b8461020d565b6101f2565b90508281526020810184848401111561027c5761027b61017c565b5b61028784828561023e565b509392505050565b600082601f8301126102a4576102a3610177565b5b81356102b484826020860161024d565b91505092915050565b6000602082840312156102d3576102d261016d565b5b600082013567ffffffffffffffff8111156102f1576102f0610172565b5b6102fd8482850161028f565b91505092915050565b60008115159050919050565b61031b81610306565b82525050565b60006020820190506103366000830184610312565b92915050565b600081519050919050565b600081905092915050565b60005b83811015610370578082015181840152602081019050610355565b8381111561037f576000848401525b50505050565b60006103908261033c565b61039a8185610347565b93506103aa818560208601610352565b80840191505092915050565b60006103c28284610385565b91508190509291505056fea2646970667358221220eb1d5e353469a7d596d9b56b36620c4aeb3f651e25653203a71fba21f10b8d8d64736f6c63430008090033","deployedBytecode":"0x608060405234801561001057600080fd5b50600436106100365760003560e01c806366792ba11461003b578063c7ab74a41461006b575b600080fd5b610055600480360381019061005091906102bd565b61009b565b6040516100629190610321565b60405180910390f35b610085600480360381019061008091906102bd565b6100ff565b6040516100929190610321565b60405180910390f35b6000816040516100ab91906103b6565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f2873db4c443f2bdfc1ca9161c995c63088d84fd7ce820c720d1aa338f8df3ac560405160405180910390a360019050919050565b60008160405161010f91906103b6565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f32ca789b21b5e34d5ccf1f368636531fed1844b1063c788dbe989e515b2d756f60405160405180910390a360019050919050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6101ca82610181565b810181811067ffffffffffffffff821117156101e9576101e8610192565b5b80604052505050565b60006101fc610163565b905061020882826101c1565b919050565b600067ffffffffffffffff82111561022857610227610192565b5b61023182610181565b9050602081019050919050565b82818337600083830152505050565b600061026061025b8461020d565b6101f2565b90508281526020810184848401111561027c5761027b61017c565b5b61028784828561023e565b509392505050565b600082601f8301126102a4576102a3610177565b5b81356102b484826020860161024d565b91505092915050565b6000602082840312156102d3576102d261016d565b5b600082013567ffffffffffffffff8111156102f1576102f0610172565b5b6102fd8482850161028f565b91505092915050565b60008115159050919050565b61031b81610306565b82525050565b60006020820190506103366000830184610312565b92915050565b600081519050919050565b600081905092915050565b60005b83811015610370578082015181840152602081019050610355565b8381111561037f576000848401525b50505050565b60006103908261033c565b61039a8185610347565b93506103aa818560208601610352565b80840191505092915050565b60006103c28284610385565b91508190509291505056fea2646970667358221220eb1d5e353469a7d596d9b56b36620c4aeb3f651e25653203a71fba21f10b8d8d64736f6c63430008090033","immutableReferences":{},"generatedSources":[],"deployedGeneratedSources":[{"ast":{"nodeType":"YulBlock","src":"0:4723:2","statements":[{"body":{"nodeType":"YulBlock","src":"47:35:2","statements":[{"nodeType":"YulAssignment","src":"57:19:2","value":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"73:2:2","type":"","value":"64"}],"functionName":{"name":"mload","nodeType":"YulIdentifier","src":"67:5:2"},"nodeType":"YulFunctionCall","src":"67:9:2"},"variableNames":[{"name":"memPtr","nodeType":"YulIdentifier","src":"57:6:2"}]}]},"name":"allocate_unbounded","nodeType":"YulFunctionDefinition","returnVariables":[{"name":"memPtr","nodeType":"YulTypedName","src":"40:6:2","type":""}],"src":"7:75:2"},{"body":{"nodeType":"YulBlock","src":"177:28:2","statements":[{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"194:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"197:1:2","type":"","value":"0"}],"functionName":{"name":"revert","nodeType":"YulIdentifier","src":"187:6:2"},"nodeType":"YulFunctionCall","src":"187:12:2"},"nodeType":"YulExpressionStatement","src":"187:12:2"}]},"name":"revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b","nodeType":"YulFunctionDefinition","src":"88:117:2"},{"body":{"nodeType":"YulBlock","src":"300:28:2","statements":[{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"317:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"320:1:2","type":"","value":"0"}],"functionName":{"name":"revert","nodeType":"YulIdentifier","src":"310:6:2"},"nodeType":"YulFunctionCall","src":"310:12:2"},"nodeType":"YulExpressionStatement","src":"310:12:2"}]},"name":"revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db","nodeType":"YulFunctionDefinition","src":"211:117:2"},{"body":{"nodeType":"YulBlock","src":"423:28:2","statements":[{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"440:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"443:1:2","type":"","value":"0"}],"functionName":{"name":"revert","nodeType":"YulIdentifier","src":"433:6:2"},"nodeType":"YulFunctionCall","src":"433:12:2"},"nodeType":"YulExpressionStatement","src":"433:12:2"}]},"name":"revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d","nodeType":"YulFunctionDefinition","src":"334:117:2"},{"body":{"nodeType":"YulBlock","src":"546:28:2","statements":[{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"563:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"566:1:2","type":"","value":"0"}],"functionName":{"name":"revert","nodeType":"YulIdentifier","src":"556:6:2"},"nodeType":"YulFunctionCall","src":"556:12:2"},"nodeType":"YulExpressionStatement","src":"556:12:2"}]},"name":"revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae","nodeType":"YulFunctionDefinition","src":"457:117:2"},{"body":{"nodeType":"YulBlock","src":"628:54:2","statements":[{"nodeType":"YulAssignment","src":"638:38:2","value":{"arguments":[{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"656:5:2"},{"kind":"number","nodeType":"YulLiteral","src":"663:2:2","type":"","value":"31"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"652:3:2"},"nodeType":"YulFunctionCall","src":"652:14:2"},{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"672:2:2","type":"","value":"31"}],"functionName":{"name":"not","nodeType":"YulIdentifier","src":"668:3:2"},"nodeType":"YulFunctionCall","src":"668:7:2"}],"functionName":{"name":"and","nodeType":"YulIdentifier","src":"648:3:2"},"nodeType":"YulFunctionCall","src":"648:28:2"},"variableNames":[{"name":"result","nodeType":"YulIdentifier","src":"638:6:2"}]}]},"name":"round_up_to_mul_of_32","nodeType":"YulFunctionDefinition","parameters":[{"name":"value","nodeType":"YulTypedName","src":"611:5:2","type":""}],"returnVariables":[{"name":"result","nodeType":"YulTypedName","src":"621:6:2","type":""}],"src":"580:102:2"},{"body":{"nodeType":"YulBlock","src":"716:152:2","statements":[{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"733:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"736:77:2","type":"","value":"35408467139433450592217433187231851964531694900788300625387963629091585785856"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"726:6:2"},"nodeType":"YulFunctionCall","src":"726:88:2"},"nodeType":"YulExpressionStatement","src":"726:88:2"},{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"830:1:2","type":"","value":"4"},{"kind":"number","nodeType":"YulLiteral","src":"833:4:2","type":"","value":"0x41"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"823:6:2"},"nodeType":"YulFunctionCall","src":"823:15:2"},"nodeType":"YulExpressionStatement","src":"823:15:2"},{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"854:1:2","type":"","value":"0"},{"kind":"number","nodeType":"YulLiteral","src":"857:4:2","type":"","value":"0x24"}],"functionName":{"name":"revert","nodeType":"YulIdentifier","src":"847:6:2"},"nodeType":"YulFunctionCall","src":"847:15:2"},"nodeType":"YulExpressionStatement","src":"847:15:2"}]},"name":"panic_error_0x41","nodeType":"YulFunctionDefinition","src":"688:180:2"},{"body":{"nodeType":"YulBlock","src":"917:238:2","statements":[{"nodeType":"YulVariableDeclaration","src":"927:58:2","value":{"arguments":[{"name":"memPtr","nodeType":"YulIdentifier","src":"949:6:2"},{"arguments":[{"name":"size","nodeType":"YulIdentifier","src":"979:4:2"}],"functionName":{"name":"round_up_to_mul_of_32","nodeType":"YulIdentifier","src":"957:21:2"},"nodeType":"YulFunctionCall","src":"957:27:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"945:3:2"},"nodeType":"YulFunctionCall","src":"945:40:2"},"variables":[{"name":"newFreePtr","nodeType":"YulTypedName","src":"931:10:2","type":""}]},{"body":{"nodeType":"YulBlock","src":"1096:22:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"panic_error_0x41","nodeType":"YulIdentifier","src":"1098:16:2"},"nodeType":"YulFunctionCall","src":"1098:18:2"},"nodeType":"YulExpressionStatement","src":"1098:18:2"}]},"condition":{"arguments":[{"arguments":[{"name":"newFreePtr","nodeType":"YulIdentifier","src":"1039:10:2"},{"kind":"number","nodeType":"YulLiteral","src":"1051:18:2","type":"","value":"0xffffffffffffffff"}],"functionName":{"name":"gt","nodeType":"YulIdentifier","src":"1036:2:2"},"nodeType":"YulFunctionCall","src":"1036:34:2"},{"arguments":[{"name":"newFreePtr","nodeType":"YulIdentifier","src":"1075:10:2"},{"name":"memPtr","nodeType":"YulIdentifier","src":"1087:6:2"}],"functionName":{"name":"lt","nodeType":"YulIdentifier","src":"1072:2:2"},"nodeType":"YulFunctionCall","src":"1072:22:2"}],"functionName":{"name":"or","nodeType":"YulIdentifier","src":"1033:2:2"},"nodeType":"YulFunctionCall","src":"1033:62:2"},"nodeType":"YulIf","src":"1030:88:2"},{"expression":{"arguments":[{"kind":"number","nodeType":"YulLiteral","src":"1134:2:2","type":"","value":"64"},{"name":"newFreePtr","nodeType":"YulIdentifier","src":"1138:10:2"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"1127:6:2"},"nodeType":"YulFunctionCall","src":"1127:22:2"},"nodeType":"YulExpressionStatement","src":"1127:22:2"}]},"name":"finalize_allocation","nodeType":"YulFunctionDefinition","parameters":[{"name":"memPtr","nodeType":"YulTypedName","src":"903:6:2","type":""},{"name":"size","nodeType":"YulTypedName","src":"911:4:2","type":""}],"src":"874:281:2"},{"body":{"nodeType":"YulBlock","src":"1202:88:2","statements":[{"nodeType":"YulAssignment","src":"1212:30:2","value":{"arguments":[],"functionName":{"name":"allocate_unbounded","nodeType":"YulIdentifier","src":"1222:18:2"},"nodeType":"YulFunctionCall","src":"1222:20:2"},"variableNames":[{"name":"memPtr","nodeType":"YulIdentifier","src":"1212:6:2"}]},{"expression":{"arguments":[{"name":"memPtr","nodeType":"YulIdentifier","src":"1271:6:2"},{"name":"size","nodeType":"YulIdentifier","src":"1279:4:2"}],"functionName":{"name":"finalize_allocation","nodeType":"YulIdentifier","src":"1251:19:2"},"nodeType":"YulFunctionCall","src":"1251:33:2"},"nodeType":"YulExpressionStatement","src":"1251:33:2"}]},"name":"allocate_memory","nodeType":"YulFunctionDefinition","parameters":[{"name":"size","nodeType":"YulTypedName","src":"1186:4:2","type":""}],"returnVariables":[{"name":"memPtr","nodeType":"YulTypedName","src":"1195:6:2","type":""}],"src":"1161:129:2"},{"body":{"nodeType":"YulBlock","src":"1363:241:2","statements":[{"body":{"nodeType":"YulBlock","src":"1468:22:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"panic_error_0x41","nodeType":"YulIdentifier","src":"1470:16:2"},"nodeType":"YulFunctionCall","src":"1470:18:2"},"nodeType":"YulExpressionStatement","src":"1470:18:2"}]},"condition":{"arguments":[{"name":"length","nodeType":"YulIdentifier","src":"1440:6:2"},{"kind":"number","nodeType":"YulLiteral","src":"1448:18:2","type":"","value":"0xffffffffffffffff"}],"functionName":{"name":"gt","nodeType":"YulIdentifier","src":"1437:2:2"},"nodeType":"YulFunctionCall","src":"1437:30:2"},"nodeType":"YulIf","src":"1434:56:2"},{"nodeType":"YulAssignment","src":"1500:37:2","value":{"arguments":[{"name":"length","nodeType":"YulIdentifier","src":"1530:6:2"}],"functionName":{"name":"round_up_to_mul_of_32","nodeType":"YulIdentifier","src":"1508:21:2"},"nodeType":"YulFunctionCall","src":"1508:29:2"},"variableNames":[{"name":"size","nodeType":"YulIdentifier","src":"1500:4:2"}]},{"nodeType":"YulAssignment","src":"1574:23:2","value":{"arguments":[{"name":"size","nodeType":"YulIdentifier","src":"1586:4:2"},{"kind":"number","nodeType":"YulLiteral","src":"1592:4:2","type":"","value":"0x20"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"1582:3:2"},"nodeType":"YulFunctionCall","src":"1582:15:2"},"variableNames":[{"name":"size","nodeType":"YulIdentifier","src":"1574:4:2"}]}]},"name":"array_allocation_size_t_string_memory_ptr","nodeType":"YulFunctionDefinition","parameters":[{"name":"length","nodeType":"YulTypedName","src":"1347:6:2","type":""}],"returnVariables":[{"name":"size","nodeType":"YulTypedName","src":"1358:4:2","type":""}],"src":"1296:308:2"},{"body":{"nodeType":"YulBlock","src":"1661:103:2","statements":[{"expression":{"arguments":[{"name":"dst","nodeType":"YulIdentifier","src":"1684:3:2"},{"name":"src","nodeType":"YulIdentifier","src":"1689:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"1694:6:2"}],"functionName":{"name":"calldatacopy","nodeType":"YulIdentifier","src":"1671:12:2"},"nodeType":"YulFunctionCall","src":"1671:30:2"},"nodeType":"YulExpressionStatement","src":"1671:30:2"},{"expression":{"arguments":[{"arguments":[{"name":"dst","nodeType":"YulIdentifier","src":"1742:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"1747:6:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"1738:3:2"},"nodeType":"YulFunctionCall","src":"1738:16:2"},{"kind":"number","nodeType":"YulLiteral","src":"1756:1:2","type":"","value":"0"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"1731:6:2"},"nodeType":"YulFunctionCall","src":"1731:27:2"},"nodeType":"YulExpressionStatement","src":"1731:27:2"}]},"name":"copy_calldata_to_memory","nodeType":"YulFunctionDefinition","parameters":[{"name":"src","nodeType":"YulTypedName","src":"1643:3:2","type":""},{"name":"dst","nodeType":"YulTypedName","src":"1648:3:2","type":""},{"name":"length","nodeType":"YulTypedName","src":"1653:6:2","type":""}],"src":"1610:154:2"},{"body":{"nodeType":"YulBlock","src":"1854:328:2","statements":[{"nodeType":"YulAssignment","src":"1864:75:2","value":{"arguments":[{"arguments":[{"name":"length","nodeType":"YulIdentifier","src":"1931:6:2"}],"functionName":{"name":"array_allocation_size_t_string_memory_ptr","nodeType":"YulIdentifier","src":"1889:41:2"},"nodeType":"YulFunctionCall","src":"1889:49:2"}],"functionName":{"name":"allocate_memory","nodeType":"YulIdentifier","src":"1873:15:2"},"nodeType":"YulFunctionCall","src":"1873:66:2"},"variableNames":[{"name":"array","nodeType":"YulIdentifier","src":"1864:5:2"}]},{"expression":{"arguments":[{"name":"array","nodeType":"YulIdentifier","src":"1955:5:2"},{"name":"length","nodeType":"YulIdentifier","src":"1962:6:2"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"1948:6:2"},"nodeType":"YulFunctionCall","src":"1948:21:2"},"nodeType":"YulExpressionStatement","src":"1948:21:2"},{"nodeType":"YulVariableDeclaration","src":"1978:27:2","value":{"arguments":[{"name":"array","nodeType":"YulIdentifier","src":"1993:5:2"},{"kind":"number","nodeType":"YulLiteral","src":"2000:4:2","type":"","value":"0x20"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"1989:3:2"},"nodeType":"YulFunctionCall","src":"1989:16:2"},"variables":[{"name":"dst","nodeType":"YulTypedName","src":"1982:3:2","type":""}]},{"body":{"nodeType":"YulBlock","src":"2043:83:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae","nodeType":"YulIdentifier","src":"2045:77:2"},"nodeType":"YulFunctionCall","src":"2045:79:2"},"nodeType":"YulExpressionStatement","src":"2045:79:2"}]},"condition":{"arguments":[{"arguments":[{"name":"src","nodeType":"YulIdentifier","src":"2024:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"2029:6:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"2020:3:2"},"nodeType":"YulFunctionCall","src":"2020:16:2"},{"name":"end","nodeType":"YulIdentifier","src":"2038:3:2"}],"functionName":{"name":"gt","nodeType":"YulIdentifier","src":"2017:2:2"},"nodeType":"YulFunctionCall","src":"2017:25:2"},"nodeType":"YulIf","src":"2014:112:2"},{"expression":{"arguments":[{"name":"src","nodeType":"YulIdentifier","src":"2159:3:2"},{"name":"dst","nodeType":"YulIdentifier","src":"2164:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"2169:6:2"}],"functionName":{"name":"copy_calldata_to_memory","nodeType":"YulIdentifier","src":"2135:23:2"},"nodeType":"YulFunctionCall","src":"2135:41:2"},"nodeType":"YulExpressionStatement","src":"2135:41:2"}]},"name":"abi_decode_available_length_t_string_memory_ptr","nodeType":"YulFunctionDefinition","parameters":[{"name":"src","nodeType":"YulTypedName","src":"1827:3:2","type":""},{"name":"length","nodeType":"YulTypedName","src":"1832:6:2","type":""},{"name":"end","nodeType":"YulTypedName","src":"1840:3:2","type":""}],"returnVariables":[{"name":"array","nodeType":"YulTypedName","src":"1848:5:2","type":""}],"src":"1770:412:2"},{"body":{"nodeType":"YulBlock","src":"2264:278:2","statements":[{"body":{"nodeType":"YulBlock","src":"2313:83:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d","nodeType":"YulIdentifier","src":"2315:77:2"},"nodeType":"YulFunctionCall","src":"2315:79:2"},"nodeType":"YulExpressionStatement","src":"2315:79:2"}]},"condition":{"arguments":[{"arguments":[{"arguments":[{"name":"offset","nodeType":"YulIdentifier","src":"2292:6:2"},{"kind":"number","nodeType":"YulLiteral","src":"2300:4:2","type":"","value":"0x1f"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"2288:3:2"},"nodeType":"YulFunctionCall","src":"2288:17:2"},{"name":"end","nodeType":"YulIdentifier","src":"2307:3:2"}],"functionName":{"name":"slt","nodeType":"YulIdentifier","src":"2284:3:2"},"nodeType":"YulFunctionCall","src":"2284:27:2"}],"functionName":{"name":"iszero","nodeType":"YulIdentifier","src":"2277:6:2"},"nodeType":"YulFunctionCall","src":"2277:35:2"},"nodeType":"YulIf","src":"2274:122:2"},{"nodeType":"YulVariableDeclaration","src":"2405:34:2","value":{"arguments":[{"name":"offset","nodeType":"YulIdentifier","src":"2432:6:2"}],"functionName":{"name":"calldataload","nodeType":"YulIdentifier","src":"2419:12:2"},"nodeType":"YulFunctionCall","src":"2419:20:2"},"variables":[{"name":"length","nodeType":"YulTypedName","src":"2409:6:2","type":""}]},{"nodeType":"YulAssignment","src":"2448:88:2","value":{"arguments":[{"arguments":[{"name":"offset","nodeType":"YulIdentifier","src":"2509:6:2"},{"kind":"number","nodeType":"YulLiteral","src":"2517:4:2","type":"","value":"0x20"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"2505:3:2"},"nodeType":"YulFunctionCall","src":"2505:17:2"},{"name":"length","nodeType":"YulIdentifier","src":"2524:6:2"},{"name":"end","nodeType":"YulIdentifier","src":"2532:3:2"}],"functionName":{"name":"abi_decode_available_length_t_string_memory_ptr","nodeType":"YulIdentifier","src":"2457:47:2"},"nodeType":"YulFunctionCall","src":"2457:79:2"},"variableNames":[{"name":"array","nodeType":"YulIdentifier","src":"2448:5:2"}]}]},"name":"abi_decode_t_string_memory_ptr","nodeType":"YulFunctionDefinition","parameters":[{"name":"offset","nodeType":"YulTypedName","src":"2242:6:2","type":""},{"name":"end","nodeType":"YulTypedName","src":"2250:3:2","type":""}],"returnVariables":[{"name":"array","nodeType":"YulTypedName","src":"2258:5:2","type":""}],"src":"2202:340:2"},{"body":{"nodeType":"YulBlock","src":"2624:433:2","statements":[{"body":{"nodeType":"YulBlock","src":"2670:83:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b","nodeType":"YulIdentifier","src":"2672:77:2"},"nodeType":"YulFunctionCall","src":"2672:79:2"},"nodeType":"YulExpressionStatement","src":"2672:79:2"}]},"condition":{"arguments":[{"arguments":[{"name":"dataEnd","nodeType":"YulIdentifier","src":"2645:7:2"},{"name":"headStart","nodeType":"YulIdentifier","src":"2654:9:2"}],"functionName":{"name":"sub","nodeType":"YulIdentifier","src":"2641:3:2"},"nodeType":"YulFunctionCall","src":"2641:23:2"},{"kind":"number","nodeType":"YulLiteral","src":"2666:2:2","type":"","value":"32"}],"functionName":{"name":"slt","nodeType":"YulIdentifier","src":"2637:3:2"},"nodeType":"YulFunctionCall","src":"2637:32:2"},"nodeType":"YulIf","src":"2634:119:2"},{"nodeType":"YulBlock","src":"2763:287:2","statements":[{"nodeType":"YulVariableDeclaration","src":"2778:45:2","value":{"arguments":[{"arguments":[{"name":"headStart","nodeType":"YulIdentifier","src":"2809:9:2"},{"kind":"number","nodeType":"YulLiteral","src":"2820:1:2","type":"","value":"0"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"2805:3:2"},"nodeType":"YulFunctionCall","src":"2805:17:2"}],"functionName":{"name":"calldataload","nodeType":"YulIdentifier","src":"2792:12:2"},"nodeType":"YulFunctionCall","src":"2792:31:2"},"variables":[{"name":"offset","nodeType":"YulTypedName","src":"2782:6:2","type":""}]},{"body":{"nodeType":"YulBlock","src":"2870:83:2","statements":[{"expression":{"arguments":[],"functionName":{"name":"revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db","nodeType":"YulIdentifier","src":"2872:77:2"},"nodeType":"YulFunctionCall","src":"2872:79:2"},"nodeType":"YulExpressionStatement","src":"2872:79:2"}]},"condition":{"arguments":[{"name":"offset","nodeType":"YulIdentifier","src":"2842:6:2"},{"kind":"number","nodeType":"YulLiteral","src":"2850:18:2","type":"","value":"0xffffffffffffffff"}],"functionName":{"name":"gt","nodeType":"YulIdentifier","src":"2839:2:2"},"nodeType":"YulFunctionCall","src":"2839:30:2"},"nodeType":"YulIf","src":"2836:117:2"},{"nodeType":"YulAssignment","src":"2967:73:2","value":{"arguments":[{"arguments":[{"name":"headStart","nodeType":"YulIdentifier","src":"3012:9:2"},{"name":"offset","nodeType":"YulIdentifier","src":"3023:6:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3008:3:2"},"nodeType":"YulFunctionCall","src":"3008:22:2"},{"name":"dataEnd","nodeType":"YulIdentifier","src":"3032:7:2"}],"functionName":{"name":"abi_decode_t_string_memory_ptr","nodeType":"YulIdentifier","src":"2977:30:2"},"nodeType":"YulFunctionCall","src":"2977:63:2"},"variableNames":[{"name":"value0","nodeType":"YulIdentifier","src":"2967:6:2"}]}]}]},"name":"abi_decode_tuple_t_string_memory_ptr","nodeType":"YulFunctionDefinition","parameters":[{"name":"headStart","nodeType":"YulTypedName","src":"2594:9:2","type":""},{"name":"dataEnd","nodeType":"YulTypedName","src":"2605:7:2","type":""}],"returnVariables":[{"name":"value0","nodeType":"YulTypedName","src":"2617:6:2","type":""}],"src":"2548:509:2"},{"body":{"nodeType":"YulBlock","src":"3105:48:2","statements":[{"nodeType":"YulAssignment","src":"3115:32:2","value":{"arguments":[{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"3140:5:2"}],"functionName":{"name":"iszero","nodeType":"YulIdentifier","src":"3133:6:2"},"nodeType":"YulFunctionCall","src":"3133:13:2"}],"functionName":{"name":"iszero","nodeType":"YulIdentifier","src":"3126:6:2"},"nodeType":"YulFunctionCall","src":"3126:21:2"},"variableNames":[{"name":"cleaned","nodeType":"YulIdentifier","src":"3115:7:2"}]}]},"name":"cleanup_t_bool","nodeType":"YulFunctionDefinition","parameters":[{"name":"value","nodeType":"YulTypedName","src":"3087:5:2","type":""}],"returnVariables":[{"name":"cleaned","nodeType":"YulTypedName","src":"3097:7:2","type":""}],"src":"3063:90:2"},{"body":{"nodeType":"YulBlock","src":"3218:50:2","statements":[{"expression":{"arguments":[{"name":"pos","nodeType":"YulIdentifier","src":"3235:3:2"},{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"3255:5:2"}],"functionName":{"name":"cleanup_t_bool","nodeType":"YulIdentifier","src":"3240:14:2"},"nodeType":"YulFunctionCall","src":"3240:21:2"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"3228:6:2"},"nodeType":"YulFunctionCall","src":"3228:34:2"},"nodeType":"YulExpressionStatement","src":"3228:34:2"}]},"name":"abi_encode_t_bool_to_t_bool_fromStack","nodeType":"YulFunctionDefinition","parameters":[{"name":"value","nodeType":"YulTypedName","src":"3206:5:2","type":""},{"name":"pos","nodeType":"YulTypedName","src":"3213:3:2","type":""}],"src":"3159:109:2"},{"body":{"nodeType":"YulBlock","src":"3366:118:2","statements":[{"nodeType":"YulAssignment","src":"3376:26:2","value":{"arguments":[{"name":"headStart","nodeType":"YulIdentifier","src":"3388:9:2"},{"kind":"number","nodeType":"YulLiteral","src":"3399:2:2","type":"","value":"32"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3384:3:2"},"nodeType":"YulFunctionCall","src":"3384:18:2"},"variableNames":[{"name":"tail","nodeType":"YulIdentifier","src":"3376:4:2"}]},{"expression":{"arguments":[{"name":"value0","nodeType":"YulIdentifier","src":"3450:6:2"},{"arguments":[{"name":"headStart","nodeType":"YulIdentifier","src":"3463:9:2"},{"kind":"number","nodeType":"YulLiteral","src":"3474:1:2","type":"","value":"0"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3459:3:2"},"nodeType":"YulFunctionCall","src":"3459:17:2"}],"functionName":{"name":"abi_encode_t_bool_to_t_bool_fromStack","nodeType":"YulIdentifier","src":"3412:37:2"},"nodeType":"YulFunctionCall","src":"3412:65:2"},"nodeType":"YulExpressionStatement","src":"3412:65:2"}]},"name":"abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed","nodeType":"YulFunctionDefinition","parameters":[{"name":"headStart","nodeType":"YulTypedName","src":"3338:9:2","type":""},{"name":"value0","nodeType":"YulTypedName","src":"3350:6:2","type":""}],"returnVariables":[{"name":"tail","nodeType":"YulTypedName","src":"3361:4:2","type":""}],"src":"3274:210:2"},{"body":{"nodeType":"YulBlock","src":"3549:40:2","statements":[{"nodeType":"YulAssignment","src":"3560:22:2","value":{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"3576:5:2"}],"functionName":{"name":"mload","nodeType":"YulIdentifier","src":"3570:5:2"},"nodeType":"YulFunctionCall","src":"3570:12:2"},"variableNames":[{"name":"length","nodeType":"YulIdentifier","src":"3560:6:2"}]}]},"name":"array_length_t_string_memory_ptr","nodeType":"YulFunctionDefinition","parameters":[{"name":"value","nodeType":"YulTypedName","src":"3532:5:2","type":""}],"returnVariables":[{"name":"length","nodeType":"YulTypedName","src":"3542:6:2","type":""}],"src":"3490:99:2"},{"body":{"nodeType":"YulBlock","src":"3709:34:2","statements":[{"nodeType":"YulAssignment","src":"3719:18:2","value":{"name":"pos","nodeType":"YulIdentifier","src":"3734:3:2"},"variableNames":[{"name":"updated_pos","nodeType":"YulIdentifier","src":"3719:11:2"}]}]},"name":"array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack","nodeType":"YulFunctionDefinition","parameters":[{"name":"pos","nodeType":"YulTypedName","src":"3681:3:2","type":""},{"name":"length","nodeType":"YulTypedName","src":"3686:6:2","type":""}],"returnVariables":[{"name":"updated_pos","nodeType":"YulTypedName","src":"3697:11:2","type":""}],"src":"3595:148:2"},{"body":{"nodeType":"YulBlock","src":"3798:258:2","statements":[{"nodeType":"YulVariableDeclaration","src":"3808:10:2","value":{"kind":"number","nodeType":"YulLiteral","src":"3817:1:2","type":"","value":"0"},"variables":[{"name":"i","nodeType":"YulTypedName","src":"3812:1:2","type":""}]},{"body":{"nodeType":"YulBlock","src":"3877:63:2","statements":[{"expression":{"arguments":[{"arguments":[{"name":"dst","nodeType":"YulIdentifier","src":"3902:3:2"},{"name":"i","nodeType":"YulIdentifier","src":"3907:1:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3898:3:2"},"nodeType":"YulFunctionCall","src":"3898:11:2"},{"arguments":[{"arguments":[{"name":"src","nodeType":"YulIdentifier","src":"3921:3:2"},{"name":"i","nodeType":"YulIdentifier","src":"3926:1:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3917:3:2"},"nodeType":"YulFunctionCall","src":"3917:11:2"}],"functionName":{"name":"mload","nodeType":"YulIdentifier","src":"3911:5:2"},"nodeType":"YulFunctionCall","src":"3911:18:2"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"3891:6:2"},"nodeType":"YulFunctionCall","src":"3891:39:2"},"nodeType":"YulExpressionStatement","src":"3891:39:2"}]},"condition":{"arguments":[{"name":"i","nodeType":"YulIdentifier","src":"3838:1:2"},{"name":"length","nodeType":"YulIdentifier","src":"3841:6:2"}],"functionName":{"name":"lt","nodeType":"YulIdentifier","src":"3835:2:2"},"nodeType":"YulFunctionCall","src":"3835:13:2"},"nodeType":"YulForLoop","post":{"nodeType":"YulBlock","src":"3849:19:2","statements":[{"nodeType":"YulAssignment","src":"3851:15:2","value":{"arguments":[{"name":"i","nodeType":"YulIdentifier","src":"3860:1:2"},{"kind":"number","nodeType":"YulLiteral","src":"3863:2:2","type":"","value":"32"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"3856:3:2"},"nodeType":"YulFunctionCall","src":"3856:10:2"},"variableNames":[{"name":"i","nodeType":"YulIdentifier","src":"3851:1:2"}]}]},"pre":{"nodeType":"YulBlock","src":"3831:3:2","statements":[]},"src":"3827:113:2"},{"body":{"nodeType":"YulBlock","src":"3974:76:2","statements":[{"expression":{"arguments":[{"arguments":[{"name":"dst","nodeType":"YulIdentifier","src":"4024:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"4029:6:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"4020:3:2"},"nodeType":"YulFunctionCall","src":"4020:16:2"},{"kind":"number","nodeType":"YulLiteral","src":"4038:1:2","type":"","value":"0"}],"functionName":{"name":"mstore","nodeType":"YulIdentifier","src":"4013:6:2"},"nodeType":"YulFunctionCall","src":"4013:27:2"},"nodeType":"YulExpressionStatement","src":"4013:27:2"}]},"condition":{"arguments":[{"name":"i","nodeType":"YulIdentifier","src":"3955:1:2"},{"name":"length","nodeType":"YulIdentifier","src":"3958:6:2"}],"functionName":{"name":"gt","nodeType":"YulIdentifier","src":"3952:2:2"},"nodeType":"YulFunctionCall","src":"3952:13:2"},"nodeType":"YulIf","src":"3949:101:2"}]},"name":"copy_memory_to_memory","nodeType":"YulFunctionDefinition","parameters":[{"name":"src","nodeType":"YulTypedName","src":"3780:3:2","type":""},{"name":"dst","nodeType":"YulTypedName","src":"3785:3:2","type":""},{"name":"length","nodeType":"YulTypedName","src":"3790:6:2","type":""}],"src":"3749:307:2"},{"body":{"nodeType":"YulBlock","src":"4172:267:2","statements":[{"nodeType":"YulVariableDeclaration","src":"4182:53:2","value":{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"4229:5:2"}],"functionName":{"name":"array_length_t_string_memory_ptr","nodeType":"YulIdentifier","src":"4196:32:2"},"nodeType":"YulFunctionCall","src":"4196:39:2"},"variables":[{"name":"length","nodeType":"YulTypedName","src":"4186:6:2","type":""}]},{"nodeType":"YulAssignment","src":"4244:96:2","value":{"arguments":[{"name":"pos","nodeType":"YulIdentifier","src":"4328:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"4333:6:2"}],"functionName":{"name":"array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack","nodeType":"YulIdentifier","src":"4251:76:2"},"nodeType":"YulFunctionCall","src":"4251:89:2"},"variableNames":[{"name":"pos","nodeType":"YulIdentifier","src":"4244:3:2"}]},{"expression":{"arguments":[{"arguments":[{"name":"value","nodeType":"YulIdentifier","src":"4375:5:2"},{"kind":"number","nodeType":"YulLiteral","src":"4382:4:2","type":"","value":"0x20"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"4371:3:2"},"nodeType":"YulFunctionCall","src":"4371:16:2"},{"name":"pos","nodeType":"YulIdentifier","src":"4389:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"4394:6:2"}],"functionName":{"name":"copy_memory_to_memory","nodeType":"YulIdentifier","src":"4349:21:2"},"nodeType":"YulFunctionCall","src":"4349:52:2"},"nodeType":"YulExpressionStatement","src":"4349:52:2"},{"nodeType":"YulAssignment","src":"4410:23:2","value":{"arguments":[{"name":"pos","nodeType":"YulIdentifier","src":"4421:3:2"},{"name":"length","nodeType":"YulIdentifier","src":"4426:6:2"}],"functionName":{"name":"add","nodeType":"YulIdentifier","src":"4417:3:2"},"nodeType":"YulFunctionCall","src":"4417:16:2"},"variableNames":[{"name":"end","nodeType":"YulIdentifier","src":"4410:3:2"}]}]},"name":"abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_nonPadded_inplace_fromStack","nodeType":"YulFunctionDefinition","parameters":[{"name":"value","nodeType":"YulTypedName","src":"4153:5:2","type":""},{"name":"pos","nodeType":"YulTypedName","src":"4160:3:2","type":""}],"returnVariables":[{"name":"end","nodeType":"YulTypedName","src":"4168:3:2","type":""}],"src":"4062:377:2"},{"body":{"nodeType":"YulBlock","src":"4581:139:2","statements":[{"nodeType":"YulAssignment","src":"4592:102:2","value":{"arguments":[{"name":"value0","nodeType":"YulIdentifier","src":"4681:6:2"},{"name":"pos","nodeType":"YulIdentifier","src":"4690:3:2"}],"functionName":{"name":"abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_nonPadded_inplace_fromStack","nodeType":"YulIdentifier","src":"4599:81:2"},"nodeType":"YulFunctionCall","src":"4599:95:2"},"variableNames":[{"name":"pos","nodeType":"YulIdentifier","src":"4592:3:2"}]},{"nodeType":"YulAssignment","src":"4704:10:2","value":{"name":"pos","nodeType":"YulIdentifier","src":"4711:3:2"},"variableNames":[{"name":"end","nodeType":"YulIdentifier","src":"4704:3:2"}]}]},"name":"abi_encode_tuple_packed_t_string_memory_ptr__to_t_string_memory_ptr__nonPadded_inplace_fromStack_reversed","nodeType":"YulFunctionDefinition","parameters":[{"name":"pos","nodeType":"YulTypedName","src":"4560:3:2","type":""},{"name":"value0","nodeType":"YulTypedName","src":"4566:6:2","type":""}],"returnVariables":[{"name":"end","nodeType":"YulTypedName","src":"4577:3:2","type":""}],"src":"4445:275:2"}]},"contents":"{\\n\\n    function allocate_unbounded() -> memPtr {\\n        memPtr := mload(64)\\n    }\\n\\n    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {\\n        revert(0, 0)\\n    }\\n\\n    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {\\n        revert(0, 0)\\n    }\\n\\n    function revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() {\\n        revert(0, 0)\\n    }\\n\\n    function revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() {\\n        revert(0, 0)\\n    }\\n\\n    function round_up_to_mul_of_32(value) -> result {\\n        result := and(add(value, 31), not(31))\\n    }\\n\\n    function panic_error_0x41() {\\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\\n        mstore(4, 0x41)\\n        revert(0, 0x24)\\n    }\\n\\n    function finalize_allocation(memPtr, size) {\\n        let newFreePtr := add(memPtr, round_up_to_mul_of_32(size))\\n        // protect against overflow\\n        if or(gt(newFreePtr, 0xffffffffffffffff), lt(newFreePtr, memPtr)) { panic_error_0x41() }\\n        mstore(64, newFreePtr)\\n    }\\n\\n    function allocate_memory(size) -> memPtr {\\n        memPtr := allocate_unbounded()\\n        finalize_allocation(memPtr, size)\\n    }\\n\\n    function array_allocation_size_t_string_memory_ptr(length) -> size {\\n        // Make sure we can allocate memory without overflow\\n        if gt(length, 0xffffffffffffffff) { panic_error_0x41() }\\n\\n        size := round_up_to_mul_of_32(length)\\n\\n        // add length slot\\n        size := add(size, 0x20)\\n\\n    }\\n\\n    function copy_calldata_to_memory(src, dst, length) {\\n        calldatacopy(dst, src, length)\\n        // clear end\\n        mstore(add(dst, length), 0)\\n    }\\n\\n    function abi_decode_available_length_t_string_memory_ptr(src, length, end) -> array {\\n        array := allocate_memory(array_allocation_size_t_string_memory_ptr(length))\\n        mstore(array, length)\\n        let dst := add(array, 0x20)\\n        if gt(add(src, length), end) { revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() }\\n        copy_calldata_to_memory(src, dst, length)\\n    }\\n\\n    // string\\n    function abi_decode_t_string_memory_ptr(offset, end) -> array {\\n        if iszero(slt(add(offset, 0x1f), end)) { revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() }\\n        let length := calldataload(offset)\\n        array := abi_decode_available_length_t_string_memory_ptr(add(offset, 0x20), length, end)\\n    }\\n\\n    function abi_decode_tuple_t_string_memory_ptr(headStart, dataEnd) -> value0 {\\n        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\\n\\n        {\\n\\n            let offset := calldataload(add(headStart, 0))\\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\\n\\n            value0 := abi_decode_t_string_memory_ptr(add(headStart, offset), dataEnd)\\n        }\\n\\n    }\\n\\n    function cleanup_t_bool(value) -> cleaned {\\n        cleaned := iszero(iszero(value))\\n    }\\n\\n    function abi_encode_t_bool_to_t_bool_fromStack(value, pos) {\\n        mstore(pos, cleanup_t_bool(value))\\n    }\\n\\n    function abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed(headStart , value0) -> tail {\\n        tail := add(headStart, 32)\\n\\n        abi_encode_t_bool_to_t_bool_fromStack(value0,  add(headStart, 0))\\n\\n    }\\n\\n    function array_length_t_string_memory_ptr(value) -> length {\\n\\n        length := mload(value)\\n\\n    }\\n\\n    function array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack(pos, length) -> updated_pos {\\n        updated_pos := pos\\n    }\\n\\n    function copy_memory_to_memory(src, dst, length) {\\n        let i := 0\\n        for { } lt(i, length) { i := add(i, 32) }\\n        {\\n            mstore(add(dst, i), mload(add(src, i)))\\n        }\\n        if gt(i, length)\\n        {\\n            // clear end\\n            mstore(add(dst, length), 0)\\n        }\\n    }\\n\\n    function abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_nonPadded_inplace_fromStack(value, pos) -> end {\\n        let length := array_length_t_string_memory_ptr(value)\\n        pos := array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack(pos, length)\\n        copy_memory_to_memory(add(value, 0x20), pos, length)\\n        end := add(pos, length)\\n    }\\n\\n    function abi_encode_tuple_packed_t_string_memory_ptr__to_t_string_memory_ptr__nonPadded_inplace_fromStack_reversed(pos , value0) -> end {\\n\\n        pos := abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_nonPadded_inplace_fromStack(value0,  pos)\\n\\n        end := pos\\n    }\\n\\n}\\n","id":2,"language":"Yul","name":"#utility.yul"}],"sourceMap":"66:429:1:-:0;;;;;;;;;;;;;;;;;;;","deployedSourceMap":"66:429:1:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;230:116;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;350:142;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;:::-;;;;;;;;230:116;283:4;316:7;299:25;;;;;;:::i;:::-;;;;;;;;304:10;299:25;;;;;;;;;;;;337:4;330:11;;230:116;;;:::o;350:142::-;415:4;453:16;431:39;;;;;;:::i;:::-;;;;;;;;441:10;431:39;;;;;;;;;;;;483:4;476:11;;350:142;;;:::o;7:75:2:-;40:6;73:2;67:9;57:19;;7:75;:::o;88:117::-;197:1;194;187:12;211:117;320:1;317;310:12;334:117;443:1;440;433:12;457:117;566:1;563;556:12;580:102;621:6;672:2;668:7;663:2;656:5;652:14;648:28;638:38;;580:102;;;:::o;688:180::-;736:77;733:1;726:88;833:4;830:1;823:15;857:4;854:1;847:15;874:281;957:27;979:4;957:27;:::i;:::-;949:6;945:40;1087:6;1075:10;1072:22;1051:18;1039:10;1036:34;1033:62;1030:88;;;1098:18;;:::i;:::-;1030:88;1138:10;1134:2;1127:22;917:238;874:281;;:::o;1161:129::-;1195:6;1222:20;;:::i;:::-;1212:30;;1251:33;1279:4;1271:6;1251:33;:::i;:::-;1161:129;;;:::o;1296:308::-;1358:4;1448:18;1440:6;1437:30;1434:56;;;1470:18;;:::i;:::-;1434:56;1508:29;1530:6;1508:29;:::i;:::-;1500:37;;1592:4;1586;1582:15;1574:23;;1296:308;;;:::o;1610:154::-;1694:6;1689:3;1684;1671:30;1756:1;1747:6;1742:3;1738:16;1731:27;1610:154;;;:::o;1770:412::-;1848:5;1873:66;1889:49;1931:6;1889:49;:::i;:::-;1873:66;:::i;:::-;1864:75;;1962:6;1955:5;1948:21;2000:4;1993:5;1989:16;2038:3;2029:6;2024:3;2020:16;2017:25;2014:112;;;2045:79;;:::i;:::-;2014:112;2135:41;2169:6;2164:3;2159;2135:41;:::i;:::-;1854:328;1770:412;;;;;:::o;2202:340::-;2258:5;2307:3;2300:4;2292:6;2288:17;2284:27;2274:122;;2315:79;;:::i;:::-;2274:122;2432:6;2419:20;2457:79;2532:3;2524:6;2517:4;2509:6;2505:17;2457:79;:::i;:::-;2448:88;;2264:278;2202:340;;;;:::o;2548:509::-;2617:6;2666:2;2654:9;2645:7;2641:23;2637:32;2634:119;;;2672:79;;:::i;:::-;2634:119;2820:1;2809:9;2805:17;2792:31;2850:18;2842:6;2839:30;2836:117;;;2872:79;;:::i;:::-;2836:117;2977:63;3032:7;3023:6;3012:9;3008:22;2977:63;:::i;:::-;2967:73;;2763:287;2548:509;;;;:::o;3063:90::-;3097:7;3140:5;3133:13;3126:21;3115:32;;3063:90;;;:::o;3159:109::-;3240:21;3255:5;3240:21;:::i;:::-;3235:3;3228:34;3159:109;;:::o;3274:210::-;3361:4;3399:2;3388:9;3384:18;3376:26;;3412:65;3474:1;3463:9;3459:17;3450:6;3412:65;:::i;:::-;3274:210;;;;:::o;3490:99::-;3542:6;3576:5;3570:12;3560:22;;3490:99;;;:::o;3595:148::-;3697:11;3734:3;3719:18;;3595:148;;;;:::o;3749:307::-;3817:1;3827:113;3841:6;3838:1;3835:13;3827:113;;;3926:1;3921:3;3917:11;3911:18;3907:1;3902:3;3898:11;3891:39;3863:2;3860:1;3856:10;3851:15;;3827:113;;;3958:6;3955:1;3952:13;3949:101;;;4038:1;4029:6;4024:3;4020:16;4013:27;3949:101;3798:258;3749:307;;;:::o;4062:377::-;4168:3;4196:39;4229:5;4196:39;:::i;:::-;4251:89;4333:6;4328:3;4251:89;:::i;:::-;4244:96;;4349:52;4394:6;4389:3;4382:4;4375:5;4371:16;4349:52;:::i;:::-;4426:6;4421:3;4417:16;4410:23;;4172:267;4062:377;;;;:::o;4445:275::-;4577:3;4599:95;4690:3;4681:6;4599:95;:::i;:::-;4592:102;;4711:3;4704:10;;4445:275;;;;:::o","source":"// SPDX-License-Identifier: MIT\\npragma solidity >=0.4.22 <0.9.0;\\n\\ncontract PieMessage {\\n\\n  event Sent(address indexed sender, string indexed payload);\\n  event Confirmed(address indexed sender, string indexed transaction_hash);\\n\\n  function send(string memory payload) public returns (bool){\\n    emit Sent(msg.sender, payload);\\n    return true;\\n  }\\n\\n  function confirm(string memory transaction_hash) public returns (bool){\\n    emit Confirmed(msg.sender, transaction_hash);\\n    return true;\\n  }\\n\\n}","sourcePath":"/Volumes/Basement/Sites/sites/piesocket/piemessage-contract/contracts/PieMessage.sol","ast":{"absolutePath":"project:/contracts/PieMessage.sol","exportedSymbols":{"PieMessage":[79]},"id":80,"license":"MIT","nodeType":"SourceUnit","nodes":[{"id":34,"literals":["solidity",">=","0.4",".22","<","0.9",".0"],"nodeType":"PragmaDirective","src":"32:32:1"},{"abstract":false,"baseContracts":[],"canonicalName":"PieMessage","contractDependencies":[],"contractKind":"contract","fullyImplemented":true,"id":79,"linearizedBaseContracts":[79],"name":"PieMessage","nameLocation":"75:10:1","nodeType":"ContractDefinition","nodes":[{"anonymous":false,"id":40,"name":"Sent","nameLocation":"97:4:1","nodeType":"EventDefinition","parameters":{"id":39,"nodeType":"ParameterList","parameters":[{"constant":false,"id":36,"indexed":true,"mutability":"mutable","name":"sender","nameLocation":"118:6:1","nodeType":"VariableDeclaration","scope":40,"src":"102:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"},"typeName":{"id":35,"name":"address","nodeType":"ElementaryTypeName","src":"102:7:1","stateMutability":"nonpayable","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},"visibility":"internal"},{"constant":false,"id":38,"indexed":true,"mutability":"mutable","name":"payload","nameLocation":"141:7:1","nodeType":"VariableDeclaration","scope":40,"src":"126:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":37,"name":"string","nodeType":"ElementaryTypeName","src":"126:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"101:48:1"},"src":"91:59:1"},{"anonymous":false,"id":46,"name":"Confirmed","nameLocation":"159:9:1","nodeType":"EventDefinition","parameters":{"id":45,"nodeType":"ParameterList","parameters":[{"constant":false,"id":42,"indexed":true,"mutability":"mutable","name":"sender","nameLocation":"185:6:1","nodeType":"VariableDeclaration","scope":46,"src":"169:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"},"typeName":{"id":41,"name":"address","nodeType":"ElementaryTypeName","src":"169:7:1","stateMutability":"nonpayable","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},"visibility":"internal"},{"constant":false,"id":44,"indexed":true,"mutability":"mutable","name":"transaction_hash","nameLocation":"208:16:1","nodeType":"VariableDeclaration","scope":46,"src":"193:31:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":43,"name":"string","nodeType":"ElementaryTypeName","src":"193:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"168:57:1"},"src":"153:73:1"},{"body":{"id":61,"nodeType":"Block","src":"288:58:1","statements":[{"eventCall":{"arguments":[{"expression":{"id":54,"name":"msg","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":4294967281,"src":"304:3:1","typeDescriptions":{"typeIdentifier":"t_magic_message","typeString":"msg"}},"id":55,"isConstant":false,"isLValue":false,"isPure":false,"lValueRequested":false,"memberName":"sender","nodeType":"MemberAccess","src":"304:10:1","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},{"id":56,"name":"payload","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":48,"src":"316:7:1","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}}],"expression":{"argumentTypes":[{"typeIdentifier":"t_address","typeString":"address"},{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}],"id":53,"name":"Sent","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":40,"src":"299:4:1","typeDescriptions":{"typeIdentifier":"t_function_event_nonpayable$_t_address_$_t_string_memory_ptr_$returns$__$","typeString":"function (address,string memory)"}},"id":57,"isConstant":false,"isLValue":false,"isPure":false,"kind":"functionCall","lValueRequested":false,"names":[],"nodeType":"FunctionCall","src":"299:25:1","tryCall":false,"typeDescriptions":{"typeIdentifier":"t_tuple$__$","typeString":"tuple()"}},"id":58,"nodeType":"EmitStatement","src":"294:30:1"},{"expression":{"hexValue":"74727565","id":59,"isConstant":false,"isLValue":false,"isPure":true,"kind":"bool","lValueRequested":false,"nodeType":"Literal","src":"337:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"value":"true"},"functionReturnParameters":52,"id":60,"nodeType":"Return","src":"330:11:1"}]},"functionSelector":"66792ba1","id":62,"implemented":true,"kind":"function","modifiers":[],"name":"send","nameLocation":"239:4:1","nodeType":"FunctionDefinition","parameters":{"id":49,"nodeType":"ParameterList","parameters":[{"constant":false,"id":48,"mutability":"mutable","name":"payload","nameLocation":"258:7:1","nodeType":"VariableDeclaration","scope":62,"src":"244:21:1","stateVariable":false,"storageLocation":"memory","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":47,"name":"string","nodeType":"ElementaryTypeName","src":"244:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"243:23:1"},"returnParameters":{"id":52,"nodeType":"ParameterList","parameters":[{"constant":false,"id":51,"mutability":"mutable","name":"","nameLocation":"-1:-1:-1","nodeType":"VariableDeclaration","scope":62,"src":"283:4:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"typeName":{"id":50,"name":"bool","nodeType":"ElementaryTypeName","src":"283:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"}},"visibility":"internal"}],"src":"282:6:1"},"scope":79,"src":"230:116:1","stateMutability":"nonpayable","virtual":false,"visibility":"public"},{"body":{"id":77,"nodeType":"Block","src":"420:72:1","statements":[{"eventCall":{"arguments":[{"expression":{"id":70,"name":"msg","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":4294967281,"src":"441:3:1","typeDescriptions":{"typeIdentifier":"t_magic_message","typeString":"msg"}},"id":71,"isConstant":false,"isLValue":false,"isPure":false,"lValueRequested":false,"memberName":"sender","nodeType":"MemberAccess","src":"441:10:1","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},{"id":72,"name":"transaction_hash","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":64,"src":"453:16:1","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}}],"expression":{"argumentTypes":[{"typeIdentifier":"t_address","typeString":"address"},{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}],"id":69,"name":"Confirmed","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":46,"src":"431:9:1","typeDescriptions":{"typeIdentifier":"t_function_event_nonpayable$_t_address_$_t_string_memory_ptr_$returns$__$","typeString":"function (address,string memory)"}},"id":73,"isConstant":false,"isLValue":false,"isPure":false,"kind":"functionCall","lValueRequested":false,"names":[],"nodeType":"FunctionCall","src":"431:39:1","tryCall":false,"typeDescriptions":{"typeIdentifier":"t_tuple$__$","typeString":"tuple()"}},"id":74,"nodeType":"EmitStatement","src":"426:44:1"},{"expression":{"hexValue":"74727565","id":75,"isConstant":false,"isLValue":false,"isPure":true,"kind":"bool","lValueRequested":false,"nodeType":"Literal","src":"483:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"value":"true"},"functionReturnParameters":68,"id":76,"nodeType":"Return","src":"476:11:1"}]},"functionSelector":"c7ab74a4","id":78,"implemented":true,"kind":"function","modifiers":[],"name":"confirm","nameLocation":"359:7:1","nodeType":"FunctionDefinition","parameters":{"id":65,"nodeType":"ParameterList","parameters":[{"constant":false,"id":64,"mutability":"mutable","name":"transaction_hash","nameLocation":"381:16:1","nodeType":"VariableDeclaration","scope":78,"src":"367:30:1","stateVariable":false,"storageLocation":"memory","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":63,"name":"string","nodeType":"ElementaryTypeName","src":"367:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"366:32:1"},"returnParameters":{"id":68,"nodeType":"ParameterList","parameters":[{"constant":false,"id":67,"mutability":"mutable","name":"","nameLocation":"-1:-1:-1","nodeType":"VariableDeclaration","scope":78,"src":"415:4:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"typeName":{"id":66,"name":"bool","nodeType":"ElementaryTypeName","src":"415:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"}},"visibility":"internal"}],"src":"414:6:1"},"scope":79,"src":"350:142:1","stateMutability":"nonpayable","virtual":false,"visibility":"public"}],"scope":80,"src":"66:429:1","usedErrors":[]}],"src":"32:463:1"},"legacyAST":{"absolutePath":"project:/contracts/PieMessage.sol","exportedSymbols":{"PieMessage":[79]},"id":80,"license":"MIT","nodeType":"SourceUnit","nodes":[{"id":34,"literals":["solidity",">=","0.4",".22","<","0.9",".0"],"nodeType":"PragmaDirective","src":"32:32:1"},{"abstract":false,"baseContracts":[],"canonicalName":"PieMessage","contractDependencies":[],"contractKind":"contract","fullyImplemented":true,"id":79,"linearizedBaseContracts":[79],"name":"PieMessage","nameLocation":"75:10:1","nodeType":"ContractDefinition","nodes":[{"anonymous":false,"id":40,"name":"Sent","nameLocation":"97:4:1","nodeType":"EventDefinition","parameters":{"id":39,"nodeType":"ParameterList","parameters":[{"constant":false,"id":36,"indexed":true,"mutability":"mutable","name":"sender","nameLocation":"118:6:1","nodeType":"VariableDeclaration","scope":40,"src":"102:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"},"typeName":{"id":35,"name":"address","nodeType":"ElementaryTypeName","src":"102:7:1","stateMutability":"nonpayable","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},"visibility":"internal"},{"constant":false,"id":38,"indexed":true,"mutability":"mutable","name":"payload","nameLocation":"141:7:1","nodeType":"VariableDeclaration","scope":40,"src":"126:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":37,"name":"string","nodeType":"ElementaryTypeName","src":"126:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"101:48:1"},"src":"91:59:1"},{"anonymous":false,"id":46,"name":"Confirmed","nameLocation":"159:9:1","nodeType":"EventDefinition","parameters":{"id":45,"nodeType":"ParameterList","parameters":[{"constant":false,"id":42,"indexed":true,"mutability":"mutable","name":"sender","nameLocation":"185:6:1","nodeType":"VariableDeclaration","scope":46,"src":"169:22:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"},"typeName":{"id":41,"name":"address","nodeType":"ElementaryTypeName","src":"169:7:1","stateMutability":"nonpayable","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},"visibility":"internal"},{"constant":false,"id":44,"indexed":true,"mutability":"mutable","name":"transaction_hash","nameLocation":"208:16:1","nodeType":"VariableDeclaration","scope":46,"src":"193:31:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":43,"name":"string","nodeType":"ElementaryTypeName","src":"193:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"168:57:1"},"src":"153:73:1"},{"body":{"id":61,"nodeType":"Block","src":"288:58:1","statements":[{"eventCall":{"arguments":[{"expression":{"id":54,"name":"msg","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":4294967281,"src":"304:3:1","typeDescriptions":{"typeIdentifier":"t_magic_message","typeString":"msg"}},"id":55,"isConstant":false,"isLValue":false,"isPure":false,"lValueRequested":false,"memberName":"sender","nodeType":"MemberAccess","src":"304:10:1","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},{"id":56,"name":"payload","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":48,"src":"316:7:1","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}}],"expression":{"argumentTypes":[{"typeIdentifier":"t_address","typeString":"address"},{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}],"id":53,"name":"Sent","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":40,"src":"299:4:1","typeDescriptions":{"typeIdentifier":"t_function_event_nonpayable$_t_address_$_t_string_memory_ptr_$returns$__$","typeString":"function (address,string memory)"}},"id":57,"isConstant":false,"isLValue":false,"isPure":false,"kind":"functionCall","lValueRequested":false,"names":[],"nodeType":"FunctionCall","src":"299:25:1","tryCall":false,"typeDescriptions":{"typeIdentifier":"t_tuple$__$","typeString":"tuple()"}},"id":58,"nodeType":"EmitStatement","src":"294:30:1"},{"expression":{"hexValue":"74727565","id":59,"isConstant":false,"isLValue":false,"isPure":true,"kind":"bool","lValueRequested":false,"nodeType":"Literal","src":"337:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"value":"true"},"functionReturnParameters":52,"id":60,"nodeType":"Return","src":"330:11:1"}]},"functionSelector":"66792ba1","id":62,"implemented":true,"kind":"function","modifiers":[],"name":"send","nameLocation":"239:4:1","nodeType":"FunctionDefinition","parameters":{"id":49,"nodeType":"ParameterList","parameters":[{"constant":false,"id":48,"mutability":"mutable","name":"payload","nameLocation":"258:7:1","nodeType":"VariableDeclaration","scope":62,"src":"244:21:1","stateVariable":false,"storageLocation":"memory","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":47,"name":"string","nodeType":"ElementaryTypeName","src":"244:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"243:23:1"},"returnParameters":{"id":52,"nodeType":"ParameterList","parameters":[{"constant":false,"id":51,"mutability":"mutable","name":"","nameLocation":"-1:-1:-1","nodeType":"VariableDeclaration","scope":62,"src":"283:4:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"typeName":{"id":50,"name":"bool","nodeType":"ElementaryTypeName","src":"283:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"}},"visibility":"internal"}],"src":"282:6:1"},"scope":79,"src":"230:116:1","stateMutability":"nonpayable","virtual":false,"visibility":"public"},{"body":{"id":77,"nodeType":"Block","src":"420:72:1","statements":[{"eventCall":{"arguments":[{"expression":{"id":70,"name":"msg","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":4294967281,"src":"441:3:1","typeDescriptions":{"typeIdentifier":"t_magic_message","typeString":"msg"}},"id":71,"isConstant":false,"isLValue":false,"isPure":false,"lValueRequested":false,"memberName":"sender","nodeType":"MemberAccess","src":"441:10:1","typeDescriptions":{"typeIdentifier":"t_address","typeString":"address"}},{"id":72,"name":"transaction_hash","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":64,"src":"453:16:1","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}}],"expression":{"argumentTypes":[{"typeIdentifier":"t_address","typeString":"address"},{"typeIdentifier":"t_string_memory_ptr","typeString":"string memory"}],"id":69,"name":"Confirmed","nodeType":"Identifier","overloadedDeclarations":[],"referencedDeclaration":46,"src":"431:9:1","typeDescriptions":{"typeIdentifier":"t_function_event_nonpayable$_t_address_$_t_string_memory_ptr_$returns$__$","typeString":"function (address,string memory)"}},"id":73,"isConstant":false,"isLValue":false,"isPure":false,"kind":"functionCall","lValueRequested":false,"names":[],"nodeType":"FunctionCall","src":"431:39:1","tryCall":false,"typeDescriptions":{"typeIdentifier":"t_tuple$__$","typeString":"tuple()"}},"id":74,"nodeType":"EmitStatement","src":"426:44:1"},{"expression":{"hexValue":"74727565","id":75,"isConstant":false,"isLValue":false,"isPure":true,"kind":"bool","lValueRequested":false,"nodeType":"Literal","src":"483:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"value":"true"},"functionReturnParameters":68,"id":76,"nodeType":"Return","src":"476:11:1"}]},"functionSelector":"c7ab74a4","id":78,"implemented":true,"kind":"function","modifiers":[],"name":"confirm","nameLocation":"359:7:1","nodeType":"FunctionDefinition","parameters":{"id":65,"nodeType":"ParameterList","parameters":[{"constant":false,"id":64,"mutability":"mutable","name":"transaction_hash","nameLocation":"381:16:1","nodeType":"VariableDeclaration","scope":78,"src":"367:30:1","stateVariable":false,"storageLocation":"memory","typeDescriptions":{"typeIdentifier":"t_string_memory_ptr","typeString":"string"},"typeName":{"id":63,"name":"string","nodeType":"ElementaryTypeName","src":"367:6:1","typeDescriptions":{"typeIdentifier":"t_string_storage_ptr","typeString":"string"}},"visibility":"internal"}],"src":"366:32:1"},"returnParameters":{"id":68,"nodeType":"ParameterList","parameters":[{"constant":false,"id":67,"mutability":"mutable","name":"","nameLocation":"-1:-1:-1","nodeType":"VariableDeclaration","scope":78,"src":"415:4:1","stateVariable":false,"storageLocation":"default","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"},"typeName":{"id":66,"name":"bool","nodeType":"ElementaryTypeName","src":"415:4:1","typeDescriptions":{"typeIdentifier":"t_bool","typeString":"bool"}},"visibility":"internal"}],"src":"414:6:1"},"scope":79,"src":"350:142:1","stateMutability":"nonpayable","virtual":false,"visibility":"public"}],"scope":80,"src":"66:429:1","usedErrors":[]}],"src":"32:463:1"},"compiler":{"name":"solc","version":"0.8.9+commit.e5eed63a.Emscripten.clang"},"networks":{},"schemaVersion":"3.4.3","updatedAt":"2021-11-01T14:41:30.160Z","devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	PieSocket = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllc29ja2V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7QUFDM0M7QUFDQTs7QUFFZTs7QUFFZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QywrQkFBK0I7QUFDM0U7O0FBRUEsc0NBQXNDLGlEQUFjO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsK0RBQStELG9CQUFvQjtBQUNuRjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsZ0VBQWdFLG9CQUFvQjtBQUNwRjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxnQ0FBZ0M7QUFDekU7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5R2lDO0FBQ0s7O0FBRXZCOztBQUVmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0RBQU07O0FBRWhDLDhCQUE4QixtREFBVTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHlDQUF5QztBQUN0RyxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHdEQUF3RDtBQUNySCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7OztBQzlIZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0xlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCbUM7QUFDRjtBQUNHO0FBQ3lCOztBQUU3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCLGtEQUFNO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1EQUFPOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixtQ0FBbUMsZ0VBQW9CO0FBQ3ZEO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSwyQkFBMkIsZ0VBQW9CO0FBQy9DLGFBQWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyx1QkFBdUIsa0JBQWtCLHFCQUFxQixHQUFHLFVBQVUsV0FBVyxvQkFBb0IsZUFBZSx3QkFBd0Isa0JBQWtCLGtEQUFhLENBQUMsWUFBWSxzQkFBc0I7O0FBRW5QO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2hJQSx3RkFBK0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNBL0M7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQmxvY2tjaGFpbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvSW52YWxpZEF1dGhFeGNlcHRpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL0xvZ2dlci5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvUGllU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZU1lc3NhZ2UgZnJvbSAnLi9QaWVNZXNzYWdlLmpzb24nO1xuY29uc3QgQkNNRW5kcG9pbnQgPSAnaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9hcGkvYmxvY2tjaGFpbi9wYXlsb2FkSGFzaCc7XG5jb25zdCBQaWVNZXNzYWdlQWRkcmVzcyA9ICcweDIzMjFjMzIxODI4OTQ2MTUzYTg0NWU2OWVlMTY4ZjQxM2U4NWM5MGQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9ja2NoYWluIHtcblxuXHRjb25zdHJ1Y3RvcihhcGlLZXksIGNoYW5uZWwpIHtcblx0XHR0aGlzLmFwaUtleSA9IGFwaUtleTtcblx0XHR0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuXG5cdFx0aWYgKHRoaXMuY2hlY2tXZWIzKCkpIHtcblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0Y29uc3QgdzMgPSBuZXcgV2ViMyh3aW5kb3cuZXRoZXJldW0pO1xuXHRcdGNvbnN0IGFjY291bnRzID0gYXdhaXQgZXRoZXJldW0ucmVxdWVzdCh7IG1ldGhvZDogJ2V0aF9yZXF1ZXN0QWNjb3VudHMnIH0pO1xuXHRcdHRoaXMuYWNjb3VudCA9IGFjY291bnRzWzBdO1xuXG5cdFx0dGhpcy5jb250cmFjdCA9IG5ldyB3My5ldGguQ29udHJhY3QoUGllTWVzc2FnZS5hYmksIFBpZU1lc3NhZ2VBZGRyZXNzKTtcblx0fVxuXG5cdGNoZWNrV2ViMygpIHtcblx0XHRpZiAodHlwZW9mIFdlYjMgPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1dlYi5qcyBpcyBub3QgaW5zdGFsbGVkIScpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygd2luZG93LmV0aGVyZXVtID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdNZXRhTWFzayBpcyBub3QgaW5zdGFsbGVkIScpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0YXN5bmMgY29uZmlybShoYXNoKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuXHRcdFx0aWYgKHRoaXMuY2hlY2tXZWIzKCkpIHtcblx0XHRcdFx0Y29uc3QgcmVjZWlwdCA9IHRoaXMuY29udHJhY3QubWV0aG9kcy5jb25maXJtKGhhc2gpLnNlbmQoeyBmcm9tOiB0aGlzLmFjY291bnQgfSk7XG5cdFx0XHRcdHJlY2VpcHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIHJlc29sdmUpXG5cdFx0XHRcdHJlY2VpcHQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fVxuXG5cdGFzeW5jIHNlbmQobWVzc2FnZSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cblx0XHRcdGlmICh0aGlzLmNoZWNrV2ViMygpKSB7XG5cblx0XHRcdFx0Y29uc3QgYmFjbUhhc2ggPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uSGFzaChtZXNzYWdlKTtcblxuXHRcdFx0XHRjb25zdCByZWNlaXB0ID0gdGhpcy5jb250cmFjdC5tZXRob2RzLnNlbmQoYmFjbUhhc2gpLnNlbmQoeyBmcm9tOiB0aGlzLmFjY291bnQgfSk7XG5cdFx0XHRcdHJlY2VpcHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIHJlc29sdmUpXG5cdFx0XHRcdHJlY2VpcHQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlamVjdCgpXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBnZXRUcmFuc2FjdGlvbkhhc2gobWVzc2FnZSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG5cdFx0XHRkYXRhLmFwcGVuZChcImFwaUtleVwiLCB0aGlzLmFwaUtleSk7XG5cdFx0XHRkYXRhLmFwcGVuZChcImNoYW5uZWxcIiwgdGhpcy5jaGFubmVsKTtcblx0XHRcdGRhdGEuYXBwZW5kKFwibWVzc2FnZVwiLCBtZXNzYWdlKTtcblxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0XHR4aHIuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFBpZVNvY2tldCBFcnJvcjogJHtKU09OLnN0cmluZ2lmeShyZXNwb25zZS5lcnJvcnMpfWApO1xuXHRcdFx0XHRcdFx0XHRyZWplY3QoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZS5zdWNjZXNzKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChcIlVua25vd24gZXJyb3JcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIEJsb2NrY2hhaW4gTWVzc2FnaW5nIEFQSSwgdHJ5IGxhdGVyXCIpO1xuXHRcdFx0XHRcdFx0cmVqZWN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkJsb2NrY2hhaW4gTWVzc2FnaW5nIEFQSSBzZWVtcyB1bnJlYWNoYWJsZSBhdCB0aGUgbW9tZW50LCB0cnkgbGF0ZXJcIik7XG5cdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBCQ01FbmRwb2ludCk7XG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcblx0XHR9KTtcblx0fVxufSIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEJsb2NrY2hhaW4gZnJvbSAnLi9CbG9ja2NoYWluJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHksIGluaXQ9dHJ1ZSkge1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG5cbiAgICAgICAgaWYoIWluaXQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0KGVuZHBvaW50LCBpZGVudGl0eSk7XG4gICAgfVxuXG4gICAgaW5pdChlbmRwb2ludCwgaWRlbnRpdHkpeyAgICAgICAgXG4gICAgICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICAgICAgdGhpcy5pZGVudGl0eSA9IGlkZW50aXR5O1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGlkZW50aXR5KTtcblxuICAgICAgICB0aGlzLmJsb2NrY2hhaW4gPSBuZXcgQmxvY2tjaGFpbihpZGVudGl0eS5hcGlLZXksIGlkZW50aXR5LmNoYW5uZWxJZCk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgICAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cblxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvL1JlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgc2VuZChkYXRhKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKGRhdGEpO1xuICAgIH1cblxuICAgIHNlbmRPbkJsb2NrY2hhaW4oZGF0YSkge1xuICAgICAgICB0aGlzLmJsb2NrY2hhaW4uc2VuZChkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKGhhc2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBcIm1lc3NhZ2VcIjogZGF0YSwgXCJ0cmFuc2FjdGlvbl9pZFwiOiBoYXNoIH0pKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uZmlybU9uQmxvY2tjaGFpbih0cmFuc2FjdGlvbkhhc2gpIHtcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluLmNvbmZpcm0odHJhbnNhY3Rpb25IYXNoKVxuICAgICAgICAgICAgLnRoZW4oKGhhc2gpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBcImV2ZW50XCI6IFwiY29uZmlybS10cmFuc2FjdGlvblwiLCBcInRyYW5zYWN0aW9uX2lkXCI6IGhhc2ggfSkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1lc3NhZ2UoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5lcnJvciAmJiBtZXNzYWdlLmVycm9yLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGpzb25FeGNlcHRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoanNvbkV4Y2VwdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ21lc3NhZ2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ21lc3NhZ2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PcGVuKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIGNvbm5lY3RlZDonLCBlKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSB0cnVlO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snb3BlbiddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snb3BlbiddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkVycm9yKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0NoYW5uZWwgZXJyb3I6JywgZSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snZXJyb3InXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ2Vycm9yJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xvc2UoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdDaGFubmVsIGNsb3NlZDonLCBlKTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ2Nsb3NlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydjbG9zZSddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNvbm5lY3QoKSB7XG4gICAgICAgIGlmICghdGhpcy5zaG91bGRSZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJSZWNvbm5lY3RpbmdcIik7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH1cblxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW52YWxpZEF1dGhFeGNlcHRpb257XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG5hbWU9XCJJbnZhbGlkQXV0aEV4Y2VwdGlvblwiKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gXCJBdXRoIGVuZHBvaW50IGRpZCBub3QgcmV0dXJuIGEgdmFsaWQgSldUIFRva2VuLCBwbGVhc2Ugc2VlOiBodHRwczovL3d3dy5waWVzb2NrZXQuY29tL2RvY3MvMy4wL2F1dGhlbnRpY2F0aW9uXCI7XG4gICAgdGhpcy5uYW1lID0gbmFtZTsgIFxuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG5cbiAgICBsb2coLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhcm4oLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcnJvciguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwuanMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgcGpzb24gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCBJbnZhbGlkQXV0aEV4Y2VwdGlvbiBmcm9tICcuL0ludmFsaWRBdXRoRXhjZXB0aW9uLmpzJztcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgdmVyc2lvbjogMyxcbiAgICBjbHVzdGVySWQ6ICdkZW1vJyxcbiAgICBhcGlLZXk6ICdvQ2RDTWNNUFFwYnZOalVJenF0dkYxZDJYMm9rV3BEUWo0QXdBUkp1QWd0amh6S3hWRWpRVTZJZENqd20nLFxuICAgIGNvbnNvbGVMb2dzOiBmYWxzZSxcbiAgICBub3RpZnlTZWxmOiAwLFxuICAgIGp3dDogbnVsbCxcbiAgICBwcmVzZW5jZTogMCxcbiAgICBhdXRoRW5kcG9pbnQ6IFwiL2Jyb2FkY2FzdGluZy9hdXRoXCIsXG4gICAgYXV0aEhlYWRlcnM6IHt9LFxuICAgIGZvcmNlQXV0aDogZmFsc2UsIFxuICAgIHVzZXJJZDogbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVTb2NrZXQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICAgICAgdmFyIG1ha2VFbmRwb2ludCA9IHRoaXMuZ2V0RW5kcG9pbnQoY2hhbm5lbElkKTtcblxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJSZXR1cm5pbmcgZXhpc3RpbmcgY2hhbm5lbFwiLCBjaGFubmVsSWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiQ3JlYXRpbmcgbmV3IGNoYW5uZWxcIiwgY2hhbm5lbElkKTtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgQ2hhbm5lbChudWxsLCBudWxsLCBmYWxzZSk7XG5cbiAgICAgICAgbWFrZUVuZHBvaW50LnRoZW4oKGVuZHBvaW50KT0+e1xuICAgICAgICAgICAgY2hhbm5lbC5pbml0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgY2hhbm5lbElkOiBjaGFubmVsSWQsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUoY2hhbm5lbElkKXtcbiAgICAgICAgaWYodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKXtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q29ubmVjdGlvbnMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnM7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QXV0aFRva2VuKGNoYW5uZWwpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImNoYW5uZWxfbmFtZVwiLCBjaGFubmVsKTtcbiAgICBcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIFxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9ICBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKFwiQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW5cIiwgXCJBdXRoRW5kcG9pbnRSZXNwb25zZUVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCk9PntcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKFwiQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW5cIiwgXCJBdXRoRW5kcG9pbnRFcnJvclwiKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMub3B0aW9ucy5hdXRoRW5kcG9pbnQpO1xuXG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzKTtcbiAgICAgICAgICAgIGhlYWRlcnMuZm9yRWFjaChoZWFkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICB4aHIuc2VuZChkYXRhKTsgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlzR3VhcmRlZChjaGFubmVsKXtcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmZvcmNlQXV0aCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXCJcIitjaGFubmVsKS5zdGFydHNXaXRoKFwicHJpdmF0ZS1cIik7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RW5kcG9pbnQoY2hhbm5lbElkKSB7XG4gICAgICAgIGxldCBlbmRwb2ludCA9IGB3c3M6Ly8ke3RoaXMub3B0aW9ucy5jbHVzdGVySWR9LnBpZXNvY2tldC5jb20vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259LyR7Y2hhbm5lbElkfT9hcGlfa2V5PSR7dGhpcy5vcHRpb25zLmFwaUtleX0mbm90aWZ5X3NlbGY9JHt0aGlzLm9wdGlvbnMubm90aWZ5U2VsZn0mc291cmNlPWpzc2RrJnY9JHtwanNvbi52ZXJzaW9ufSZwcmVzZW5jZT0ke3RoaXMub3B0aW9ucy5wcmVzZW5jZX1gXG5cbiAgICAgICAgLy9TZXQgYXV0aFxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuand0KXtcbiAgICAgICAgICAgIGVuZHBvaW50ID0gZW5kcG9pbnQrXCImand0PVwiK3RoaXMub3B0aW9ucy5qd3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLmlzR3VhcmRlZChjaGFubmVsSWQpKXtcbiAgICAgICAgICAgIGNvbnN0IGF1dGggPSBhd2FpdCB0aGlzLmdldEF1dGhUb2tlbihjaGFubmVsSWQpO1xuICAgICAgICAgICAgaWYoYXV0aC5hdXRoKXtcbiAgICAgICAgICAgICAgICBlbmRwb2ludCA9IGVuZHBvaW50ICsgXCImand0PVwiK2F1dGguYXV0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2V0IHVzZXIgaWRlbnRpdHlcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnVzZXJJZCl7XG4gICAgICAgICAgICBlbmRwb2ludCA9IGVuZHBvaW50ICsgXCImdXNlcj1cIit0aGlzLm9wdGlvbnMudXNlcklkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVuZHBvaW50O1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGllU29ja2V0JykuZGVmYXVsdDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==