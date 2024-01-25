var PieSocket;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./src/Blockchain.js":
/*!***************************!*\
  !*** ./src/Blockchain.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Blockchain)
/* harmony export */ });
const PieMessage = {};
const BCMEndpoint = 'https://www.piesocket.com/api/blockchain/payloadHash';
const PieMessageAddressDev = '0x2321c321828946153a845e69ee168f413e85c90d';
const PieMessageAddressProd = '0x2a840CA40E082DbF24610B62a978900BfCaB23D3';

class Blockchain {
  constructor(options) {
    this.options = options;

    this.apiKey = this.options.apiKey;
    this.channel = this.options.channelId;
    this.blockchainTestMode = this.options.blockchainTestMode;
    this.blockchainGasFee = this.options.blockchainGasFee;

    if (this.blockchainTestMode) {
      this.contractAddress = PieMessageAddressDev;
    } else {
      this.contractAddress = PieMessageAddressProd;
    }
  }

  async init() {
    const w3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    this.account = accounts[0];

    this.contract = new w3.eth.Contract(PieMessage.abi, this.contractAddress);
  }

  checkWeb3() {
    if (typeof Web3 == 'undefined') {
      console.log('Web3.js is not installed!');
      return false;
    }

    if (typeof window.ethereum == 'undefined') {
      console.log('MetaMask is not installed!');
      return false;
    }

    return true;
  }

  async confirm(hash) {
    return new Promise(async (resolve, reject) => {
      if (this.checkWeb3()) {
        if (!this.contract) {
          await this.init();
        }

        const receipt = this.contract.methods.confirm(hash).send({from: this.account, gas: this.blockchainGasFee});
        receipt.on('transactionHash', resolve);
        receipt.on('error', (error) => {
          reject(error);
        });
      }
    });
  }

  async send(message) {
    return new Promise(async (resolve, reject) => {
      if (this.checkWeb3()) {
        if (!this.contract) {
          await this.init();
        }

        const bacmHash = await this.getTransactionHash(message);

        const receipt = this.contract.methods.send(bacmHash.payload).send({from: this.account, gas: this.blockchainGasFee});
        receipt.on('transactionHash', (hash) => {
          resolve({
            hash: hash,
            id: bacmHash.transaction_id,
          });
        });
        receipt.on('error', (error) => {
          reject(error);
        });
      } else {
        if (typeof Web3 == 'undefined') {
          reject('Please install Web3.js');
        } else {
          reject('Please install MetaMask');
        }
      }
    });
  }

  async getTransactionHash(message) {
    return new Promise((resolve, reject) => {
      const data = new FormData();

      data.append('apiKey', this.apiKey);
      data.append('channel', this.channel);
      data.append('message', JSON.stringify(message));
      data.append('contract', this.contractAddress);

      const xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', function() {
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
              reject('Unknown error');
            }
          } catch (e) {
            console.error('Could not connect to Blockchain Messaging API, try later');
            reject();
          }
        }
      });

      xhr.addEventListener('error', () => {
        console.error('Blockchain Messaging API seems unreachable at the moment, try later');
        reject();
      });

      xhr.open('POST', BCMEndpoint);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(data);
    });
  }
}


/***/ }),

/***/ "./src/Channel.js":
/*!************************!*\
  !*** ./src/Channel.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Channel)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _Blockchain_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Blockchain.js */ "./src/Blockchain.js");
/* harmony import */ var _misc_WebSocket_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc/WebSocket.js */ "./src/misc/WebSocket.js");




class Channel {
  constructor(endpoint, identity, init=true) {
    this.events = {};
    this.listeners = {};
    this.members = [];
    this.portal = null;
    this.uuid = null;
    this.onSocketConnected = () => {};
    this.onSocketError = () => {};

    if (!init) {
      return;
    }

    this.init(endpoint, identity);
  }

  init(endpoint, identity) {
    this.endpoint = endpoint;
    this.identity = identity;
    this.connection = this.connect();
    this.shouldReconnect = false;
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](identity);
  }

  getMemberByUUID(uuid) {
    let member = null;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].uuid == uuid) {
        member = this.members[i];
        break;
      }
    }
    return member;
  }

  getCurrentMember() {
    return this.getMemberByUUID(this.uuid);
  }

  connect() {
    const connection = new _misc_WebSocket_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.endpoint);
    connection.onmessage = this.onMessage.bind(this);
    connection.onopen = this.onOpen.bind(this);
    connection.onerror = this.onError.bind(this);
    connection.onclose = this.onClose.bind(this);

    if (this.identity.onSocketConnected) {
      this.onSocketConnected = this.identity.onSocketConnected;
    }

    if (this.identity.onSocketError) {
      this.onSocketError = this.identity.onSocketError;
    }

    return connection;
  }

  on(event, callback) {
    // Register lifecycle callbacks
    this.events[event] = callback;
  }

  listen(event, callback) {
    // Register user defined callbacks
    this.listeners[event] = callback;
  }


  send(data) {
    return this.connection.send(data);
  }

  async publish(event, data, meta) {
    if (meta && meta.blockchain) {
      return await this.sendOnBlockchain(event, data, meta);
    }
    return this.connection.send(JSON.stringify({
      event: event,
      data: data,
      meta: meta,
    }));
  }


  async sendOnBlockchain(event, data, meta) {
    if (!this.blockchain) {
      this.blockchain = new _Blockchain_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.identity);
    }

    try {
      const receipt = await this.blockchain.send(data);

      if (this.events['blockchain-hash']) {
        this.events['blockchain-hash'].bind(this)({
          event: event,
          data: data,
          meta: meta,
          transactionHash: receipt.hash,
        });
      }

      return this.connection.send(JSON.stringify({'event': event, 'data': data, 'meta': {...meta, 'transaction_id': receipt.id, 'transaction_hash': receipt.hash}}));
    } catch (e) {
      if (this.events['blockchain-error']) {
        this.events['blockchain-error'].bind(this)(e);
      }
    };
  }

  async confirmOnBlockchain(event, transactionHash) {
    if (!this.blockchain) {
      this.blockchain = new _Blockchain_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.identity);
    }

    try {
      const hash = await this.blockchain.confirm(transactionHash);

      if (this.events['blockchain-hash']) {
        this.events['blockchain-hash'].bind(this)({
          event: event,
          confirmationHash: transactionHash,
          transactionHash: hash,
        });
      }

      return this.connection.send(JSON.stringify({'event': event, 'data': transactionHash, 'meta': {'transaction_id': 1, 'transaction_hash': hash}}));
    } catch (e) {
      if (this.events['blockchain-error']) {
        this.events['blockchain-error'].bind(this)(e);
      }
    }
  }

  onMessage(e) {
    this.logger.log('Channel message:', e);

    try {
      const message = JSON.parse(e.data);
      if (message.error && message.error.length) {
        this.shouldReconnect = false;
      }

      // Fire event listeners
      if (message.event) {
        this.handleMemberHandshake(message);

        if (this.listeners[message.event]) {
          this.listeners[message.event].bind(this)(message.data, message.meta);
        }

        if (this.listeners['*']) {
          this.listeners['*'].bind(this)(message.event, message.data, message.meta);
        }
      }
    } catch (jsonException) {
      console.error(jsonException);
    }

    // Fire lifecycle callback
    if (this.events['message']) {
      this.events['message'].bind(this)(e);
    }
  }

  handleMemberHandshake(message) {
    if (message.event == 'system:member_list') {
      this.members = message.data.members;
    } else if (message.event == 'system:member_joined') {
      this.members = message.data.members;
    } else if (message.event == 'system:member_left') {
      this.members = message.data.members;
      if (this.portal) {
        this.portal.removeParticipant(message.data.member.uuid);
      }
    }
    else if (message.event == 'system:portal_broadcaster' && message.data.from != this.uuid) {
      this.portal.requestOfferFromPeer(message.data);
    } 
    else if (message.event == 'system:portal_watcher' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    }else if (message.event == 'system:video_request' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } 
    else if (message.event == 'system:portal_candidate' && message.data.to == this.uuid) {
      this.portal.addIceCandidate(message.data);
    } else if (message.event == 'system:video_offer' && message.data.to == this.uuid) {
      this.portal.createAnswer(message.data);
    } else if (message.event == 'system:video_answer' && message.data.to == this.uuid) {
      this.portal.handleAnswer(message.data);
    }
  }

  onOpen(e) {
    this.logger.log('Channel connected:', e);
    this.shouldReconnect = true;

    // System init callback
    this.onSocketConnected(e);
  }

  onError(e) {
    this.logger.error('Channel error:', e);
    this.connection.close();

    // System init error callback
    this.onSocketError(e);

    // User defined callback
    if (this.events['error']) {
      this.events['error'].bind(this)(e);
    }
  }

  onClose(e) {
    this.logger.warn('Channel closed:', e);
    this.reconnect();

    // User defined callback
    if (this.events['close']) {
      this.events['close'].bind(this)(e);
    }
  }

  reconnect() {
    if (!this.shouldReconnect) {
      return;
    }
    this.logger.log('Reconnecting');
    this.connection = this.connect();
  }
}


