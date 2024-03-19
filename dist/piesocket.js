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
    } else if (message.event == 'system:portal_broadcaster' && message.data.from != this.uuid) {
      this.portal.requestOfferFromPeer(message.data);
    } else if (message.event == 'system:portal_watcher' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } else if (message.event == 'system:video_request' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } else if (message.event == 'system:portal_candidate' && message.data.to == this.uuid) {
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
  audio: true,
};

class Portal {
  /**
   * Creates a video room instance
   * @param {*} channel
   * @param {*} identity
   *
   * @return {void} Returns an instance of the Portal
   */
  constructor(channel, identity) {
    this.channel = channel;
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](identity);
    this.identity = {...defaultPortalOptions, ...identity};
    this.localStream = null;
    this.displayStream = null;
    this.peerConnectionConfig = {
      iceServers: [
        {urls: 'stun:stun.stunprotocol.org:3478'},
        {urls: 'stun:stun.l.google.com:19302'},
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
   * @return {void}
   */
  init() {
    if (!this.constraints.video && !this.constraints.audio) {
      this.requestPeerVideo();
      return;
    }

    if (
      typeof navigator != 'undefined' &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(this.getUserMediaSuccess.bind(this))
          .catch(this.errorHandler.bind(this));
      return true;
    } else {
      this.logger.error('Your browser does not support getUserMedia API');
      return false;
    }
  }

  shareVideo(signal, isCaller = true) {
    if (!this.identity.shouldBroadcast && isCaller && !signal.isBroadcasting) {
      console.log('Refusing to call, denied broadcast request');
      return;
    }

    console.log('peer connection', _misc_RTCPeerConnection_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
    const rtcConnection = new _misc_RTCPeerConnection_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.peerConnectionConfig);

    rtcConnection.onicecandidate = (event) => {
      if (event.candidate != null) {
        this.channel.publish('system:portal_candidate', {
          from: this.channel.uuid,
          to: signal.from,
          ice: event.candidate,
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
      this.isNegotiating[signal.from] =
        rtcConnection.signalingState != 'stable';
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        rtcConnection.addTrack(track, this.localStream);
      });
    }

    if (this.displayStream) {
      this.displayStream.getTracks().forEach((track) => {
        rtcConnection.addTrack(track, this.displayStream);
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

  async onLocalScreen(screenStream) {
    this.displayStream = screenStream;
    const participants = this.participants;

    const participantsIds = Object.keys(participants);
    participantsIds.forEach((id) => {
      const rtc = participants[id].rtc;
      screenStream.getTracks().forEach((track) => {
        rtc.addTrack(track, screenStream);
      });
    });
  }

  async shareScreen() {
    navigator.mediaDevices
        .getDisplayMedia()
        .then(this.onLocalScreen.bind(this))
        .catch(this.errorHandler.bind(this));
  }

  async sendVideoOffer(signal, rtcConnection, isCaller) {
    // if (!isCaller) {
    //   console.log("Skipped, not the caller");
    //   return;
    // }

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
      from: this.channel.uuid,
      to: signal.from,
      sdp: rtcConnection.localDescription,
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
      if (
        !this.participants[signal.from] ||
        !this.participants[signal.from].rtc
      ) {
        console.log('Starting call in createAnswer');
        this.shareVideo(signal, false);
      }

      await this.participants[signal.from].rtc.setRemoteDescription(
          new _misc_RTCSessionDescription_js__WEBPACK_IMPORTED_MODULE_3__["default"](signal.sdp),
      );
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        this.logger.log('Got an offer from ' + signal.from, signal);
        const description = await this.participants[
            signal.from
        ].rtc.createAnswer();

        await this.participants[signal.from].rtc.setLocalDescription(
            description,
        );
        this.channel.publish('system:video_answer', {
          from: this.channel.uuid,
          to: signal.from,
          sdp: this.participants[signal.from].rtc.localDescription,
        });
        resolve();
      } else {
        this.logger.log('Got an asnwer from ' + signal.from);

        resolve();
      }
    });
  }

  handleAnswer(signal) {
    this.participants[signal.from].rtc.setRemoteDescription(
        new _misc_RTCSessionDescription_js__WEBPACK_IMPORTED_MODULE_3__["default"](signal.sdp),
    );
  }

  /**
   * Callback to handle local stream
   * @param {*} stream
   */
  getUserMediaSuccess(stream) {
    this.localStream = stream;

    if (typeof this.identity.onLocalVideo == 'function') {
      this.identity.onLocalVideo(stream, this);
    }

    this.requestPeerVideo();
  }

  requestPeerVideo() {
    let eventName = 'system:portal_broadcaster';

    if (!this.identity.shouldBroadcast) {
      eventName = 'system:portal_watcher';
    }

    this.channel.publish(eventName, {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast,
    });
  }

  requestOfferFromPeer() {
    this.channel.publish('system:video_request', {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast,
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
let iceCandidate = {};
try {
  iceCandidate = RTCIceCandidate;
} catch (e) {}
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
let peerConnection = {};
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
let sessionDescription = {};
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
let socket = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNKbEM7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGLGlFQUFlLE1BQU0sRUFBQzs7Ozs7OztVQ0p0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnVDO0FBQ3ZDLGlFQUFlLHFEQUFTLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQmxvY2tjaGFpbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvSW52YWxpZEF1dGhFeGNlcHRpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL0xvZ2dlci5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvUGllU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Qb3J0YWwuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvRGVmYXVsdE9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvUlRDSWNlQ2FuZGlkYXRlLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL1JUQ1BlZXJDb25uZWN0aW9uLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL1JUQ1Nlc3Npb25EZXNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9XZWJTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiY29uc3QgUGllTWVzc2FnZSA9IHt9O1xuY29uc3QgQkNNRW5kcG9pbnQgPSAnaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9hcGkvYmxvY2tjaGFpbi9wYXlsb2FkSGFzaCc7XG5jb25zdCBQaWVNZXNzYWdlQWRkcmVzc0RldiA9ICcweDIzMjFjMzIxODI4OTQ2MTUzYTg0NWU2OWVlMTY4ZjQxM2U4NWM5MGQnO1xuY29uc3QgUGllTWVzc2FnZUFkZHJlc3NQcm9kID0gJzB4MmE4NDBDQTQwRTA4MkRiRjI0NjEwQjYyYTk3ODkwMEJmQ2FCMjNEMyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsb2NrY2hhaW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuYXBpS2V5ID0gdGhpcy5vcHRpb25zLmFwaUtleTtcbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLm9wdGlvbnMuY2hhbm5lbElkO1xuICAgIHRoaXMuYmxvY2tjaGFpblRlc3RNb2RlID0gdGhpcy5vcHRpb25zLmJsb2NrY2hhaW5UZXN0TW9kZTtcbiAgICB0aGlzLmJsb2NrY2hhaW5HYXNGZWUgPSB0aGlzLm9wdGlvbnMuYmxvY2tjaGFpbkdhc0ZlZTtcblxuICAgIGlmICh0aGlzLmJsb2NrY2hhaW5UZXN0TW9kZSkge1xuICAgICAgdGhpcy5jb250cmFjdEFkZHJlc3MgPSBQaWVNZXNzYWdlQWRkcmVzc0RldjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250cmFjdEFkZHJlc3MgPSBQaWVNZXNzYWdlQWRkcmVzc1Byb2Q7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCB3MyA9IG5ldyBXZWIzKHdpbmRvdy5ldGhlcmV1bSk7XG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBldGhlcmV1bS5yZXF1ZXN0KHttZXRob2Q6ICdldGhfcmVxdWVzdEFjY291bnRzJ30pO1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnRzWzBdO1xuXG4gICAgdGhpcy5jb250cmFjdCA9IG5ldyB3My5ldGguQ29udHJhY3QoUGllTWVzc2FnZS5hYmksIHRoaXMuY29udHJhY3RBZGRyZXNzKTtcbiAgfVxuXG4gIGNoZWNrV2ViMygpIHtcbiAgICBpZiAodHlwZW9mIFdlYjMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdXZWIzLmpzIGlzIG5vdCBpbnN0YWxsZWQhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZXRoZXJldW0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdNZXRhTWFzayBpcyBub3QgaW5zdGFsbGVkIScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgY29uZmlybShoYXNoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLmNoZWNrV2ViMygpKSB7XG4gICAgICAgIGlmICghdGhpcy5jb250cmFjdCkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjZWlwdCA9IHRoaXMuY29udHJhY3QubWV0aG9kcy5jb25maXJtKGhhc2gpLnNlbmQoe2Zyb206IHRoaXMuYWNjb3VudCwgZ2FzOiB0aGlzLmJsb2NrY2hhaW5HYXNGZWV9KTtcbiAgICAgICAgcmVjZWlwdC5vbigndHJhbnNhY3Rpb25IYXNoJywgcmVzb2x2ZSk7XG4gICAgICAgIHJlY2VpcHQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZW5kKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hlY2tXZWIzKCkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyYWN0KSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiYWNtSGFzaCA9IGF3YWl0IHRoaXMuZ2V0VHJhbnNhY3Rpb25IYXNoKG1lc3NhZ2UpO1xuXG4gICAgICAgIGNvbnN0IHJlY2VpcHQgPSB0aGlzLmNvbnRyYWN0Lm1ldGhvZHMuc2VuZChiYWNtSGFzaC5wYXlsb2FkKS5zZW5kKHtmcm9tOiB0aGlzLmFjY291bnQsIGdhczogdGhpcy5ibG9ja2NoYWluR2FzRmVlfSk7XG4gICAgICAgIHJlY2VpcHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIChoYXNoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBoYXNoOiBoYXNoLFxuICAgICAgICAgICAgaWQ6IGJhY21IYXNoLnRyYW5zYWN0aW9uX2lkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVjZWlwdC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViMyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlamVjdCgnUGxlYXNlIGluc3RhbGwgV2ViMy5qcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCgnUGxlYXNlIGluc3RhbGwgTWV0YU1hc2snKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0VHJhbnNhY3Rpb25IYXNoKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICBkYXRhLmFwcGVuZCgnYXBpS2V5JywgdGhpcy5hcGlLZXkpO1xuICAgICAgZGF0YS5hcHBlbmQoJ2NoYW5uZWwnLCB0aGlzLmNoYW5uZWwpO1xuICAgICAgZGF0YS5hcHBlbmQoJ21lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICBkYXRhLmFwcGVuZCgnY29udHJhY3QnLCB0aGlzLmNvbnRyYWN0QWRkcmVzcyk7XG5cbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFBpZVNvY2tldCBFcnJvcjogJHtKU09OLnN0cmluZ2lmeShyZXNwb25zZS5lcnJvcnMpfWApO1xuICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5zdWNjZXNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlamVjdCgnVW5rbm93biBlcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBjb25uZWN0IHRvIEJsb2NrY2hhaW4gTWVzc2FnaW5nIEFQSSwgdHJ5IGxhdGVyJyk7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Jsb2NrY2hhaW4gTWVzc2FnaW5nIEFQSSBzZWVtcyB1bnJlYWNoYWJsZSBhdCB0aGUgbW9tZW50LCB0cnkgbGF0ZXInKTtcbiAgICAgICAgcmVqZWN0KCk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBCQ01FbmRwb2ludCk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyLmpzJztcbmltcG9ydCBCbG9ja2NoYWluIGZyb20gJy4vQmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgU29ja2V0IGZyb20gJy4vbWlzYy9XZWJTb2NrZXQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcbiAgY29uc3RydWN0b3IoZW5kcG9pbnQsIGlkZW50aXR5LCBpbml0PXRydWUpIHtcbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5tZW1iZXJzID0gW107XG4gICAgdGhpcy5wb3J0YWwgPSBudWxsO1xuICAgIHRoaXMudXVpZCA9IG51bGw7XG4gICAgdGhpcy5vblNvY2tldENvbm5lY3RlZCA9ICgpID0+IHt9O1xuICAgIHRoaXMub25Tb2NrZXRFcnJvciA9ICgpID0+IHt9O1xuXG4gICAgaWYgKCFpbml0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pbml0KGVuZHBvaW50LCBpZGVudGl0eSk7XG4gIH1cblxuICBpbml0KGVuZHBvaW50LCBpZGVudGl0eSkge1xuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5jb25uZWN0KCk7XG4gICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoaWRlbnRpdHkpO1xuICB9XG5cbiAgZ2V0TWVtYmVyQnlVVUlEKHV1aWQpIHtcbiAgICBsZXQgbWVtYmVyID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMubWVtYmVyc1tpXS51dWlkID09IHV1aWQpIHtcbiAgICAgICAgbWVtYmVyID0gdGhpcy5tZW1iZXJzW2ldO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lbWJlcjtcbiAgfVxuXG4gIGdldEN1cnJlbnRNZW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWVtYmVyQnlVVUlEKHRoaXMudXVpZCk7XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICBjb25uZWN0aW9uLm9ub3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgY29ubmVjdGlvbi5vbmNsb3NlID0gdGhpcy5vbkNsb3NlLmJpbmQodGhpcyk7XG5cbiAgICBpZiAodGhpcy5pZGVudGl0eS5vblNvY2tldENvbm5lY3RlZCkge1xuICAgICAgdGhpcy5vblNvY2tldENvbm5lY3RlZCA9IHRoaXMuaWRlbnRpdHkub25Tb2NrZXRDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaWRlbnRpdHkub25Tb2NrZXRFcnJvcikge1xuICAgICAgdGhpcy5vblNvY2tldEVycm9yID0gdGhpcy5pZGVudGl0eS5vblNvY2tldEVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBjb25uZWN0aW9uO1xuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgLy8gUmVnaXN0ZXIgbGlmZWN5Y2xlIGNhbGxiYWNrc1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICB9XG5cbiAgbGlzdGVuKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIC8vIFJlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICB0aGlzLmxpc3RlbmVyc1tldmVudF0gPSBjYWxsYmFjaztcbiAgfVxuXG5cbiAgc2VuZChkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKGRhdGEpO1xuICB9XG5cbiAgYXN5bmMgcHVibGlzaChldmVudCwgZGF0YSwgbWV0YSkge1xuICAgIGlmIChtZXRhICYmIG1ldGEuYmxvY2tjaGFpbikge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2VuZE9uQmxvY2tjaGFpbihldmVudCwgZGF0YSwgbWV0YSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgbWV0YTogbWV0YSxcbiAgICB9KSk7XG4gIH1cblxuXG4gIGFzeW5jIHNlbmRPbkJsb2NrY2hhaW4oZXZlbnQsIGRhdGEsIG1ldGEpIHtcbiAgICBpZiAoIXRoaXMuYmxvY2tjaGFpbikge1xuICAgICAgdGhpcy5ibG9ja2NoYWluID0gbmV3IEJsb2NrY2hhaW4odGhpcy5pZGVudGl0eSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpcHQgPSBhd2FpdCB0aGlzLmJsb2NrY2hhaW4uc2VuZChkYXRhKTtcblxuICAgICAgaWYgKHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWhhc2gnXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1oYXNoJ10uYmluZCh0aGlzKSh7XG4gICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgICAgICB0cmFuc2FjdGlvbkhhc2g6IHJlY2VpcHQuaGFzaCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChKU09OLnN0cmluZ2lmeSh7J2V2ZW50JzogZXZlbnQsICdkYXRhJzogZGF0YSwgJ21ldGEnOiB7Li4ubWV0YSwgJ3RyYW5zYWN0aW9uX2lkJzogcmVjZWlwdC5pZCwgJ3RyYW5zYWN0aW9uX2hhc2gnOiByZWNlaXB0Lmhhc2h9fSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10uYmluZCh0aGlzKShlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgY29uZmlybU9uQmxvY2tjaGFpbihldmVudCwgdHJhbnNhY3Rpb25IYXNoKSB7XG4gICAgaWYgKCF0aGlzLmJsb2NrY2hhaW4pIHtcbiAgICAgIHRoaXMuYmxvY2tjaGFpbiA9IG5ldyBCbG9ja2NoYWluKHRoaXMuaWRlbnRpdHkpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBoYXNoID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLmNvbmZpcm0odHJhbnNhY3Rpb25IYXNoKTtcblxuICAgICAgaWYgKHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWhhc2gnXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1oYXNoJ10uYmluZCh0aGlzKSh7XG4gICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIGNvbmZpcm1hdGlvbkhhc2g6IHRyYW5zYWN0aW9uSGFzaCxcbiAgICAgICAgICB0cmFuc2FjdGlvbkhhc2g6IGhhc2gsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoSlNPTi5zdHJpbmdpZnkoeydldmVudCc6IGV2ZW50LCAnZGF0YSc6IHRyYW5zYWN0aW9uSGFzaCwgJ21ldGEnOiB7J3RyYW5zYWN0aW9uX2lkJzogMSwgJ3RyYW5zYWN0aW9uX2hhc2gnOiBoYXNofX0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25NZXNzYWdlKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgaWYgKG1lc3NhZ2UuZXJyb3IgJiYgbWVzc2FnZS5lcnJvci5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyZSBldmVudCBsaXN0ZW5lcnNcbiAgICAgIGlmIChtZXNzYWdlLmV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlTWVtYmVySGFuZHNoYWtlKG1lc3NhZ2UpO1xuXG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1ttZXNzYWdlLmV2ZW50XSkge1xuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW21lc3NhZ2UuZXZlbnRdLmJpbmQodGhpcykobWVzc2FnZS5kYXRhLCBtZXNzYWdlLm1ldGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzWycqJ10pIHtcbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1snKiddLmJpbmQodGhpcykobWVzc2FnZS5ldmVudCwgbWVzc2FnZS5kYXRhLCBtZXNzYWdlLm1ldGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoanNvbkV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS5lcnJvcihqc29uRXhjZXB0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBGaXJlIGxpZmVjeWNsZSBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50c1snbWVzc2FnZSddKSB7XG4gICAgICB0aGlzLmV2ZW50c1snbWVzc2FnZSddLmJpbmQodGhpcykoZSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTWVtYmVySGFuZHNoYWtlKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOm1lbWJlcl9saXN0Jykge1xuICAgICAgdGhpcy5tZW1iZXJzID0gbWVzc2FnZS5kYXRhLm1lbWJlcnM7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06bWVtYmVyX2pvaW5lZCcpIHtcbiAgICAgIHRoaXMubWVtYmVycyA9IG1lc3NhZ2UuZGF0YS5tZW1iZXJzO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOm1lbWJlcl9sZWZ0Jykge1xuICAgICAgdGhpcy5tZW1iZXJzID0gbWVzc2FnZS5kYXRhLm1lbWJlcnM7XG4gICAgICBpZiAodGhpcy5wb3J0YWwpIHtcbiAgICAgICAgdGhpcy5wb3J0YWwucmVtb3ZlUGFydGljaXBhbnQobWVzc2FnZS5kYXRhLm1lbWJlci51dWlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTpwb3J0YWxfYnJvYWRjYXN0ZXInICYmIG1lc3NhZ2UuZGF0YS5mcm9tICE9IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwucmVxdWVzdE9mZmVyRnJvbVBlZXIobWVzc2FnZS5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTpwb3J0YWxfd2F0Y2hlcicgJiYgbWVzc2FnZS5kYXRhLmZyb20gIT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5zaGFyZVZpZGVvKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fcmVxdWVzdCcgJiYgbWVzc2FnZS5kYXRhLmZyb20gIT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5zaGFyZVZpZGVvKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06cG9ydGFsX2NhbmRpZGF0ZScgJiYgbWVzc2FnZS5kYXRhLnRvID09IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuYWRkSWNlQ2FuZGlkYXRlKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fb2ZmZXInICYmIG1lc3NhZ2UuZGF0YS50byA9PSB0aGlzLnV1aWQpIHtcbiAgICAgIHRoaXMucG9ydGFsLmNyZWF0ZUFuc3dlcihtZXNzYWdlLmRhdGEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOnZpZGVvX2Fuc3dlcicgJiYgbWVzc2FnZS5kYXRhLnRvID09IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuaGFuZGxlQW5zd2VyKG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb25PcGVuKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgIC8vIFN5c3RlbSBpbml0IGNhbGxiYWNrXG4gICAgdGhpcy5vblNvY2tldENvbm5lY3RlZChlKTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDaGFubmVsIGVycm9yOicsIGUpO1xuICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuXG4gICAgLy8gU3lzdGVtIGluaXQgZXJyb3IgY2FsbGJhY2tcbiAgICB0aGlzLm9uU29ja2V0RXJyb3IoZSk7XG5cbiAgICAvLyBVc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICBpZiAodGhpcy5ldmVudHNbJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuZXZlbnRzWydlcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShlKSB7XG4gICAgdGhpcy5sb2dnZXIud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcblxuICAgIC8vIFVzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10uYmluZCh0aGlzKShlKTtcbiAgICB9XG4gIH1cblxuICByZWNvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZFJlY29ubmVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5sb2coJ1JlY29ubmVjdGluZycpO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZhbGlkQXV0aEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U9bnVsbCwgbmFtZT0nSW52YWxpZEF1dGhFeGNlcHRpb24nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnQXV0aCBlbmRwb2ludCBkaWQgbm90IHJldHVybiBhIHZhbGlkIEpXVCBUb2tlbiwgcGxlYXNlIHNlZTogaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9kb2NzLzMuMC9hdXRoZW50aWNhdGlvbic7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBsb2coLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm4oLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBlcnJvciguLi5kYXRhKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC5qcyc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyLmpzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9Qb3J0YWwuanMnO1xuaW1wb3J0IEludmFsaWRBdXRoRXhjZXB0aW9uIGZyb20gJy4vSW52YWxpZEF1dGhFeGNlcHRpb24uanMnO1xuaW1wb3J0IGRlZmF1bHRPcHRpb25zIGZyb20gJy4vbWlzYy9EZWZhdWx0T3B0aW9ucy5qcyc7XG5pbXBvcnQge3Y0IGFzIHV1aWR2NH0gZnJvbSAndXVpZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9O1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc3Vic2NyaWJlKGNoYW5uZWxJZCwgcm9vbU9wdGlvbnM9e30pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHJvb21PcHRpb25zLnZpZGVvIHx8IHJvb21PcHRpb25zLmF1ZGlvIHx8IHJvb21PcHRpb25zLnBvcnRhbCkge1xuICAgICAgICAvLyBGb3JjZSBjb25maWcgd2hlbiB2aWRlbyBpcyByZXF1aXJlZFxuICAgICAgICB0aGlzLm9wdGlvbnMubm90aWZ5U2VsZiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHV1aWQgPSB1dWlkdjQoKTtcbiAgICAgIGNvbnN0IGVuZHBvaW50ID0gYXdhaXQgdGhpcy5nZXRFbmRwb2ludChjaGFubmVsSWQsIHV1aWQpO1xuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnUmV0dXJuaW5nIGV4aXN0aW5nIGNoYW5uZWwnLCBjaGFubmVsSWQpO1xuICAgICAgICByZXNvbHZlKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NyZWF0aW5nIG5ldyBjaGFubmVsJywgY2hhbm5lbElkKTtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IG5ldyBDaGFubmVsKGVuZHBvaW50LCB7XG4gICAgICAgICAgY2hhbm5lbElkOiBjaGFubmVsSWQsXG4gICAgICAgICAgb25Tb2NrZXRDb25uZWN0ZWQ6ICgpID0+IHtcbiAgICAgICAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgICBpZiAocm9vbU9wdGlvbnMudmlkZW8gfHwgcm9vbU9wdGlvbnMuYXVkaW8gfHwgcm9vbU9wdGlvbnMucG9ydGFsKSB7XG4gICAgICAgICAgICAgIGNoYW5uZWwucG9ydGFsID0gbmV3IFBvcnRhbChjaGFubmVsLCB7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIC4uLnJvb21PcHRpb25zLFxuICAgICAgICAgICAgICB9KTsgYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICAgICAgcmVzb2x2ZShjaGFubmVsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uU29ja2V0RXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCgnRmFpbGVkIHRvIG1ha2Ugd2Vic29ja2V0IGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBXZWJTb2NrZXQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlcyB0aGUgcHJvbWlzZSBpbiBjYXNlIFdlYlNvY2tldCBpcyBub3QgZGVmaW5lZFxuICAgICAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgICByZXNvbHZlKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENvbm5lY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXV0aFRva2VuKGNoYW5uZWwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGRhdGEuYXBwZW5kKCdjaGFubmVsX25hbWUnLCBjaGFubmVsKTtcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBJbnZhbGlkQXV0aEV4Y2VwdGlvbignQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW4nLCAnQXV0aEVuZHBvaW50UmVzcG9uc2VFcnJvcicpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCk9PntcbiAgICAgICAgcmVqZWN0KG5ldyBJbnZhbGlkQXV0aEV4Y2VwdGlvbignQ291bGQgbm90IGZldGNoIGF1dGggdG9rZW4nLCAnQXV0aEVuZHBvaW50RXJyb3InKSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGlzLm9wdGlvbnMuYXV0aEVuZHBvaW50KTtcblxuICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5hdXRoSGVhZGVycyk7XG4gICAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRoaXMub3B0aW9ucy5hdXRoSGVhZGVyc1toZWFkZXJdKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzR3VhcmRlZChjaGFubmVsKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5mb3JjZUF1dGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoJycrY2hhbm5lbCkuc3RhcnRzV2l0aCgncHJpdmF0ZS0nKTtcbiAgfVxuXG4gIGFzeW5jIGdldEVuZHBvaW50KGNoYW5uZWxJZCwgdXVpZCkge1xuICAgIGNvbnN0IGNsdXN0ZXJEb21haW4gPSB0aGlzLm9wdGlvbnMuY2x1c3RlckRvbWFpbiA9PSBudWxsID8gYCR7dGhpcy5vcHRpb25zLmNsdXN0ZXJJZH0ucGllc29ja2V0LmNvbWA6dGhpcy5vcHRpb25zLmNsdXN0ZXJEb21haW47XG4gICAgbGV0IGVuZHBvaW50ID0gYHdzczovLyR7Y2x1c3RlckRvbWFpbn0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259LyR7Y2hhbm5lbElkfT9hcGlfa2V5PSR7dGhpcy5vcHRpb25zLmFwaUtleX0mbm90aWZ5X3NlbGY9JHt0aGlzLm9wdGlvbnMubm90aWZ5U2VsZn0mc291cmNlPWpzc2RrJnY9NS4wLjgmcHJlc2VuY2U9JHt0aGlzLm9wdGlvbnMucHJlc2VuY2V9YDtcblxuICAgIC8vIFNldCBhdXRoXG4gICAgaWYgKHRoaXMub3B0aW9ucy5qd3QpIHtcbiAgICAgIGVuZHBvaW50ID0gZW5kcG9pbnQrJyZqd3Q9Jyt0aGlzLm9wdGlvbnMuand0O1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0d1YXJkZWQoY2hhbm5lbElkKSkge1xuICAgICAgY29uc3QgYXV0aCA9IGF3YWl0IHRoaXMuZ2V0QXV0aFRva2VuKGNoYW5uZWxJZCk7XG4gICAgICBpZiAoYXV0aC5hdXRoKSB7XG4gICAgICAgIGVuZHBvaW50ID0gZW5kcG9pbnQgKyAnJmp3dD0nK2F1dGguYXV0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdXNlciBpZGVudGl0eVxuICAgIGlmICh0aGlzLm9wdGlvbnMudXNlcklkKSB7XG4gICAgICBlbmRwb2ludCA9IGVuZHBvaW50ICsgJyZ1c2VyPScrdGhpcy5vcHRpb25zLnVzZXJJZDtcbiAgICB9XG5cbiAgICAvLyBBZGQgdXVpZFxuICAgIGVuZHBvaW50ID0gZW5kcG9pbnQrJyZ1dWlkPScrdXVpZDtcblxuICAgIHJldHVybiBlbmRwb2ludDtcbiAgfVxufVxuIiwiaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgSWNlQ2FuZGlkYXRlIGZyb20gJy4vbWlzYy9SVENJY2VDYW5kaWRhdGUuanMnO1xuaW1wb3J0IFBlZXJDb25uZWN0aW9uIGZyb20gJy4vbWlzYy9SVENQZWVyQ29ubmVjdGlvbi5qcyc7XG5pbXBvcnQgU2Vzc2lvbkRlc2NyaXB0aW9uIGZyb20gJy4vbWlzYy9SVENTZXNzaW9uRGVzY3JpcHRpb24uanMnO1xuY29uc3QgZGVmYXVsdFBvcnRhbE9wdGlvbnMgPSB7XG4gIHNob3VsZEJyb2FkY2FzdDogdHJ1ZSxcbiAgcG9ydGFsOiB0cnVlLFxuICB2aWRlbzogZmFsc2UsXG4gIGF1ZGlvOiB0cnVlLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB2aWRlbyByb29tIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7Kn0gY2hhbm5lbFxuICAgKiBAcGFyYW0geyp9IGlkZW50aXR5XG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9IFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgdGhlIFBvcnRhbFxuICAgKi9cbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgaWRlbnRpdHkpIHtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgdGhpcy5pZGVudGl0eSA9IHsuLi5kZWZhdWx0UG9ydGFsT3B0aW9ucywgLi4uaWRlbnRpdHl9O1xuICAgIHRoaXMubG9jYWxTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMuZGlzcGxheVN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5wZWVyQ29ubmVjdGlvbkNvbmZpZyA9IHtcbiAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAge3VybHM6ICdzdHVuOnN0dW4uc3R1bnByb3RvY29sLm9yZzozNDc4J30sXG4gICAgICAgIHt1cmxzOiAnc3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMid9LFxuICAgICAgXSxcbiAgICB9O1xuICAgIHRoaXMuY29uc3RyYWludHMgPSB7XG4gICAgICB2aWRlbzogaWRlbnRpdHkudmlkZW8sXG4gICAgICBhdWRpbzogaWRlbnRpdHkuYXVkaW8sXG4gICAgfTtcblxuICAgIHRoaXMucGFydGljaXBhbnRzID0gW107XG4gICAgdGhpcy5pc05lZ290aWF0aW5nID0gW107XG5cbiAgICB0aGlzLmxvZ2dlci5sb2coJ0luaXRpYWxpemluZyB2aWRlbyByb29tJyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBsb2NhbCB2aWRlb1xuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuY29uc3RyYWludHMudmlkZW8gJiYgIXRoaXMuY29uc3RyYWludHMuYXVkaW8pIHtcbiAgICAgIHRoaXMucmVxdWVzdFBlZXJWaWRlbygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhXG4gICAgKSB7XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAgICAgLmdldFVzZXJNZWRpYSh0aGlzLmNvbnN0cmFpbnRzKVxuICAgICAgICAgIC50aGVuKHRoaXMuZ2V0VXNlck1lZGlhU3VjY2Vzcy5iaW5kKHRoaXMpKVxuICAgICAgICAgIC5jYXRjaCh0aGlzLmVycm9ySGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgZ2V0VXNlck1lZGlhIEFQSScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHNoYXJlVmlkZW8oc2lnbmFsLCBpc0NhbGxlciA9IHRydWUpIHtcbiAgICBpZiAoIXRoaXMuaWRlbnRpdHkuc2hvdWxkQnJvYWRjYXN0ICYmIGlzQ2FsbGVyICYmICFzaWduYWwuaXNCcm9hZGNhc3RpbmcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSZWZ1c2luZyB0byBjYWxsLCBkZW5pZWQgYnJvYWRjYXN0IHJlcXVlc3QnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygncGVlciBjb25uZWN0aW9uJywgUGVlckNvbm5lY3Rpb24pO1xuICAgIGNvbnN0IHJ0Y0Nvbm5lY3Rpb24gPSBuZXcgUGVlckNvbm5lY3Rpb24odGhpcy5wZWVyQ29ubmVjdGlvbkNvbmZpZyk7XG5cbiAgICBydGNDb25uZWN0aW9uLm9uaWNlY2FuZGlkYXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY2FuZGlkYXRlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTpwb3J0YWxfY2FuZGlkYXRlJywge1xuICAgICAgICAgIGZyb206IHRoaXMuY2hhbm5lbC51dWlkLFxuICAgICAgICAgIHRvOiBzaWduYWwuZnJvbSxcbiAgICAgICAgICBpY2U6IGV2ZW50LmNhbmRpZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub250cmFjayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRyYWNrLmtpbmQgIT0gJ3ZpZGVvJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5zdHJlYW1zID0gZXZlbnQuc3RyZWFtcztcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkKHNpZ25hbC5mcm9tLCBldmVudC5zdHJlYW1zWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gKGUpID0+IHtcbiAgICAgIC8vIFdvcmthcm91bmQgZm9yIENocm9tZTogc2tpcCBuZXN0ZWQgbmVnb3RpYXRpb25zXG4gICAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID1cbiAgICAgICAgcnRjQ29ubmVjdGlvbi5zaWduYWxpbmdTdGF0ZSAhPSAnc3RhYmxlJztcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMubG9jYWxTdHJlYW0pIHtcbiAgICAgIHRoaXMubG9jYWxTdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgcnRjQ29ubmVjdGlvbi5hZGRUcmFjayh0cmFjaywgdGhpcy5sb2NhbFN0cmVhbSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kaXNwbGF5U3RyZWFtKSB7XG4gICAgICB0aGlzLmRpc3BsYXlTdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgcnRjQ29ubmVjdGlvbi5hZGRUcmFjayh0cmFjaywgdGhpcy5kaXNwbGF5U3RyZWFtKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0gPSBmYWxzZTtcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZFZpZGVvT2ZmZXIoc2lnbmFsLCBydGNDb25uZWN0aW9uLCBpc0NhbGxlcik7XG4gICAgfTtcblxuICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXSA9IHtcbiAgICAgIHJ0YzogcnRjQ29ubmVjdGlvbixcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgb25Mb2NhbFNjcmVlbihzY3JlZW5TdHJlYW0pIHtcbiAgICB0aGlzLmRpc3BsYXlTdHJlYW0gPSBzY3JlZW5TdHJlYW07XG4gICAgY29uc3QgcGFydGljaXBhbnRzID0gdGhpcy5wYXJ0aWNpcGFudHM7XG5cbiAgICBjb25zdCBwYXJ0aWNpcGFudHNJZHMgPSBPYmplY3Qua2V5cyhwYXJ0aWNpcGFudHMpO1xuICAgIHBhcnRpY2lwYW50c0lkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgY29uc3QgcnRjID0gcGFydGljaXBhbnRzW2lkXS5ydGM7XG4gICAgICBzY3JlZW5TdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgcnRjLmFkZFRyYWNrKHRyYWNrLCBzY3JlZW5TdHJlYW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzaGFyZVNjcmVlbigpIHtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAgIC5nZXREaXNwbGF5TWVkaWEoKVxuICAgICAgICAudGhlbih0aGlzLm9uTG9jYWxTY3JlZW4uYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKHRoaXMuZXJyb3JIYW5kbGVyLmJpbmQodGhpcykpO1xuICB9XG5cbiAgYXN5bmMgc2VuZFZpZGVvT2ZmZXIoc2lnbmFsLCBydGNDb25uZWN0aW9uLCBpc0NhbGxlcikge1xuICAgIC8vIGlmICghaXNDYWxsZXIpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwiU2tpcHBlZCwgbm90IHRoZSBjYWxsZXJcIik7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfVxuXG4gICAgaWYgKHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0pIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTS0lQIG5lc3RlZCBuZWdvdGlhdGlvbnMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID0gdHJ1ZTtcblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gYXdhaXQgcnRjQ29ubmVjdGlvbi5jcmVhdGVPZmZlcigpO1xuICAgIGF3YWl0IHJ0Y0Nvbm5lY3Rpb24uc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjcmlwdGlvbik7XG5cbiAgICBjb25zb2xlLmxvZygnTWFraW5nIG9mZmVyJyk7XG4gICAgLy8gU2VuZCBhIGNhbGwgb2ZmZXJcbiAgICB0aGlzLmNoYW5uZWwucHVibGlzaCgnc3lzdGVtOnZpZGVvX29mZmVyJywge1xuICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICB0bzogc2lnbmFsLmZyb20sXG4gICAgICBzZHA6IHJ0Y0Nvbm5lY3Rpb24ubG9jYWxEZXNjcmlwdGlvbixcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVBhcnRpY2lwYW50KHV1aWQpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWNpcGFudHNbdXVpZF07XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpdHkub25QYXJ0aWNpcGFudExlZnQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50TGVmdCh1dWlkKTtcbiAgICB9XG4gIH1cblxuICBhZGRJY2VDYW5kaWRhdGUoc2lnbmFsKSB7XG4gICAgY29uc3QgcnRjQ29ubmVjdGlvbiA9IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGM7XG4gICAgcnRjQ29ubmVjdGlvbi5hZGRJY2VDYW5kaWRhdGUobmV3IEljZUNhbmRpZGF0ZShzaWduYWwuaWNlKSk7XG4gIH1cblxuICBjcmVhdGVBbnN3ZXIoc2lnbmFsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXSB8fFxuICAgICAgICAhdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Y1xuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBjYWxsIGluIGNyZWF0ZUFuc3dlcicpO1xuICAgICAgICB0aGlzLnNoYXJlVmlkZW8oc2lnbmFsLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oXG4gICAgICAgICAgbmV3IFNlc3Npb25EZXNjcmlwdGlvbihzaWduYWwuc2RwKSxcbiAgICAgICk7XG4gICAgICAvLyBPbmx5IGNyZWF0ZSBhbnN3ZXJzIGluIHJlc3BvbnNlIHRvIG9mZmVyc1xuICAgICAgaWYgKHNpZ25hbC5zZHAudHlwZSA9PSAnb2ZmZXInKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnR290IGFuIG9mZmVyIGZyb20gJyArIHNpZ25hbC5mcm9tLCBzaWduYWwpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMucGFydGljaXBhbnRzW1xuICAgICAgICAgICAgc2lnbmFsLmZyb21cbiAgICAgICAgXS5ydGMuY3JlYXRlQW5zd2VyKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5zZXRMb2NhbERlc2NyaXB0aW9uKFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKCdzeXN0ZW06dmlkZW9fYW5zd2VyJywge1xuICAgICAgICAgIGZyb206IHRoaXMuY2hhbm5lbC51dWlkLFxuICAgICAgICAgIHRvOiBzaWduYWwuZnJvbSxcbiAgICAgICAgICBzZHA6IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMubG9jYWxEZXNjcmlwdGlvbixcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnR290IGFuIGFzbndlciBmcm9tICcgKyBzaWduYWwuZnJvbSk7XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQW5zd2VyKHNpZ25hbCkge1xuICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oXG4gICAgICAgIG5ldyBTZXNzaW9uRGVzY3JpcHRpb24oc2lnbmFsLnNkcCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBoYW5kbGUgbG9jYWwgc3RyZWFtXG4gICAqIEBwYXJhbSB7Kn0gc3RyZWFtXG4gICAqL1xuICBnZXRVc2VyTWVkaWFTdWNjZXNzKHN0cmVhbSkge1xuICAgIHRoaXMubG9jYWxTdHJlYW0gPSBzdHJlYW07XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpdHkub25Mb2NhbFZpZGVvID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaWRlbnRpdHkub25Mb2NhbFZpZGVvKHN0cmVhbSwgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0UGVlclZpZGVvKCk7XG4gIH1cblxuICByZXF1ZXN0UGVlclZpZGVvKCkge1xuICAgIGxldCBldmVudE5hbWUgPSAnc3lzdGVtOnBvcnRhbF9icm9hZGNhc3Rlcic7XG5cbiAgICBpZiAoIXRoaXMuaWRlbnRpdHkuc2hvdWxkQnJvYWRjYXN0KSB7XG4gICAgICBldmVudE5hbWUgPSAnc3lzdGVtOnBvcnRhbF93YXRjaGVyJztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwucHVibGlzaChldmVudE5hbWUsIHtcbiAgICAgIGZyb206IHRoaXMuY2hhbm5lbC51dWlkLFxuICAgICAgaXNCcm9hZGNhc3Rpbmc6IHRoaXMuaWRlbnRpdHkuc2hvdWxkQnJvYWRjYXN0LFxuICAgIH0pO1xuICB9XG5cbiAgcmVxdWVzdE9mZmVyRnJvbVBlZXIoKSB7XG4gICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTp2aWRlb19yZXF1ZXN0Jywge1xuICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICBpc0Jyb2FkY2FzdGluZzogdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3QsXG4gICAgfSk7XG4gIH1cblxuICBlcnJvckhhbmRsZXIoZSkge1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKCdQb3J0YWwgZXJyb3InLCBlKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICB2ZXJzaW9uOiAzLFxuICBjbHVzdGVySWQ6ICdkZW1vJyxcbiAgY2x1c3RlckRvbWFpbjogbnVsbCxcbiAgYXBpS2V5OiAnb0NkQ01jTVBRcGJ2TmpVSXpxdHZGMWQyWDJva1dwRFFqNEF3QVJKdUFndGpoekt4VkVqUVU2SWRDandtJyxcbiAgY29uc29sZUxvZ3M6IGZhbHNlLFxuICBub3RpZnlTZWxmOiAwLFxuICBqd3Q6IG51bGwsXG4gIHByZXNlbmNlOiAwLFxuICBhdXRoRW5kcG9pbnQ6ICcvYnJvYWRjYXN0aW5nL2F1dGgnLFxuICBhdXRoSGVhZGVyczoge30sXG4gIGZvcmNlQXV0aDogZmFsc2UsXG4gIHVzZXJJZDogbnVsbCxcbiAgYmxvY2tjaGFpblRlc3RNb2RlOiBmYWxzZSxcbiAgYmxvY2tjaGFpbkdhc0ZlZTogNDEwMDAsXG59O1xuIiwibGV0IGljZUNhbmRpZGF0ZSA9IHt9O1xudHJ5IHtcbiAgaWNlQ2FuZGlkYXRlID0gUlRDSWNlQ2FuZGlkYXRlO1xufSBjYXRjaCAoZSkge31cbmV4cG9ydCBkZWZhdWx0IGljZUNhbmRpZGF0ZTtcbiIsImxldCBwZWVyQ29ubmVjdGlvbiA9IHt9O1xudHJ5IHtcbiAgcGVlckNvbm5lY3Rpb24gPSBSVENQZWVyQ29ubmVjdGlvbjtcbn0gY2F0Y2ggKGUpIHt9XG5leHBvcnQgZGVmYXVsdCBwZWVyQ29ubmVjdGlvbjtcbiIsImxldCBzZXNzaW9uRGVzY3JpcHRpb24gPSB7fTtcbnRyeSB7XG4gIHNlc3Npb25EZXNjcmlwdGlvbiA9IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbjtcbn0gY2F0Y2ggKGUpIHt9XG5leHBvcnQgZGVmYXVsdCBzZXNzaW9uRGVzY3JpcHRpb247XG4iLCJsZXQgc29ja2V0ID0ge307XG50cnkge1xuICBzb2NrZXQgPSBXZWJTb2NrZXQ7XG59IGNhdGNoIChlKSB7fVxuZXhwb3J0IGRlZmF1bHQgc29ja2V0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgUGllU29ja2V0IGZyb20gJy4vUGllU29ja2V0LmpzJztcbmV4cG9ydCBkZWZhdWx0IFBpZVNvY2tldDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==