/***/ }),

/***/ "./src/InvalidAuthException.js":
/*!*************************************!*\
  !*** ./src/InvalidAuthException.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InvalidAuthException)
/* harmony export */ });
class InvalidAuthException {
  constructor(message=null, name='InvalidAuthException') {
    this.message = message || 'Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication';
    this.name = name;
  }
}


/***/ }),

/***/ "./src/Logger.js":
/*!***********************!*\
  !*** ./src/Logger.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PieSocket)
/* harmony export */ });
/* harmony import */ var _Channel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Channel.js */ "./src/Channel.js");
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _Portal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Portal.js */ "./src/Portal.js");
/* harmony import */ var _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InvalidAuthException.js */ "./src/InvalidAuthException.js");
/* harmony import */ var _misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./misc/DefaultOptions.js */ "./src/misc/DefaultOptions.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");







class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {..._misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_4__["default"], ...options};
    this.connections = {};
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.options);
  }

  async subscribe(channelId, roomOptions={}) {
    return new Promise(async (resolve, reject) => {
      if (roomOptions.video || roomOptions.audio || roomOptions.portal) {
        // Force config when video is required
        this.options.notifySelf = true;
      }

      const uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_5__["default"])();
      const endpoint = await this.getEndpoint(channelId, uuid);

      if (this.connections[channelId]) {
        this.logger.log('Returning existing channel', channelId);
        resolve(this.connections[channelId]);
      } else {
        this.logger.log('Creating new channel', channelId);
        const channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](endpoint, {
          channelId: channelId,
          onSocketConnected: () => {
            channel.uuid = uuid;
            if (roomOptions.video || roomOptions.audio || roomOptions.portal) {
              channel.portal = new _Portal_js__WEBPACK_IMPORTED_MODULE_2__["default"](channel, {
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
            reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Could not fetch auth token', 'AuthEndpointResponseError'));
          }
        }
      });
      xhr.addEventListener('error', ()=>{
        reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Could not fetch auth token', 'AuthEndpointError'));
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
    let clusterDomain = this.options.clusterDomain == null ? `${this.options.clusterId}.piesocket.com`:this.options.clusterDomain;
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


/***/ }),

/***/ "./src/Portal.js":
/*!***********************!*\
  !*** ./src/Portal.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Portal)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _misc_RTCIceCandidate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/RTCIceCandidate.js */ "./src/misc/RTCIceCandidate.js");
/* harmony import */ var _misc_RTCPeerConnection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc/RTCPeerConnection.js */ "./src/misc/RTCPeerConnection.js");
/* harmony import */ var _misc_RTCSessionDescription_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./misc/RTCSessionDescription.js */ "./src/misc/RTCSessionDescription.js");




const defaultPortalOptions = {
  shouldBroadcast: true,
  portal: true,
  video: false,
  audio: true
};

class Portal {
  /**
     * Creates a video room instance
     * @param {*} channel
     */
  constructor(channel, identity) {
    this.channel = channel;
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](identity);
    this.identity = { ...defaultPortalOptions, ...identity };
    this.localStream = null;
    this.senders = [];
    this.cameraStream = null;
    this.sharingScreen = false;
    this.peerConnectionConfig = {
      'iceServers': [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' },
      ],
    };
    this.constraints = {
      video: identity.video,
      audio: identity.audio,
    };

    this.participants = [];
    this.isNegotiating = [];


    this.logger.log('Initializing video room');
    this.init();
  }

  /**
     * Initialize local video
     */
  init() {
    if (!this.constraints.video && !this.constraints.audio) {
      this.requestPeerVideo();
      return;
    }

    if (typeof navigator != 'undefined' && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler.bind(this));
      return true;
    } else {
      this.logger.error('Your browser does not support getUserMedia API');
      return false;
    }
  }

  shareVideo(signal, isCaller = true) {
    if (!this.identity.shouldBroadcast && isCaller && !signal.isBroadcasting) {
      console.log("Refusing to call, denied broadcast request");
      return;
    }

    console.log("peer connection", _misc_RTCPeerConnection_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
    const rtcConnection = new _misc_RTCPeerConnection_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.peerConnectionConfig);

    rtcConnection.onicecandidate = (event) => {
      if (event.candidate != null) {
        this.channel.publish('system:portal_candidate', {
          'from': this.channel.uuid,
          'to': signal.from,
          'ice': event.candidate,
        });
      }
    };

    rtcConnection.ontrack = (event) => {
      if (event.track.kind != 'video') {
        return;
      }

      this.participants[signal.from].streams = event.streams;
      if (typeof this.identity.onParticipantJoined == 'function') {
        this.identity.onParticipantJoined(signal.from, event.streams[0]);
      }
    };

    rtcConnection.onsignalingstatechange = (e) => {
      // Workaround for Chrome: skip nested negotiations
      this.isNegotiating[signal.from] = (rtcConnection.signalingState != 'stable');
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.senders.push(rtcConnection.addTrack(track, this.localStream));
      });
    }

    this.isNegotiating[signal.from] = false;


    rtcConnection.onnegotiationneeded = async () => {
      await this.sendVideoOffer(signal, rtcConnection, isCaller);
    };

    this.participants[signal.from] = {
      rtc: rtcConnection,
    };
  }

  shareScreen() {
    if(!this.sharingScreen){
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(screenStream => {
          const screenTrack = screenStream.getTracks()[0];
          this.localStream = screenStream;

          if (typeof this.identity.onLocalVideo == 'function') {
            this.identity.onLocalVideo(screenStream, this);
          }
          this.sharingScreen = true;
          for (const sender of this.senders) {
            if (sender.track && sender.track.kind === 'video')
              sender.replaceTrack(screenTrack);
          }
          alert("Screen sharing started! To stop, click on Stop Sharing button at the bottom!")

          screenTrack.onended = () => {
            this.localStream = this.cameraStream;
            this.sharingScreen = false;
            if (typeof this.identity.onLocalVideo == 'function') {
              this.identity.onLocalVideo(this.cameraStream, this);
            }
            for (const sender of this.senders) {
              if (sender.track && sender.track.kind === 'video') {
                sender.replaceTrack(this.cameraStream.getTracks()[0]);
              }
            }
          }
        })
        .catch(error => {
          console.error('Error sharing screen:', error);
          if (error.name === 'NotAllowedError') {
            console.error('User denied permission for screen sharing.');
          } else if (error.name === 'NotFoundError') {
            console.error('Display media not found (possibly due to privacy settings).');
          } else {
            console.error('Unknown error during screen sharing:', error);
          }
        });
    }else{
      alert("You are already sharing screen!");
    }
  }

  async sendVideoOffer(signal, rtcConnection, isCaller) {

    if (!isCaller) {
      return;
    }


    if (this.isNegotiating[signal.from]) {
      console.log('SKIP nested negotiations');
      return;
    }

    this.isNegotiating[signal.from] = true;


    const description = await rtcConnection.createOffer();
    await rtcConnection.setLocalDescription(description);

    console.log('Making offer');
    // Send a call offer
    this.channel.publish('system:video_offer', {
      'from': this.channel.uuid,
      'to': signal.from,
      'sdp': rtcConnection.localDescription,
    });

  }

  removeParticipant(uuid) {
    delete this.participants[uuid];

    if (typeof this.identity.onParticipantLeft == 'function') {
      this.identity.onParticipantLeft(uuid);
    }
  }

  addIceCandidate(signal) {
    const rtcConnection = this.participants[signal.from].rtc;
    rtcConnection.addIceCandidate(new _misc_RTCIceCandidate_js__WEBPACK_IMPORTED_MODULE_1__["default"](signal.ice));
  }

  createAnswer(signal) {
    return new Promise(async (resolve, reject) => {
      if (!this.participants[signal.from] || !this.participants[signal.from].rtc) {
        console.log('Starting call in createAnswer');
        this.shareVideo(signal, false);
      }

      await this.participants[signal.from].rtc.setRemoteDescription(new _misc_RTCSessionDescription_js__WEBPACK_IMPORTED_MODULE_3__["default"](signal.sdp));
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        this.logger.log('Got an offer from ' + signal.from, signal);
        const description = await this.participants[signal.from].rtc.createAnswer();

        await this.participants[signal.from].rtc.setLocalDescription(description);
        this.channel.publish('system:video_answer', {
          'from': this.channel.uuid,
          'to': signal.from,
          'sdp': this.participants[signal.from].rtc.localDescription,
        });
        resolve();
      } else {
        this.logger.log('Got an asnwer from ' + signal.from);

        resolve();
      }
    });
  }

  handleAnswer(signal){
    this.participants[signal.from].rtc.setRemoteDescription(new _misc_RTCSessionDescription_js__WEBPACK_IMPORTED_MODULE_3__["default"](signal.sdp));
  }

  /**
     * Callback to handle local stream
     * @param {*} stream
     */
  getUserMediaSuccess(stream) {
    this.localStream = stream;
    this.cameraStream = stream;

    if (typeof this.identity.onLocalVideo == 'function') {
      this.identity.onLocalVideo(stream, this);
    }

    this.requestPeerVideo();
  }

  requestPeerVideo() {
    var eventName = 'system:portal_broadcaster';

    if(!this.identity.shouldBroadcast){
      eventName = 'system:portal_watcher';
    }

    this.channel.publish(eventName, {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast
    });
  }

  requestOfferFromPeer(){
    this.channel.publish("system:video_request", {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast
    });
  }

  errorHandler(e) {
    this.logger.error('Portal error', e);
  }
}


/***/ }),

/***/ "./src/misc/DefaultOptions.js":
/*!************************************!*\
  !*** ./src/misc/DefaultOptions.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  version: 3,
  clusterId: 'demo',
  clusterDomain: null,
  apiKey: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm',
  consoleLogs: false,
  notifySelf: 0,
  jwt: null,
  presence: 0,
  authEndpoint: '/broadcasting/auth',
  authHeaders: {},
  forceAuth: false,
  userId: null,
  blockchainTestMode: false,
  blockchainGasFee: 41000,
});


/***/ }),

/***/ "./src/misc/RTCIceCandidate.js":
/*!*************************************!*\
  !*** ./src/misc/RTCIceCandidate.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var iceCandidate = {};
try{ 
    iceCandidate = RTCIceCandidate;
}catch(e){}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (iceCandidate);


/***/ }),

/***/ "./src/misc/RTCPeerConnection.js":
/*!***************************************!*\
  !*** ./src/misc/RTCPeerConnection.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var peerConnection = {}
try {
  peerConnection = RTCPeerConnection;
} catch (e) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (peerConnection);


/***/ }),

/***/ "./src/misc/RTCSessionDescription.js":
/*!*******************************************!*\
  !*** ./src/misc/RTCSessionDescription.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var sessionDescription = {}
try {
  sessionDescription = RTCSessionDescription;
} catch (e) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sessionDescription);


/***/ }),

/***/ "./src/misc/WebSocket.js":
/*!*******************************!*\
  !*** ./src/misc/WebSocket.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var socket = {};
try {
  socket = WebSocket;
} catch (e) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PieSocket_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PieSocket.js */ "./src/PieSocket.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_PieSocket_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
})();

PieSocket = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztBQ0psQztBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7O1VDSnRCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDdEMsaUVBQWUscURBQVMsRSIsInNvdXJjZXMiOlsid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9CbG9ja2NoYWluLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9DaGFubmVsLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9JbnZhbGlkQXV0aEV4Y2VwdGlvbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvTG9nZ2VyLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9QaWVTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL1BvcnRhbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9EZWZhdWx0T3B0aW9ucy5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9SVENJY2VDYW5kaWRhdGUuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvUlRDUGVlckNvbm5lY3Rpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvUlRDU2Vzc2lvbkRlc2NyaXB0aW9uLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL1dlYlNvY2tldC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJjb25zdCBQaWVNZXNzYWdlID0ge307XG5jb25zdCBCQ01FbmRwb2ludCA9ICdodHRwczovL3d3dy5waWVzb2NrZXQuY29tL2FwaS9ibG9ja2NoYWluL3BheWxvYWRIYXNoJztcbmNvbnN0IFBpZU1lc3NhZ2VBZGRyZXNzRGV2ID0gJzB4MjMyMWMzMjE4Mjg5NDYxNTNhODQ1ZTY5ZWUxNjhmNDEzZTg1YzkwZCc7XG5jb25zdCBQaWVNZXNzYWdlQWRkcmVzc1Byb2QgPSAnMHgyYTg0MENBNDBFMDgyRGJGMjQ2MTBCNjJhOTc4OTAwQmZDYUIyM0QzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2tjaGFpbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5hcGlLZXkgPSB0aGlzLm9wdGlvbnMuYXBpS2V5O1xuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMub3B0aW9ucy5jaGFubmVsSWQ7XG4gICAgdGhpcy5ibG9ja2NoYWluVGVzdE1vZGUgPSB0aGlzLm9wdGlvbnMuYmxvY2tjaGFpblRlc3RNb2RlO1xuICAgIHRoaXMuYmxvY2tjaGFpbkdhc0ZlZSA9IHRoaXMub3B0aW9ucy5ibG9ja2NoYWluR2FzRmVlO1xuXG4gICAgaWYgKHRoaXMuYmxvY2tjaGFpblRlc3RNb2RlKSB7XG4gICAgICB0aGlzLmNvbnRyYWN0QWRkcmVzcyA9IFBpZU1lc3NhZ2VBZGRyZXNzRGV2O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRyYWN0QWRkcmVzcyA9IFBpZU1lc3NhZ2VBZGRyZXNzUHJvZDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IHczID0gbmV3IFdlYjMod2luZG93LmV0aGVyZXVtKTtcbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IGV0aGVyZXVtLnJlcXVlc3Qoe21ldGhvZDogJ2V0aF9yZXF1ZXN0QWNjb3VudHMnfSk7XG4gICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudHNbMF07XG5cbiAgICB0aGlzLmNvbnRyYWN0ID0gbmV3IHczLmV0aC5Db250cmFjdChQaWVNZXNzYWdlLmFiaSwgdGhpcy5jb250cmFjdEFkZHJlc3MpO1xuICB9XG5cbiAgY2hlY2tXZWIzKCkge1xuICAgIGlmICh0eXBlb2YgV2ViMyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2coJ1dlYjMuanMgaXMgbm90IGluc3RhbGxlZCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5ldGhlcmV1bSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2coJ01ldGFNYXNrIGlzIG5vdCBpbnN0YWxsZWQhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBjb25maXJtKGhhc2gpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hlY2tXZWIzKCkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyYWN0KSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNlaXB0ID0gdGhpcy5jb250cmFjdC5tZXRob2RzLmNvbmZpcm0oaGFzaCkuc2VuZCh7ZnJvbTogdGhpcy5hY2NvdW50LCBnYXM6IHRoaXMuYmxvY2tjaGFpbkdhc0ZlZX0pO1xuICAgICAgICByZWNlaXB0Lm9uKCd0cmFuc2FjdGlvbkhhc2gnLCByZXNvbHZlKTtcbiAgICAgICAgcmVjZWlwdC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmQobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5jaGVja1dlYjMoKSkge1xuICAgICAgICBpZiAoIXRoaXMuY29udHJhY3QpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJhY21IYXNoID0gYXdhaXQgdGhpcy5nZXRUcmFuc2FjdGlvbkhhc2gobWVzc2FnZSk7XG5cbiAgICAgICAgY29uc3QgcmVjZWlwdCA9IHRoaXMuY29udHJhY3QubWV0aG9kcy5zZW5kKGJhY21IYXNoLnBheWxvYWQpLnNlbmQoe2Zyb206IHRoaXMuYWNjb3VudCwgZ2FzOiB0aGlzLmJsb2NrY2hhaW5HYXNGZWV9KTtcbiAgICAgICAgcmVjZWlwdC5vbigndHJhbnNhY3Rpb25IYXNoJywgKGhhc2gpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICAgICAgICBpZDogYmFjbUhhc2gudHJhbnNhY3Rpb25faWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWNlaXB0Lm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBXZWIzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVqZWN0KCdQbGVhc2UgaW5zdGFsbCBXZWIzLmpzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdQbGVhc2UgaW5zdGFsbCBNZXRhTWFzaycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRUcmFuc2FjdGlvbkhhc2gobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAgIGRhdGEuYXBwZW5kKCdhcGlLZXknLCB0aGlzLmFwaUtleSk7XG4gICAgICBkYXRhLmFwcGVuZCgnY2hhbm5lbCcsIHRoaXMuY2hhbm5lbCk7XG4gICAgICBkYXRhLmFwcGVuZCgnbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgIGRhdGEuYXBwZW5kKCdjb250cmFjdCcsIHRoaXMuY29udHJhY3RBZGRyZXNzKTtcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUGllU29ja2V0IEVycm9yOiAke0pTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmVycm9ycyl9YCk7XG4gICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLnN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KCdVbmtub3duIGVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbm5lY3QgdG8gQmxvY2tjaGFpbiBNZXNzYWdpbmcgQVBJLCB0cnkgbGF0ZXInKTtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQmxvY2tjaGFpbiBNZXNzYWdpbmcgQVBJIHNlZW1zIHVucmVhY2hhYmxlIGF0IHRoZSBtb21lbnQsIHRyeSBsYXRlcicpO1xuICAgICAgICByZWplY3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIub3BlbignUE9TVCcsIEJDTUVuZHBvaW50KTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEJsb2NrY2hhaW4gZnJvbSAnLi9CbG9ja2NoYWluLmpzJztcbmltcG9ydCBTb2NrZXQgZnJvbSAnLi9taXNjL1dlYlNvY2tldC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHksIGluaXQ9dHJ1ZSkge1xuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLm1lbWJlcnMgPSBbXTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy51dWlkID0gbnVsbDtcbiAgICB0aGlzLm9uU29ja2V0Q29ubmVjdGVkID0gKCkgPT4ge307XG4gICAgdGhpcy5vblNvY2tldEVycm9yID0gKCkgPT4ge307XG5cbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmluaXQoZW5kcG9pbnQsIGlkZW50aXR5KTtcbiAgfVxuXG4gIGluaXQoZW5kcG9pbnQsIGlkZW50aXR5KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gIH1cblxuICBnZXRNZW1iZXJCeVVVSUQodXVpZCkge1xuICAgIGxldCBtZW1iZXIgPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5tZW1iZXJzW2ldLnV1aWQgPT0gdXVpZCkge1xuICAgICAgICBtZW1iZXIgPSB0aGlzLm1lbWJlcnNbaV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVtYmVyO1xuICB9XG5cbiAgZ2V0Q3VycmVudE1lbWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNZW1iZXJCeVVVSUQodGhpcy51dWlkKTtcbiAgfVxuXG4gIGNvbm5lY3QoKSB7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IG5ldyBTb2NrZXQodGhpcy5lbmRwb2ludCk7XG4gICAgY29ubmVjdGlvbi5vbm1lc3NhZ2UgPSB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICBjb25uZWN0aW9uLm9uZXJyb3IgPSB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKTtcbiAgICBjb25uZWN0aW9uLm9uY2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKTtcblxuICAgIGlmICh0aGlzLmlkZW50aXR5Lm9uU29ja2V0Q29ubmVjdGVkKSB7XG4gICAgICB0aGlzLm9uU29ja2V0Q29ubmVjdGVkID0gdGhpcy5pZGVudGl0eS5vblNvY2tldENvbm5lY3RlZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pZGVudGl0eS5vblNvY2tldEVycm9yKSB7XG4gICAgICB0aGlzLm9uU29ja2V0RXJyb3IgPSB0aGlzLmlkZW50aXR5Lm9uU29ja2V0RXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAvLyBSZWdpc3RlciBsaWZlY3ljbGUgY2FsbGJhY2tzXG4gICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gIH1cblxuICBsaXN0ZW4oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgLy8gUmVnaXN0ZXIgdXNlciBkZWZpbmVkIGNhbGxiYWNrc1xuICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICB9XG5cblxuICBzZW5kKGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoZGF0YSk7XG4gIH1cblxuICBhc3luYyBwdWJsaXNoKGV2ZW50LCBkYXRhLCBtZXRhKSB7XG4gICAgaWYgKG1ldGEgJiYgbWV0YS5ibG9ja2NoYWluKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZW5kT25CbG9ja2NoYWluKGV2ZW50LCBkYXRhLCBtZXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBtZXRhOiBtZXRhLFxuICAgIH0pKTtcbiAgfVxuXG5cbiAgYXN5bmMgc2VuZE9uQmxvY2tjaGFpbihldmVudCwgZGF0YSwgbWV0YSkge1xuICAgIGlmICghdGhpcy5ibG9ja2NoYWluKSB7XG4gICAgICB0aGlzLmJsb2NrY2hhaW4gPSBuZXcgQmxvY2tjaGFpbih0aGlzLmlkZW50aXR5KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWlwdCA9IGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5zZW5kKGRhdGEpO1xuXG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWhhc2gnXS5iaW5kKHRoaXMpKHtcbiAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICBtZXRhOiBtZXRhLFxuICAgICAgICAgIHRyYW5zYWN0aW9uSGFzaDogcmVjZWlwdC5oYXNoLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKEpTT04uc3RyaW5naWZ5KHsnZXZlbnQnOiBldmVudCwgJ2RhdGEnOiBkYXRhLCAnbWV0YSc6IHsuLi5tZXRhLCAndHJhbnNhY3Rpb25faWQnOiByZWNlaXB0LmlkLCAndHJhbnNhY3Rpb25faGFzaCc6IHJlY2VpcHQuaGFzaH19KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBhc3luYyBjb25maXJtT25CbG9ja2NoYWluKGV2ZW50LCB0cmFuc2FjdGlvbkhhc2gpIHtcbiAgICBpZiAoIXRoaXMuYmxvY2tjaGFpbikge1xuICAgICAgdGhpcy5ibG9ja2NoYWluID0gbmV3IEJsb2NrY2hhaW4odGhpcy5pZGVudGl0eSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCB0aGlzLmJsb2NrY2hhaW4uY29uZmlybSh0cmFuc2FjdGlvbkhhc2gpO1xuXG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWhhc2gnXS5iaW5kKHRoaXMpKHtcbiAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgY29uZmlybWF0aW9uSGFzaDogdHJhbnNhY3Rpb25IYXNoLFxuICAgICAgICAgIHRyYW5zYWN0aW9uSGFzaDogaGFzaCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChKU09OLnN0cmluZ2lmeSh7J2V2ZW50JzogZXZlbnQsICdkYXRhJzogdHJhbnNhY3Rpb25IYXNoLCAnbWV0YSc6IHsndHJhbnNhY3Rpb25faWQnOiAxLCAndHJhbnNhY3Rpb25faGFzaCc6IGhhc2h9fSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10uYmluZCh0aGlzKShlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk1lc3NhZ2UoZSkge1xuICAgIHRoaXMubG9nZ2VyLmxvZygnQ2hhbm5lbCBtZXNzYWdlOicsIGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICBpZiAobWVzc2FnZS5lcnJvciAmJiBtZXNzYWdlLmVycm9yLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXJlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgaWYgKG1lc3NhZ2UuZXZlbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVNZW1iZXJIYW5kc2hha2UobWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW21lc3NhZ2UuZXZlbnRdKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbbWVzc2FnZS5ldmVudF0uYmluZCh0aGlzKShtZXNzYWdlLmRhdGEsIG1lc3NhZ2UubWV0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbJyonXSkge1xuICAgICAgICAgIHRoaXMubGlzdGVuZXJzWycqJ10uYmluZCh0aGlzKShtZXNzYWdlLmV2ZW50LCBtZXNzYWdlLmRhdGEsIG1lc3NhZ2UubWV0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChqc29uRXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGpzb25FeGNlcHRpb24pO1xuICAgIH1cblxuICAgIC8vIEZpcmUgbGlmZWN5Y2xlIGNhbGxiYWNrXG4gICAgaWYgKHRoaXMuZXZlbnRzWydtZXNzYWdlJ10pIHtcbiAgICAgIHRoaXMuZXZlbnRzWydtZXNzYWdlJ10uYmluZCh0aGlzKShlKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNZW1iZXJIYW5kc2hha2UobWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06bWVtYmVyX2xpc3QnKSB7XG4gICAgICB0aGlzLm1lbWJlcnMgPSBtZXNzYWdlLmRhdGEubWVtYmVycztcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTptZW1iZXJfam9pbmVkJykge1xuICAgICAgdGhpcy5tZW1iZXJzID0gbWVzc2FnZS5kYXRhLm1lbWJlcnM7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06bWVtYmVyX2xlZnQnKSB7XG4gICAgICB0aGlzLm1lbWJlcnMgPSBtZXNzYWdlLmRhdGEubWVtYmVycztcbiAgICAgIGlmICh0aGlzLnBvcnRhbCkge1xuICAgICAgICB0aGlzLnBvcnRhbC5yZW1vdmVQYXJ0aWNpcGFudChtZXNzYWdlLmRhdGEubWVtYmVyLnV1aWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06cG9ydGFsX2Jyb2FkY2FzdGVyJyAmJiBtZXNzYWdlLmRhdGEuZnJvbSAhPSB0aGlzLnV1aWQpIHtcbiAgICAgIHRoaXMucG9ydGFsLnJlcXVlc3RPZmZlckZyb21QZWVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBcbiAgICBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06cG9ydGFsX3dhdGNoZXInICYmIG1lc3NhZ2UuZGF0YS5mcm9tICE9IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuc2hhcmVWaWRlbyhtZXNzYWdlLmRhdGEpO1xuICAgIH1lbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fcmVxdWVzdCcgJiYgbWVzc2FnZS5kYXRhLmZyb20gIT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5zaGFyZVZpZGVvKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBcbiAgICBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06cG9ydGFsX2NhbmRpZGF0ZScgJiYgbWVzc2FnZS5kYXRhLnRvID09IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuYWRkSWNlQ2FuZGlkYXRlKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fb2ZmZXInICYmIG1lc3NhZ2UuZGF0YS50byA9PSB0aGlzLnV1aWQpIHtcbiAgICAgIHRoaXMucG9ydGFsLmNyZWF0ZUFuc3dlcihtZXNzYWdlLmRhdGEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOnZpZGVvX2Fuc3dlcicgJiYgbWVzc2FnZS5kYXRhLnRvID09IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuaGFuZGxlQW5zd2VyKG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb25PcGVuKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgIC8vIFN5c3RlbSBpbml0IGNhbGxiYWNrXG4gICAgdGhpcy5vblNvY2tldENvbm5lY3RlZChlKTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDaGFubmVsIGVycm9yOicsIGUpO1xuICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuXG4gICAgLy8gU3lzdGVtIGluaXQgZXJyb3IgY2FsbGJhY2tcbiAgICB0aGlzLm9uU29ja2V0RXJyb3IoZSk7XG5cbiAgICAvLyBVc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICBpZiAodGhpcy5ldmVudHNbJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuZXZlbnRzWydlcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShlKSB7XG4gICAgdGhpcy5sb2dnZXIud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcblxuICAgIC8vIFVzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10uYmluZCh0aGlzKShlKTtcbiAgICB9XG4gIH1cblxuICByZWNvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZFJlY29ubmVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5sb2coJ1JlY29ubmVjdGluZycpO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZhbGlkQXV0aEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U9bnVsbCwgbmFtZT0nSW52YWxpZEF1dGhFeGNlcHRpb24nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnQXV0aCBlbmRwb2ludCBkaWQgbm90IHJldHVybiBhIHZhbGlkIEpXVCBUb2tlbiwgcGxlYXNlIHNlZTogaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9kb2NzLzMuMC9hdXRoZW50aWNhdGlvbic7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBsb2coLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm4oLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBlcnJvciguLi5kYXRhKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC5qcyc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyLmpzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9Qb3J0YWwuanMnO1xuaW1wb3J0IEludmFsaWRBdXRoRXhjZXB0aW9uIGZyb20gJy4vSW52YWxpZEF1dGhFeGNlcHRpb24uanMnO1xuaW1wb3J0IGRlZmF1bHRPcHRpb25zIGZyb20gJy4vbWlzYy9EZWZhdWx0T3B0aW9ucy5qcyc7XG5pbXBvcnQge3Y0IGFzIHV1aWR2NH0gZnJvbSAndXVpZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9O1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc3Vic2NyaWJlKGNoYW5uZWxJZCwgcm9vbU9wdGlvbnM9e30pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHJvb21PcHRpb25zLnZpZGVvIHx8IHJvb21PcHRpb25zLmF1ZGlvIHx8IHJvb21PcHRpb25zLnBvcnRhbCkge1xuICAgICAgICAvLyBGb3JjZSBjb25maWcgd2hlbiB2aWRlbyBpcyByZXF1aXJlZFxuICAgICAgICB0aGlzLm9wdGlvbnMubm90aWZ5U2VsZiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHV1aWQgPSB1dWlkdjQoKTtcbiAgICAgIGNvbnN0IGVuZHBvaW50ID0gYXdhaXQgdGhpcy5nZXRFbmRwb2ludChjaGFubmVsSWQsIHV1aWQpO1xuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnUmV0dXJuaW5nIGV4aXN0aW5nIGNoYW5uZWwnLCBjaGFubmVsSWQpO1xuICAgICAgICByZXNvbHZlKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NyZWF0aW5nIG5ldyBjaGFubmVsJywgY2hhbm5lbElkKTtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IG5ldyBDaGFubmVsKGVuZHBvaW50LCB7XG4gICAgICAgICAgY2hhbm5lbElkOiBjaGFubmVsSWQsXG4gICAgICAgICAgb25Tb2NrZXRDb25uZWN0ZWQ6ICgpID0+IHtcbiAgICAgICAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgICBpZiAocm9vbU9wdGlvbnMudmlkZW8gfHwgcm9vbU9wdGlvbnMuYXVkaW8gfHwgcm9vbU9wdGlvbnMucG9ydGFsKSB7XG4gICAgICAgICAgICAgIGNoYW5uZWwucG9ydGFsID0gbmV3IFBvcnRhbChjaGFubmVsLCB7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIC4uLnJvb21PcHRpb25zLFxuICAgICAgICAgICAgICB9KTsgYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICAgICAgcmVzb2x2ZShjaGFubmVsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uU29ja2V0RXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCgnRmFpbGVkIHRvIG1ha2Ugd2Vic29ja2V0IGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBXZWJTb2NrZXQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlcyB0aGUgcHJvbWlzZSBpbiBjYXNlIFdlYlNvY2tldCBpcyBub3QgZGVmaW5lZFxuICAgICAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgICByZXNvbHZlKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENvbm5lY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXV0aFRva2VuKGNoYW5uZWwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGRhdGEuYXBwZW5kKCdjaGFubmVsX25hbWUnLCBjaGFubmVsKTtcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBJbnZhbGlkQXV0aEV4Y2VwdGlvbignQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW4nLCAnQXV0aEVuZHBvaW50UmVzcG9uc2VFcnJvcicpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCk9PntcbiAgICAgICAgcmVqZWN0KG5ldyBJbnZhbGlkQXV0aEV4Y2VwdGlvbignQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW4nLCAnQXV0aEVuZHBvaW50RXJyb3InKSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGlzLm9wdGlvbnMuYXV0aEVuZHBvaW50KTtcblxuICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5hdXRoSGVhZGVycyk7XG4gICAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRoaXMub3B0aW9ucy5hdXRoSGVhZGVyc1toZWFkZXJdKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzR3VhcmRlZChjaGFubmVsKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5mb3JjZUF1dGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoJycrY2hhbm5lbCkuc3RhcnRzV2l0aCgncHJpdmF0ZS0nKTtcbiAgfVxuXG4gIGFzeW5jIGdldEVuZHBvaW50KGNoYW5uZWxJZCwgdXVpZCkge1xuICAgIGxldCBjbHVzdGVyRG9tYWluID0gdGhpcy5vcHRpb25zLmNsdXN0ZXJEb21haW4gPT0gbnVsbCA/IGAke3RoaXMub3B0aW9ucy5jbHVzdGVySWR9LnBpZXNvY2tldC5jb21gOnRoaXMub3B0aW9ucy5jbHVzdGVyRG9tYWluO1xuICAgIGxldCBlbmRwb2ludCA9IGB3c3M6Ly8ke2NsdXN0ZXJEb21haW59L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufS8ke2NoYW5uZWxJZH0/YXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlLZXl9Jm5vdGlmeV9zZWxmPSR7dGhpcy5vcHRpb25zLm5vdGlmeVNlbGZ9JnNvdXJjZT1qc3NkayZ2PTUuMC44JnByZXNlbmNlPSR7dGhpcy5vcHRpb25zLnByZXNlbmNlfWA7XG5cbiAgICAvLyBTZXQgYXV0aFxuICAgIGlmICh0aGlzLm9wdGlvbnMuand0KSB7XG4gICAgICBlbmRwb2ludCA9IGVuZHBvaW50Kycmand0PScrdGhpcy5vcHRpb25zLmp3dDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNHdWFyZGVkKGNoYW5uZWxJZCkpIHtcbiAgICAgIGNvbnN0IGF1dGggPSBhd2FpdCB0aGlzLmdldEF1dGhUb2tlbihjaGFubmVsSWQpO1xuICAgICAgaWYgKGF1dGguYXV0aCkge1xuICAgICAgICBlbmRwb2ludCA9IGVuZHBvaW50ICsgJyZqd3Q9JythdXRoLmF1dGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IHVzZXIgaWRlbnRpdHlcbiAgICBpZiAodGhpcy5vcHRpb25zLnVzZXJJZCkge1xuICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludCArICcmdXNlcj0nK3RoaXMub3B0aW9ucy51c2VySWQ7XG4gICAgfVxuXG4gICAgLy8gQWRkIHV1aWRcbiAgICBlbmRwb2ludCA9IGVuZHBvaW50KycmdXVpZD0nK3V1aWQ7XG5cbiAgICByZXR1cm4gZW5kcG9pbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEljZUNhbmRpZGF0ZSBmcm9tICcuL21pc2MvUlRDSWNlQ2FuZGlkYXRlLmpzJztcbmltcG9ydCBQZWVyQ29ubmVjdGlvbiBmcm9tICcuL21pc2MvUlRDUGVlckNvbm5lY3Rpb24uanMnO1xuaW1wb3J0IFNlc3Npb25EZXNjcmlwdGlvbiBmcm9tICcuL21pc2MvUlRDU2Vzc2lvbkRlc2NyaXB0aW9uLmpzJztcbmNvbnN0IGRlZmF1bHRQb3J0YWxPcHRpb25zID0ge1xuICBzaG91bGRCcm9hZGNhc3Q6IHRydWUsXG4gIHBvcnRhbDogdHJ1ZSxcbiAgdmlkZW86IGZhbHNlLFxuICBhdWRpbzogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIHtcbiAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHZpZGVvIHJvb20gaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0geyp9IGNoYW5uZWxcbiAgICAgKi9cbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgaWRlbnRpdHkpIHtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgdGhpcy5pZGVudGl0eSA9IHsgLi4uZGVmYXVsdFBvcnRhbE9wdGlvbnMsIC4uLmlkZW50aXR5IH07XG4gICAgdGhpcy5sb2NhbFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5zZW5kZXJzID0gW107XG4gICAgdGhpcy5jYW1lcmFTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMuc2hhcmluZ1NjcmVlbiA9IGZhbHNlO1xuICAgIHRoaXMucGVlckNvbm5lY3Rpb25Db25maWcgPSB7XG4gICAgICAnaWNlU2VydmVycyc6IFtcbiAgICAgICAgeyAndXJscyc6ICdzdHVuOnN0dW4uc3R1bnByb3RvY29sLm9yZzozNDc4JyB9LFxuICAgICAgICB7ICd1cmxzJzogJ3N0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDInIH0sXG4gICAgICBdLFxuICAgIH07XG4gICAgdGhpcy5jb25zdHJhaW50cyA9IHtcbiAgICAgIHZpZGVvOiBpZGVudGl0eS52aWRlbyxcbiAgICAgIGF1ZGlvOiBpZGVudGl0eS5hdWRpbyxcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJ0aWNpcGFudHMgPSBbXTtcbiAgICB0aGlzLmlzTmVnb3RpYXRpbmcgPSBbXTtcblxuXG4gICAgdGhpcy5sb2dnZXIubG9nKCdJbml0aWFsaXppbmcgdmlkZW8gcm9vbScpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBsb2NhbCB2aWRlb1xuICAgICAqL1xuICBpbml0KCkge1xuICAgIGlmICghdGhpcy5jb25zdHJhaW50cy52aWRlbyAmJiAhdGhpcy5jb25zdHJhaW50cy5hdWRpbykge1xuICAgICAgdGhpcy5yZXF1ZXN0UGVlclZpZGVvKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHRoaXMuY29uc3RyYWludHMpLnRoZW4odGhpcy5nZXRVc2VyTWVkaWFTdWNjZXNzLmJpbmQodGhpcykpLmNhdGNoKHRoaXMuZXJyb3JIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBnZXRVc2VyTWVkaWEgQVBJJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc2hhcmVWaWRlbyhzaWduYWwsIGlzQ2FsbGVyID0gdHJ1ZSkge1xuICAgIGlmICghdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3QgJiYgaXNDYWxsZXIgJiYgIXNpZ25hbC5pc0Jyb2FkY2FzdGluZykge1xuICAgICAgY29uc29sZS5sb2coXCJSZWZ1c2luZyB0byBjYWxsLCBkZW5pZWQgYnJvYWRjYXN0IHJlcXVlc3RcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJwZWVyIGNvbm5lY3Rpb25cIiwgUGVlckNvbm5lY3Rpb24pO1xuICAgIGNvbnN0IHJ0Y0Nvbm5lY3Rpb24gPSBuZXcgUGVlckNvbm5lY3Rpb24odGhpcy5wZWVyQ29ubmVjdGlvbkNvbmZpZyk7XG5cbiAgICBydGNDb25uZWN0aW9uLm9uaWNlY2FuZGlkYXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY2FuZGlkYXRlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTpwb3J0YWxfY2FuZGlkYXRlJywge1xuICAgICAgICAgICdmcm9tJzogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICAgICAgJ3RvJzogc2lnbmFsLmZyb20sXG4gICAgICAgICAgJ2ljZSc6IGV2ZW50LmNhbmRpZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub250cmFjayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRyYWNrLmtpbmQgIT0gJ3ZpZGVvJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5zdHJlYW1zID0gZXZlbnQuc3RyZWFtcztcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkKHNpZ25hbC5mcm9tLCBldmVudC5zdHJlYW1zWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gKGUpID0+IHtcbiAgICAgIC8vIFdvcmthcm91bmQgZm9yIENocm9tZTogc2tpcCBuZXN0ZWQgbmVnb3RpYXRpb25zXG4gICAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID0gKHJ0Y0Nvbm5lY3Rpb24uc2lnbmFsaW5nU3RhdGUgIT0gJ3N0YWJsZScpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5sb2NhbFN0cmVhbSkge1xuICAgICAgdGhpcy5sb2NhbFN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICB0aGlzLnNlbmRlcnMucHVzaChydGNDb25uZWN0aW9uLmFkZFRyYWNrKHRyYWNrLCB0aGlzLmxvY2FsU3RyZWFtKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID0gZmFsc2U7XG5cblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZFZpZGVvT2ZmZXIoc2lnbmFsLCBydGNDb25uZWN0aW9uLCBpc0NhbGxlcik7XG4gICAgfTtcblxuICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXSA9IHtcbiAgICAgIHJ0YzogcnRjQ29ubmVjdGlvbixcbiAgICB9O1xuICB9XG5cbiAgc2hhcmVTY3JlZW4oKSB7XG4gICAgaWYoIXRoaXMuc2hhcmluZ1NjcmVlbil7XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldERpc3BsYXlNZWRpYSh7IHZpZGVvOiB0cnVlIH0pXG4gICAgICAgIC50aGVuKHNjcmVlblN0cmVhbSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2NyZWVuVHJhY2sgPSBzY3JlZW5TdHJlYW0uZ2V0VHJhY2tzKClbMF07XG4gICAgICAgICAgdGhpcy5sb2NhbFN0cmVhbSA9IHNjcmVlblN0cmVhbTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8oc2NyZWVuU3RyZWFtLCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zaGFyaW5nU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHNlbmRlciBvZiB0aGlzLnNlbmRlcnMpIHtcbiAgICAgICAgICAgIGlmIChzZW5kZXIudHJhY2sgJiYgc2VuZGVyLnRyYWNrLmtpbmQgPT09ICd2aWRlbycpXG4gICAgICAgICAgICAgIHNlbmRlci5yZXBsYWNlVHJhY2soc2NyZWVuVHJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhbGVydChcIlNjcmVlbiBzaGFyaW5nIHN0YXJ0ZWQhIFRvIHN0b3AsIGNsaWNrIG9uIFN0b3AgU2hhcmluZyBidXR0b24gYXQgdGhlIGJvdHRvbSFcIilcblxuICAgICAgICAgIHNjcmVlblRyYWNrLm9uZW5kZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RyZWFtID0gdGhpcy5jYW1lcmFTdHJlYW07XG4gICAgICAgICAgICB0aGlzLnNoYXJpbmdTY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzLmlkZW50aXR5Lm9uTG9jYWxWaWRlbyh0aGlzLmNhbWVyYVN0cmVhbSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNlbmRlciBvZiB0aGlzLnNlbmRlcnMpIHtcbiAgICAgICAgICAgICAgaWYgKHNlbmRlci50cmFjayAmJiBzZW5kZXIudHJhY2sua2luZCA9PT0gJ3ZpZGVvJykge1xuICAgICAgICAgICAgICAgIHNlbmRlci5yZXBsYWNlVHJhY2sodGhpcy5jYW1lcmFTdHJlYW0uZ2V0VHJhY2tzKClbMF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNoYXJpbmcgc2NyZWVuOicsIGVycm9yKTtcbiAgICAgICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ05vdEFsbG93ZWRFcnJvcicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VzZXIgZGVuaWVkIHBlcm1pc3Npb24gZm9yIHNjcmVlbiBzaGFyaW5nLicpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IubmFtZSA9PT0gJ05vdEZvdW5kRXJyb3InKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdEaXNwbGF5IG1lZGlhIG5vdCBmb3VuZCAocG9zc2libHkgZHVlIHRvIHByaXZhY3kgc2V0dGluZ3MpLicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmtub3duIGVycm9yIGR1cmluZyBzY3JlZW4gc2hhcmluZzonLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIGFsZXJ0KFwiWW91IGFyZSBhbHJlYWR5IHNoYXJpbmcgc2NyZWVuIVwiKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kVmlkZW9PZmZlcihzaWduYWwsIHJ0Y0Nvbm5lY3Rpb24sIGlzQ2FsbGVyKSB7XG5cbiAgICBpZiAoIWlzQ2FsbGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICBpZiAodGhpcy5pc05lZ290aWF0aW5nW3NpZ25hbC5mcm9tXSkge1xuICAgICAgY29uc29sZS5sb2coJ1NLSVAgbmVzdGVkIG5lZ290aWF0aW9ucycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0gPSB0cnVlO1xuXG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHJ0Y0Nvbm5lY3Rpb24uY3JlYXRlT2ZmZXIoKTtcbiAgICBhd2FpdCBydGNDb25uZWN0aW9uLnNldExvY2FsRGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xuXG4gICAgY29uc29sZS5sb2coJ01ha2luZyBvZmZlcicpO1xuICAgIC8vIFNlbmQgYSBjYWxsIG9mZmVyXG4gICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTp2aWRlb19vZmZlcicsIHtcbiAgICAgICdmcm9tJzogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICAndG8nOiBzaWduYWwuZnJvbSxcbiAgICAgICdzZHAnOiBydGNDb25uZWN0aW9uLmxvY2FsRGVzY3JpcHRpb24sXG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZVBhcnRpY2lwYW50KHV1aWQpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWNpcGFudHNbdXVpZF07XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpdHkub25QYXJ0aWNpcGFudExlZnQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50TGVmdCh1dWlkKTtcbiAgICB9XG4gIH1cblxuICBhZGRJY2VDYW5kaWRhdGUoc2lnbmFsKSB7XG4gICAgY29uc3QgcnRjQ29ubmVjdGlvbiA9IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGM7XG4gICAgcnRjQ29ubmVjdGlvbi5hZGRJY2VDYW5kaWRhdGUobmV3IEljZUNhbmRpZGF0ZShzaWduYWwuaWNlKSk7XG4gIH1cblxuICBjcmVhdGVBbnN3ZXIoc2lnbmFsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dIHx8ICF0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBjYWxsIGluIGNyZWF0ZUFuc3dlcicpO1xuICAgICAgICB0aGlzLnNoYXJlVmlkZW8oc2lnbmFsLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFNlc3Npb25EZXNjcmlwdGlvbihzaWduYWwuc2RwKSk7XG4gICAgICAvLyBPbmx5IGNyZWF0ZSBhbnN3ZXJzIGluIHJlc3BvbnNlIHRvIG9mZmVyc1xuICAgICAgaWYgKHNpZ25hbC5zZHAudHlwZSA9PSAnb2ZmZXInKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnR290IGFuIG9mZmVyIGZyb20gJyArIHNpZ25hbC5mcm9tLCBzaWduYWwpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMuY3JlYXRlQW5zd2VyKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTp2aWRlb19hbnN3ZXInLCB7XG4gICAgICAgICAgJ2Zyb20nOiB0aGlzLmNoYW5uZWwudXVpZCxcbiAgICAgICAgICAndG8nOiBzaWduYWwuZnJvbSxcbiAgICAgICAgICAnc2RwJzogdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5sb2NhbERlc2NyaXB0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdHb3QgYW4gYXNud2VyIGZyb20gJyArIHNpZ25hbC5mcm9tKTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVBbnN3ZXIoc2lnbmFsKXtcbiAgICB0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBTZXNzaW9uRGVzY3JpcHRpb24oc2lnbmFsLnNkcCkpO1xuICB9XG5cbiAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaGFuZGxlIGxvY2FsIHN0cmVhbVxuICAgICAqIEBwYXJhbSB7Kn0gc3RyZWFtXG4gICAgICovXG4gIGdldFVzZXJNZWRpYVN1Y2Nlc3Moc3RyZWFtKSB7XG4gICAgdGhpcy5sb2NhbFN0cmVhbSA9IHN0cmVhbTtcbiAgICB0aGlzLmNhbWVyYVN0cmVhbSA9IHN0cmVhbTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8oc3RyZWFtLCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3RQZWVyVmlkZW8oKTtcbiAgfVxuXG4gIHJlcXVlc3RQZWVyVmlkZW8oKSB7XG4gICAgdmFyIGV2ZW50TmFtZSA9ICdzeXN0ZW06cG9ydGFsX2Jyb2FkY2FzdGVyJztcblxuICAgIGlmKCF0aGlzLmlkZW50aXR5LnNob3VsZEJyb2FkY2FzdCl7XG4gICAgICBldmVudE5hbWUgPSAnc3lzdGVtOnBvcnRhbF93YXRjaGVyJztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwucHVibGlzaChldmVudE5hbWUsIHtcbiAgICAgIGZyb206IHRoaXMuY2hhbm5lbC51dWlkLFxuICAgICAgaXNCcm9hZGNhc3Rpbmc6IHRoaXMuaWRlbnRpdHkuc2hvdWxkQnJvYWRjYXN0XG4gICAgfSk7XG4gIH1cblxuICByZXF1ZXN0T2ZmZXJGcm9tUGVlcigpe1xuICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKFwic3lzdGVtOnZpZGVvX3JlcXVlc3RcIiwge1xuICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICBpc0Jyb2FkY2FzdGluZzogdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3RcbiAgICB9KTtcbiAgfVxuXG4gIGVycm9ySGFuZGxlcihlKSB7XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1BvcnRhbCBlcnJvcicsIGUpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIHZlcnNpb246IDMsXG4gIGNsdXN0ZXJJZDogJ2RlbW8nLFxuICBjbHVzdGVyRG9tYWluOiBudWxsLFxuICBhcGlLZXk6ICdvQ2RDTWNNUFFwYnZOalVJenF0dkYxZDJYMm9rV3BEUWo0QXdBUkp1QWd0amh6S3hWRWpRVTZJZENqd20nLFxuICBjb25zb2xlTG9nczogZmFsc2UsXG4gIG5vdGlmeVNlbGY6IDAsXG4gIGp3dDogbnVsbCxcbiAgcHJlc2VuY2U6IDAsXG4gIGF1dGhFbmRwb2ludDogJy9icm9hZGNhc3RpbmcvYXV0aCcsXG4gIGF1dGhIZWFkZXJzOiB7fSxcbiAgZm9yY2VBdXRoOiBmYWxzZSxcbiAgdXNlcklkOiBudWxsLFxuICBibG9ja2NoYWluVGVzdE1vZGU6IGZhbHNlLFxuICBibG9ja2NoYWluR2FzRmVlOiA0MTAwMCxcbn07XG4iLCJ2YXIgaWNlQ2FuZGlkYXRlID0ge307XG50cnl7IFxuICAgIGljZUNhbmRpZGF0ZSA9IFJUQ0ljZUNhbmRpZGF0ZTtcbn1jYXRjaChlKXt9XG5leHBvcnQgZGVmYXVsdCBpY2VDYW5kaWRhdGU7XG4iLCJ2YXIgcGVlckNvbm5lY3Rpb24gPSB7fVxudHJ5IHtcbiAgcGVlckNvbm5lY3Rpb24gPSBSVENQZWVyQ29ubmVjdGlvbjtcbn0gY2F0Y2ggKGUpIHt9XG5leHBvcnQgZGVmYXVsdCBwZWVyQ29ubmVjdGlvbjtcbiIsInZhciBzZXNzaW9uRGVzY3JpcHRpb24gPSB7fVxudHJ5IHtcbiAgc2Vzc2lvbkRlc2NyaXB0aW9uID0gUlRDU2Vzc2lvbkRlc2NyaXB0aW9uO1xufSBjYXRjaCAoZSkge31cbmV4cG9ydCBkZWZhdWx0IHNlc3Npb25EZXNjcmlwdGlvbjtcbiIsInZhciBzb2NrZXQgPSB7fTtcbnRyeSB7XG4gIHNvY2tldCA9IFdlYlNvY2tldDtcbn0gY2F0Y2ggKGUpIHt9XG5leHBvcnQgZGVmYXVsdCBzb2NrZXQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBQaWVTb2NrZXQgZnJvbSBcIi4vUGllU29ja2V0LmpzXCJcbmV4cG9ydCBkZWZhdWx0IFBpZVNvY2tldDsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=