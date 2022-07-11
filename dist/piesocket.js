var PieSocket;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Blockchain)
/* harmony export */ });
/* harmony import */ var _PieMessage_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PieMessage.json */ "./src/PieMessage.json");

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

    this.contract = new w3.eth.Contract(_PieMessage_json__WEBPACK_IMPORTED_MODULE_0__.abi, this.contractAddress);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Channel)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _Blockchain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Blockchain */ "./src/Blockchain.js");
/* harmony import */ var _misc_WebSocket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc/WebSocket */ "./src/misc/WebSocket.js");




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
    const connection = new _misc_WebSocket__WEBPACK_IMPORTED_MODULE_2__["default"](this.endpoint);
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
      this.blockchain = new _Blockchain__WEBPACK_IMPORTED_MODULE_1__["default"](this.identity);
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
      this.blockchain = new _Blockchain__WEBPACK_IMPORTED_MODULE_1__["default"](this.identity);
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
    } else if (message.event == 'system:video_request' && message.data.from != this.uuid) {
      this.portal.shareVideo(message.data);
    } else if (message.event == 'system:video_accept' && message.data.to == this.uuid) {
      this.portal.addIceCandidate(message.data);
    } else if (message.event == 'system:video_offer' && message.data.to == this.uuid) {
      this.portal.createAnswer(message.data);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony import */ var _Portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Portal */ "./src/Portal.js");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../package.json */ "./package.json");
/* harmony import */ var _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InvalidAuthException.js */ "./src/InvalidAuthException.js");
/* harmony import */ var _misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc/DefaultOptions.js */ "./src/misc/DefaultOptions.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");








class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {..._misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_5__["default"], ...options};
    this.connections = {};
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.options);
  }

  async subscribe(channelId, roomOptions={}) {
    return new Promise(async (resolve, reject) => {
      if (roomOptions.video || roomOptions.audio || roomOptions.portal) {
        // Force config when video is required
        this.options.notifySelf = true;
      }

      const uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_6__["default"])();
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
              channel.portal = new _Portal__WEBPACK_IMPORTED_MODULE_2__["default"](channel, {
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
            reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_4__["default"]('Could not fetch auth token', 'AuthEndpointResponseError'));
          }
        }
      });
      xhr.addEventListener('error', ()=>{
        reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_4__["default"]('Could not fetch auth token', 'AuthEndpointError'));
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
    let endpoint = `wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${_package_json__WEBPACK_IMPORTED_MODULE_3__.version}&presence=${this.options.presence}`;

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Portal)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _misc_RTCIceCandidate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/RTCIceCandidate */ "./src/misc/RTCIceCandidate.js");
/* harmony import */ var _misc_RTCPeerConnection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc/RTCPeerConnection */ "./src/misc/RTCPeerConnection.js");
/* harmony import */ var _misc_RTCSessionDescription__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./misc/RTCSessionDescription */ "./src/misc/RTCSessionDescription.js");




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

    const rtcConnection = new _misc_RTCPeerConnection__WEBPACK_IMPORTED_MODULE_2__["default"](this.peerConnectionConfig);

    rtcConnection.onicecandidate = (event) => {
      if (event.candidate != null) {
        this.channel.publish('system:video_accept', {
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
        rtcConnection.addTrack(track, this.localStream);
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
    rtcConnection.addIceCandidate(new _misc_RTCIceCandidate__WEBPACK_IMPORTED_MODULE_1__["default"](signal.ice));
  }

  createAnswer(signal) {
    return new Promise(async (resolve, reject) => {
      if (!this.participants[signal.from] || !this.participants[signal.from].rtc) {
        console.log('Starting call in createAnswer');
        this.shareVideo(signal, false);
      }

      await this.participants[signal.from].rtc.setRemoteDescription(new _misc_RTCSessionDescription__WEBPACK_IMPORTED_MODULE_3__["default"](signal.sdp));
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        this.logger.log('Got an offer from ' + signal.from, signal);
        const description = await this.participants[signal.from].rtc.createAnswer();

        await this.participants[signal.from].rtc.setLocalDescription(description);
        this.channel.publish('system:video_offer', {
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
    this.channel.publish('system:video_request', {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast
    });
  }

  errorHandler(e) {
    this.logger.error('Portal error', e);
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

/***/ "./src/misc/DefaultOptions.js":
/*!************************************!*\
  !*** ./src/misc/DefaultOptions.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  version: 3,
  clusterId: 'demo',
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RTCIceCandidate);


/***/ }),

/***/ "./src/misc/RTCPeerConnection.js":
/*!***************************************!*\
  !*** ./src/misc/RTCPeerConnection.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RTCPeerConnection);


/***/ }),

/***/ "./src/misc/RTCSessionDescription.js":
/*!*******************************************!*\
  !*** ./src/misc/RTCSessionDescription.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RTCSessionDescription);


/***/ }),

/***/ "./src/misc/WebSocket.js":
/*!*******************************!*\
  !*** ./src/misc/WebSocket.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebSocket);


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"piesocket-js","version":"3.0.3","description":"PieSocket Javascript Client","main":"src/index.js","unpkg":"dist/piesocket.js","scripts":{"test":"jest","coverage":"jest --coverage","lint":"eslint src --fix","start":"NODE_ENV=development webpack serve --mode=development --config webpack.dev.js ","build":"webpack --mode=production --config webpack.prod.js","prepare":"npm run build","watch":"webpack --mode=development --config webpack.dev.js --watch"},"repository":{"type":"git","url":"git+https://github.com/piesocket/piesocket-js.git"},"keywords":["piesocket","client","websocket","pubsub","http"],"author":"PieSocket","license":"MIT","bugs":{"url":"https://github.com/piesocket/piesocket-js/issues"},"homepage":"https://github.com/piesocket/piesocket-js#readme","devDependencies":{"@babel/cli":"^7.16.8","@babel/core":"^7.16.7","@babel/polyfill":"^7.12.1","@babel/preset-env":"^7.16.8","@babel/register":"^7.16.9","@webpack-cli/serve":"^1.1.0","babel-jest":"^27.4.6","cypress":"^9.3.1","eslint":"^8.6.0","eslint-config-google":"^0.14.0","jest":"^27.4.7","puppeteer":"^13.1.2","webpack":"^5.9.0","webpack-cli":"^4.2.0","webpack-dev-server":"^4.7.3","webpack-merge":"^5.4.0"},"dependencies":{"uuid":"^8.3.2"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxlQUFlLEdBQUc7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFNQSx3RkFBK0M7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBL0MsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDZEYsaUVBQWUsZUFBZSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDQS9CLGlFQUFlLGlCQUFpQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDQWpDLGlFQUFlLHFCQUFxQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDQXJDLGlFQUFlLFNBQVMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNBekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQmxvY2tjaGFpbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvSW52YWxpZEF1dGhFeGNlcHRpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL0xvZ2dlci5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvUGllU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Qb3J0YWwuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL0RlZmF1bHRPcHRpb25zLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL1JUQ0ljZUNhbmRpZGF0ZS5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9SVENQZWVyQ29ubmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9SVENTZXNzaW9uRGVzY3JpcHRpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvV2ViU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG52YXIgZ2V0UmFuZG9tVmFsdWVzO1xudmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uIEFsc28sXG4gICAgLy8gZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIChtc0NyeXB0bykgb24gSUUxMS5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pIHx8IHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byk7XG5cbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCkgbm90IHN1cHBvcnRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCNnZXRyYW5kb212YWx1ZXMtbm90LXN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG52YXIgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIpIHtcbiAgdmFyIG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHZhciB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsImltcG9ydCBQaWVNZXNzYWdlIGZyb20gJy4vUGllTWVzc2FnZS5qc29uJztcbmNvbnN0IEJDTUVuZHBvaW50ID0gJ2h0dHBzOi8vd3d3LnBpZXNvY2tldC5jb20vYXBpL2Jsb2NrY2hhaW4vcGF5bG9hZEhhc2gnO1xuY29uc3QgUGllTWVzc2FnZUFkZHJlc3NEZXYgPSAnMHgyMzIxYzMyMTgyODk0NjE1M2E4NDVlNjllZTE2OGY0MTNlODVjOTBkJztcbmNvbnN0IFBpZU1lc3NhZ2VBZGRyZXNzUHJvZCA9ICcweDJhODQwQ0E0MEUwODJEYkYyNDYxMEI2MmE5Nzg5MDBCZkNhQjIzRDMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9ja2NoYWluIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmFwaUtleSA9IHRoaXMub3B0aW9ucy5hcGlLZXk7XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5vcHRpb25zLmNoYW5uZWxJZDtcbiAgICB0aGlzLmJsb2NrY2hhaW5UZXN0TW9kZSA9IHRoaXMub3B0aW9ucy5ibG9ja2NoYWluVGVzdE1vZGU7XG4gICAgdGhpcy5ibG9ja2NoYWluR2FzRmVlID0gdGhpcy5vcHRpb25zLmJsb2NrY2hhaW5HYXNGZWU7XG5cbiAgICBpZiAodGhpcy5ibG9ja2NoYWluVGVzdE1vZGUpIHtcbiAgICAgIHRoaXMuY29udHJhY3RBZGRyZXNzID0gUGllTWVzc2FnZUFkZHJlc3NEZXY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udHJhY3RBZGRyZXNzID0gUGllTWVzc2FnZUFkZHJlc3NQcm9kO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgY29uc3QgdzMgPSBuZXcgV2ViMyh3aW5kb3cuZXRoZXJldW0pO1xuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgZXRoZXJldW0ucmVxdWVzdCh7bWV0aG9kOiAnZXRoX3JlcXVlc3RBY2NvdW50cyd9KTtcbiAgICB0aGlzLmFjY291bnQgPSBhY2NvdW50c1swXTtcblxuICAgIHRoaXMuY29udHJhY3QgPSBuZXcgdzMuZXRoLkNvbnRyYWN0KFBpZU1lc3NhZ2UuYWJpLCB0aGlzLmNvbnRyYWN0QWRkcmVzcyk7XG4gIH1cblxuICBjaGVja1dlYjMoKSB7XG4gICAgaWYgKHR5cGVvZiBXZWIzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmxvZygnV2ViMy5qcyBpcyBub3QgaW5zdGFsbGVkIScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygd2luZG93LmV0aGVyZXVtID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmxvZygnTWV0YU1hc2sgaXMgbm90IGluc3RhbGxlZCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIGNvbmZpcm0oaGFzaCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5jaGVja1dlYjMoKSkge1xuICAgICAgICBpZiAoIXRoaXMuY29udHJhY3QpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY2VpcHQgPSB0aGlzLmNvbnRyYWN0Lm1ldGhvZHMuY29uZmlybShoYXNoKS5zZW5kKHtmcm9tOiB0aGlzLmFjY291bnQsIGdhczogdGhpcy5ibG9ja2NoYWluR2FzRmVlfSk7XG4gICAgICAgIHJlY2VpcHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIHJlc29sdmUpO1xuICAgICAgICByZWNlaXB0Lm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2VuZChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLmNoZWNrV2ViMygpKSB7XG4gICAgICAgIGlmICghdGhpcy5jb250cmFjdCkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFjbUhhc2ggPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uSGFzaChtZXNzYWdlKTtcblxuICAgICAgICBjb25zdCByZWNlaXB0ID0gdGhpcy5jb250cmFjdC5tZXRob2RzLnNlbmQoYmFjbUhhc2gucGF5bG9hZCkuc2VuZCh7ZnJvbTogdGhpcy5hY2NvdW50LCBnYXM6IHRoaXMuYmxvY2tjaGFpbkdhc0ZlZX0pO1xuICAgICAgICByZWNlaXB0Lm9uKCd0cmFuc2FjdGlvbkhhc2gnLCAoaGFzaCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgaGFzaDogaGFzaCxcbiAgICAgICAgICAgIGlkOiBiYWNtSGFzaC50cmFuc2FjdGlvbl9pZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlY2VpcHQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFdlYjMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWplY3QoJ1BsZWFzZSBpbnN0YWxsIFdlYjMuanMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ1BsZWFzZSBpbnN0YWxsIE1ldGFNYXNrJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFRyYW5zYWN0aW9uSGFzaChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgZGF0YS5hcHBlbmQoJ2FwaUtleScsIHRoaXMuYXBpS2V5KTtcbiAgICAgIGRhdGEuYXBwZW5kKCdjaGFubmVsJywgdGhpcy5jaGFubmVsKTtcbiAgICAgIGRhdGEuYXBwZW5kKCdtZXNzYWdlJywgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgZGF0YS5hcHBlbmQoJ2NvbnRyYWN0JywgdGhpcy5jb250cmFjdEFkZHJlc3MpO1xuXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBQaWVTb2NrZXQgRXJyb3I6ICR7SlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZXJyb3JzKX1gKTtcbiAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2Uuc3VjY2Vzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoJ1Vua25vd24gZXJyb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgY29ubmVjdCB0byBCbG9ja2NoYWluIE1lc3NhZ2luZyBBUEksIHRyeSBsYXRlcicpO1xuICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdCbG9ja2NoYWluIE1lc3NhZ2luZyBBUEkgc2VlbXMgdW5yZWFjaGFibGUgYXQgdGhlIG1vbWVudCwgdHJ5IGxhdGVyJyk7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5vcGVuKCdQT1NUJywgQkNNRW5kcG9pbnQpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgQmxvY2tjaGFpbiBmcm9tICcuL0Jsb2NrY2hhaW4nO1xuaW1wb3J0IFNvY2tldCBmcm9tICcuL21pc2MvV2ViU29ja2V0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBpZGVudGl0eSwgaW5pdD10cnVlKSB7XG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMubWVtYmVycyA9IFtdO1xuICAgIHRoaXMucG9ydGFsID0gbnVsbDtcbiAgICB0aGlzLnV1aWQgPSBudWxsO1xuICAgIHRoaXMub25Tb2NrZXRDb25uZWN0ZWQgPSAoKSA9PiB7fTtcbiAgICB0aGlzLm9uU29ja2V0RXJyb3IgPSAoKSA9PiB7fTtcblxuICAgIGlmICghaW5pdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdChlbmRwb2ludCwgaWRlbnRpdHkpO1xuICB9XG5cbiAgaW5pdChlbmRwb2ludCwgaWRlbnRpdHkpIHtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5pZGVudGl0eSA9IGlkZW50aXR5O1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGlkZW50aXR5KTtcbiAgfVxuXG4gIGdldE1lbWJlckJ5VVVJRCh1dWlkKSB7XG4gICAgbGV0IG1lbWJlciA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lbWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLm1lbWJlcnNbaV0udXVpZCA9PSB1dWlkKSB7XG4gICAgICAgIG1lbWJlciA9IHRoaXMubWVtYmVyc1tpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZW1iZXI7XG4gIH1cblxuICBnZXRDdXJyZW50TWVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1lbWJlckJ5VVVJRCh0aGlzLnV1aWQpO1xuICB9XG5cbiAgY29ubmVjdCgpIHtcbiAgICBjb25zdCBjb25uZWN0aW9uID0gbmV3IFNvY2tldCh0aGlzLmVuZHBvaW50KTtcbiAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgY29ubmVjdGlvbi5vbm9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIGNvbm5lY3Rpb24ub25lcnJvciA9IHRoaXMub25FcnJvci5iaW5kKHRoaXMpO1xuICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuaWRlbnRpdHkub25Tb2NrZXRDb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMub25Tb2NrZXRDb25uZWN0ZWQgPSB0aGlzLmlkZW50aXR5Lm9uU29ja2V0Q29ubmVjdGVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlkZW50aXR5Lm9uU29ja2V0RXJyb3IpIHtcbiAgICAgIHRoaXMub25Tb2NrZXRFcnJvciA9IHRoaXMuaWRlbnRpdHkub25Tb2NrZXRFcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIC8vIFJlZ2lzdGVyIGxpZmVjeWNsZSBjYWxsYmFja3NcbiAgICB0aGlzLmV2ZW50c1tldmVudF0gPSBjYWxsYmFjaztcbiAgfVxuXG4gIGxpc3RlbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAvLyBSZWdpc3RlciB1c2VyIGRlZmluZWQgY2FsbGJhY2tzXG4gICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdID0gY2FsbGJhY2s7XG4gIH1cblxuXG4gIHNlbmQoZGF0YSkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChkYXRhKTtcbiAgfVxuXG4gIGFzeW5jIHB1Ymxpc2goZXZlbnQsIGRhdGEsIG1ldGEpIHtcbiAgICBpZiAobWV0YSAmJiBtZXRhLmJsb2NrY2hhaW4pIHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNlbmRPbkJsb2NrY2hhaW4oZXZlbnQsIGRhdGEsIG1ldGEpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIG1ldGE6IG1ldGEsXG4gICAgfSkpO1xuICB9XG5cblxuICBhc3luYyBzZW5kT25CbG9ja2NoYWluKGV2ZW50LCBkYXRhLCBtZXRhKSB7XG4gICAgaWYgKCF0aGlzLmJsb2NrY2hhaW4pIHtcbiAgICAgIHRoaXMuYmxvY2tjaGFpbiA9IG5ldyBCbG9ja2NoYWluKHRoaXMuaWRlbnRpdHkpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXB0ID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLnNlbmQoZGF0YSk7XG5cbiAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1oYXNoJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddLmJpbmQodGhpcykoe1xuICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIG1ldGE6IG1ldGEsXG4gICAgICAgICAgdHJhbnNhY3Rpb25IYXNoOiByZWNlaXB0Lmhhc2gsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoSlNPTi5zdHJpbmdpZnkoeydldmVudCc6IGV2ZW50LCAnZGF0YSc6IGRhdGEsICdtZXRhJzogey4uLm1ldGEsICd0cmFuc2FjdGlvbl9pZCc6IHJlY2VpcHQuaWQsICd0cmFuc2FjdGlvbl9oYXNoJzogcmVjZWlwdC5oYXNofX0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGNvbmZpcm1PbkJsb2NrY2hhaW4oZXZlbnQsIHRyYW5zYWN0aW9uSGFzaCkge1xuICAgIGlmICghdGhpcy5ibG9ja2NoYWluKSB7XG4gICAgICB0aGlzLmJsb2NrY2hhaW4gPSBuZXcgQmxvY2tjaGFpbih0aGlzLmlkZW50aXR5KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IHRoaXMuYmxvY2tjaGFpbi5jb25maXJtKHRyYW5zYWN0aW9uSGFzaCk7XG5cbiAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1oYXNoJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddLmJpbmQodGhpcykoe1xuICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICBjb25maXJtYXRpb25IYXNoOiB0cmFuc2FjdGlvbkhhc2gsXG4gICAgICAgICAgdHJhbnNhY3Rpb25IYXNoOiBoYXNoLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKEpTT04uc3RyaW5naWZ5KHsnZXZlbnQnOiBldmVudCwgJ2RhdGEnOiB0cmFuc2FjdGlvbkhhc2gsICdtZXRhJzogeyd0cmFuc2FjdGlvbl9pZCc6IDEsICd0cmFuc2FjdGlvbl9oYXNoJzogaGFzaH19KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uTWVzc2FnZShlKSB7XG4gICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIG1lc3NhZ2U6JywgZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgIGlmIChtZXNzYWdlLmVycm9yICYmIG1lc3NhZ2UuZXJyb3IubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcmUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICBpZiAobWVzc2FnZS5ldmVudCkge1xuICAgICAgICB0aGlzLmhhbmRsZU1lbWJlckhhbmRzaGFrZShtZXNzYWdlKTtcblxuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbbWVzc2FnZS5ldmVudF0pIHtcbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1ttZXNzYWdlLmV2ZW50XS5iaW5kKHRoaXMpKG1lc3NhZ2UuZGF0YSwgbWVzc2FnZS5tZXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1snKiddKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbJyonXS5iaW5kKHRoaXMpKG1lc3NhZ2UuZXZlbnQsIG1lc3NhZ2UuZGF0YSwgbWVzc2FnZS5tZXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGpzb25FeGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoanNvbkV4Y2VwdGlvbik7XG4gICAgfVxuXG4gICAgLy8gRmlyZSBsaWZlY3ljbGUgY2FsbGJhY2tcbiAgICBpZiAodGhpcy5ldmVudHNbJ21lc3NhZ2UnXSkge1xuICAgICAgdGhpcy5ldmVudHNbJ21lc3NhZ2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1lbWJlckhhbmRzaGFrZShtZXNzYWdlKSB7XG4gICAgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTptZW1iZXJfbGlzdCcpIHtcbiAgICAgIHRoaXMubWVtYmVycyA9IG1lc3NhZ2UuZGF0YS5tZW1iZXJzO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOm1lbWJlcl9qb2luZWQnKSB7XG4gICAgICB0aGlzLm1lbWJlcnMgPSBtZXNzYWdlLmRhdGEubWVtYmVycztcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTptZW1iZXJfbGVmdCcpIHtcbiAgICAgIHRoaXMubWVtYmVycyA9IG1lc3NhZ2UuZGF0YS5tZW1iZXJzO1xuICAgICAgaWYgKHRoaXMucG9ydGFsKSB7XG4gICAgICAgIHRoaXMucG9ydGFsLnJlbW92ZVBhcnRpY2lwYW50KG1lc3NhZ2UuZGF0YS5tZW1iZXIudXVpZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fcmVxdWVzdCcgJiYgbWVzc2FnZS5kYXRhLmZyb20gIT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5zaGFyZVZpZGVvKG1lc3NhZ2UuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06dmlkZW9fYWNjZXB0JyAmJiBtZXNzYWdlLmRhdGEudG8gPT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5hZGRJY2VDYW5kaWRhdGUobWVzc2FnZS5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTp2aWRlb19vZmZlcicgJiYgbWVzc2FnZS5kYXRhLnRvID09IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuY3JlYXRlQW5zd2VyKG1lc3NhZ2UuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb25PcGVuKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgIC8vIFN5c3RlbSBpbml0IGNhbGxiYWNrXG4gICAgdGhpcy5vblNvY2tldENvbm5lY3RlZChlKTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDaGFubmVsIGVycm9yOicsIGUpO1xuICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuXG4gICAgLy8gU3lzdGVtIGluaXQgZXJyb3IgY2FsbGJhY2tcbiAgICB0aGlzLm9uU29ja2V0RXJyb3IoZSk7XG5cbiAgICAvLyBVc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICBpZiAodGhpcy5ldmVudHNbJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuZXZlbnRzWydlcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZShlKSB7XG4gICAgdGhpcy5sb2dnZXIud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgdGhpcy5yZWNvbm5lY3QoKTtcblxuICAgIC8vIFVzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10uYmluZCh0aGlzKShlKTtcbiAgICB9XG4gIH1cblxuICByZWNvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZFJlY29ubmVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5sb2coJ1JlY29ubmVjdGluZycpO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZhbGlkQXV0aEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U9bnVsbCwgbmFtZT0nSW52YWxpZEF1dGhFeGNlcHRpb24nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnQXV0aCBlbmRwb2ludCBkaWQgbm90IHJldHVybiBhIHZhbGlkIEpXVCBUb2tlbiwgcGxlYXNlIHNlZTogaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9kb2NzLzMuMC9hdXRoZW50aWNhdGlvbic7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBsb2coLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm4oLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBlcnJvciguLi5kYXRhKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC5qcyc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyLmpzJztcbmltcG9ydCBQb3J0YWwgZnJvbSAnLi9Qb3J0YWwnO1xuaW1wb3J0IHBqc29uIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgSW52YWxpZEF1dGhFeGNlcHRpb24gZnJvbSAnLi9JbnZhbGlkQXV0aEV4Y2VwdGlvbi5qcyc7XG5pbXBvcnQgZGVmYXVsdE9wdGlvbnMgZnJvbSAnLi9taXNjL0RlZmF1bHRPcHRpb25zLmpzJztcbmltcG9ydCB7djQgYXMgdXVpZHY0fSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGllU29ja2V0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5vcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zfTtcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0ge307XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMub3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBzdWJzY3JpYmUoY2hhbm5lbElkLCByb29tT3B0aW9ucz17fSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAocm9vbU9wdGlvbnMudmlkZW8gfHwgcm9vbU9wdGlvbnMuYXVkaW8gfHwgcm9vbU9wdGlvbnMucG9ydGFsKSB7XG4gICAgICAgIC8vIEZvcmNlIGNvbmZpZyB3aGVuIHZpZGVvIGlzIHJlcXVpcmVkXG4gICAgICAgIHRoaXMub3B0aW9ucy5ub3RpZnlTZWxmID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXVpZCA9IHV1aWR2NCgpO1xuICAgICAgY29uc3QgZW5kcG9pbnQgPSBhd2FpdCB0aGlzLmdldEVuZHBvaW50KGNoYW5uZWxJZCwgdXVpZCk7XG5cbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdSZXR1cm5pbmcgZXhpc3RpbmcgY2hhbm5lbCcsIGNoYW5uZWxJZCk7XG4gICAgICAgIHJlc29sdmUodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQ3JlYXRpbmcgbmV3IGNoYW5uZWwnLCBjaGFubmVsSWQpO1xuICAgICAgICBjb25zdCBjaGFubmVsID0gbmV3IENoYW5uZWwoZW5kcG9pbnQsIHtcbiAgICAgICAgICBjaGFubmVsSWQ6IGNoYW5uZWxJZCxcbiAgICAgICAgICBvblNvY2tldENvbm5lY3RlZDogKCkgPT4ge1xuICAgICAgICAgICAgY2hhbm5lbC51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIGlmIChyb29tT3B0aW9ucy52aWRlbyB8fCByb29tT3B0aW9ucy5hdWRpbyB8fCByb29tT3B0aW9ucy5wb3J0YWwpIHtcbiAgICAgICAgICAgICAgY2hhbm5lbC5wb3J0YWwgPSBuZXcgUG9ydGFsKGNoYW5uZWwsIHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgLi4ucm9vbU9wdGlvbnMsXG4gICAgICAgICAgICAgIH0pOyBgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSA9IGNoYW5uZWw7XG4gICAgICAgICAgICByZXNvbHZlKGNoYW5uZWwpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Tb2NrZXRFcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KCdGYWlsZWQgdG8gbWFrZSB3ZWJzb2NrZXQgY29ubmVjdGlvbicpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodHlwZW9mIFdlYlNvY2tldCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIFJlc29sdmVzIHRoZSBwcm9taXNlIGluIGNhc2UgV2ViU29ja2V0IGlzIG5vdCBkZWZpbmVkXG4gICAgICAgICAgY2hhbm5lbC51dWlkID0gdXVpZDtcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICAgIHJlc29sdmUoY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGNoYW5uZWxJZCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q29ubmVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnM7XG4gIH1cblxuICBhc3luYyBnZXRBdXRoVG9rZW4oY2hhbm5lbCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZGF0YS5hcHBlbmQoJ2NoYW5uZWxfbmFtZScsIGNoYW5uZWwpO1xuXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKCdDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlbicsICdBdXRoRW5kcG9pbnRSZXNwb25zZUVycm9yJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKT0+e1xuICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKCdDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlbicsICdBdXRoRW5kcG9pbnRFcnJvcicpKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIub3BlbignUE9TVCcsIHRoaXMub3B0aW9ucy5hdXRoRW5kcG9pbnQpO1xuXG4gICAgICBjb25zdCBoZWFkZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzKTtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgaXNHdWFyZGVkKGNoYW5uZWwpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZvcmNlQXV0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuICgnJytjaGFubmVsKS5zdGFydHNXaXRoKCdwcml2YXRlLScpO1xuICB9XG5cbiAgYXN5bmMgZ2V0RW5kcG9pbnQoY2hhbm5lbElkLCB1dWlkKSB7XG4gICAgbGV0IGVuZHBvaW50ID0gYHdzczovLyR7dGhpcy5vcHRpb25zLmNsdXN0ZXJJZH0ucGllc29ja2V0LmNvbS92JHt0aGlzLm9wdGlvbnMudmVyc2lvbn0vJHtjaGFubmVsSWR9P2FwaV9rZXk9JHt0aGlzLm9wdGlvbnMuYXBpS2V5fSZub3RpZnlfc2VsZj0ke3RoaXMub3B0aW9ucy5ub3RpZnlTZWxmfSZzb3VyY2U9anNzZGsmdj0ke3Bqc29uLnZlcnNpb259JnByZXNlbmNlPSR7dGhpcy5vcHRpb25zLnByZXNlbmNlfWA7XG5cbiAgICAvLyBTZXQgYXV0aFxuICAgIGlmICh0aGlzLm9wdGlvbnMuand0KSB7XG4gICAgICBlbmRwb2ludCA9IGVuZHBvaW50Kycmand0PScrdGhpcy5vcHRpb25zLmp3dDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNHdWFyZGVkKGNoYW5uZWxJZCkpIHtcbiAgICAgIGNvbnN0IGF1dGggPSBhd2FpdCB0aGlzLmdldEF1dGhUb2tlbihjaGFubmVsSWQpO1xuICAgICAgaWYgKGF1dGguYXV0aCkge1xuICAgICAgICBlbmRwb2ludCA9IGVuZHBvaW50ICsgJyZqd3Q9JythdXRoLmF1dGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IHVzZXIgaWRlbnRpdHlcbiAgICBpZiAodGhpcy5vcHRpb25zLnVzZXJJZCkge1xuICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludCArICcmdXNlcj0nK3RoaXMub3B0aW9ucy51c2VySWQ7XG4gICAgfVxuXG4gICAgLy8gQWRkIHV1aWRcbiAgICBlbmRwb2ludCA9IGVuZHBvaW50KycmdXVpZD0nK3V1aWQ7XG5cbiAgICByZXR1cm4gZW5kcG9pbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEljZUNhbmRpZGF0ZSBmcm9tICcuL21pc2MvUlRDSWNlQ2FuZGlkYXRlJztcbmltcG9ydCBQZWVyQ29ubmVjdGlvbiBmcm9tICcuL21pc2MvUlRDUGVlckNvbm5lY3Rpb24nO1xuaW1wb3J0IFNlc3Npb25EZXNjcmlwdGlvbiBmcm9tICcuL21pc2MvUlRDU2Vzc2lvbkRlc2NyaXB0aW9uJztcbmNvbnN0IGRlZmF1bHRQb3J0YWxPcHRpb25zID0ge1xuICBzaG91bGRCcm9hZGNhc3Q6IHRydWUsXG4gIHBvcnRhbDogdHJ1ZSxcbiAgdmlkZW86IGZhbHNlLFxuICBhdWRpbzogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIHtcbiAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHZpZGVvIHJvb20gaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0geyp9IGNoYW5uZWxcbiAgICAgKi9cbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgaWRlbnRpdHkpIHtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgdGhpcy5pZGVudGl0eSA9IHsgLi4uZGVmYXVsdFBvcnRhbE9wdGlvbnMsIC4uLmlkZW50aXR5IH07XG4gICAgdGhpcy5sb2NhbFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5wZWVyQ29ubmVjdGlvbkNvbmZpZyA9IHtcbiAgICAgICdpY2VTZXJ2ZXJzJzogW1xuICAgICAgICB7ICd1cmxzJzogJ3N0dW46c3R1bi5zdHVucHJvdG9jb2wub3JnOjM0NzgnIH0sXG4gICAgICAgIHsgJ3VybHMnOiAnc3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMicgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgICB0aGlzLmNvbnN0cmFpbnRzID0ge1xuICAgICAgdmlkZW86IGlkZW50aXR5LnZpZGVvLFxuICAgICAgYXVkaW86IGlkZW50aXR5LmF1ZGlvLFxuICAgIH07XG5cbiAgICB0aGlzLnBhcnRpY2lwYW50cyA9IFtdO1xuICAgIHRoaXMuaXNOZWdvdGlhdGluZyA9IFtdO1xuXG5cbiAgICB0aGlzLmxvZ2dlci5sb2coJ0luaXRpYWxpemluZyB2aWRlbyByb29tJyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICAgKiBJbml0aWFsaXplIGxvY2FsIHZpZGVvXG4gICAgICovXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnN0cmFpbnRzLnZpZGVvICYmICF0aGlzLmNvbnN0cmFpbnRzLmF1ZGlvKSB7XG4gICAgICB0aGlzLnJlcXVlc3RQZWVyVmlkZW8oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEodGhpcy5jb25zdHJhaW50cykudGhlbih0aGlzLmdldFVzZXJNZWRpYVN1Y2Nlc3MuYmluZCh0aGlzKSkuY2F0Y2godGhpcy5lcnJvckhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGdldFVzZXJNZWRpYSBBUEknKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzaGFyZVZpZGVvKHNpZ25hbCwgaXNDYWxsZXIgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLmlkZW50aXR5LnNob3VsZEJyb2FkY2FzdCAmJiBpc0NhbGxlciAmJiAhc2lnbmFsLmlzQnJvYWRjYXN0aW5nKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlZnVzaW5nIHRvIGNhbGwsIGRlbmllZCBicm9hZGNhc3QgcmVxdWVzdFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBydGNDb25uZWN0aW9uID0gbmV3IFBlZXJDb25uZWN0aW9uKHRoaXMucGVlckNvbm5lY3Rpb25Db25maWcpO1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbmljZWNhbmRpZGF0ZSA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKCdzeXN0ZW06dmlkZW9fYWNjZXB0Jywge1xuICAgICAgICAgICdmcm9tJzogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICAgICAgJ3RvJzogc2lnbmFsLmZyb20sXG4gICAgICAgICAgJ2ljZSc6IGV2ZW50LmNhbmRpZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub250cmFjayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRyYWNrLmtpbmQgIT0gJ3ZpZGVvJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5zdHJlYW1zID0gZXZlbnQuc3RyZWFtcztcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50Sm9pbmVkKHNpZ25hbC5mcm9tLCBldmVudC5zdHJlYW1zWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gKGUpID0+IHtcbiAgICAgIC8vIFdvcmthcm91bmQgZm9yIENocm9tZTogc2tpcCBuZXN0ZWQgbmVnb3RpYXRpb25zXG4gICAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID0gKHJ0Y0Nvbm5lY3Rpb24uc2lnbmFsaW5nU3RhdGUgIT0gJ3N0YWJsZScpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5sb2NhbFN0cmVhbSkge1xuICAgICAgdGhpcy5sb2NhbFN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICBydGNDb25uZWN0aW9uLmFkZFRyYWNrKHRyYWNrLCB0aGlzLmxvY2FsU3RyZWFtKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0gPSBmYWxzZTtcbiAgICBcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub25uZWdvdGlhdGlvbm5lZWRlZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZFZpZGVvT2ZmZXIoc2lnbmFsLCBydGNDb25uZWN0aW9uLCBpc0NhbGxlcik7XG4gICAgfTtcblxuICAgIHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXSA9IHtcbiAgICAgIHJ0YzogcnRjQ29ubmVjdGlvbixcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2VuZFZpZGVvT2ZmZXIoc2lnbmFsLCBydGNDb25uZWN0aW9uLCBpc0NhbGxlcikge1xuXG4gICAgaWYgKCFpc0NhbGxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgaWYgKHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0pIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTS0lQIG5lc3RlZCBuZWdvdGlhdGlvbnMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmlzTmVnb3RpYXRpbmdbc2lnbmFsLmZyb21dID0gdHJ1ZTtcblxuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBhd2FpdCBydGNDb25uZWN0aW9uLmNyZWF0ZU9mZmVyKCk7XG4gICAgYXdhaXQgcnRjQ29ubmVjdGlvbi5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcblxuICAgIGNvbnNvbGUubG9nKCdNYWtpbmcgb2ZmZXInKTtcbiAgICAvLyBTZW5kIGEgY2FsbCBvZmZlclxuICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKCdzeXN0ZW06dmlkZW9fb2ZmZXInLCB7XG4gICAgICAnZnJvbSc6IHRoaXMuY2hhbm5lbC51dWlkLFxuICAgICAgJ3RvJzogc2lnbmFsLmZyb20sXG4gICAgICAnc2RwJzogcnRjQ29ubmVjdGlvbi5sb2NhbERlc2NyaXB0aW9uLFxuICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmVQYXJ0aWNpcGFudCh1dWlkKSB7XG4gICAgZGVsZXRlIHRoaXMucGFydGljaXBhbnRzW3V1aWRdO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmlkZW50aXR5Lm9uUGFydGljaXBhbnRMZWZ0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaWRlbnRpdHkub25QYXJ0aWNpcGFudExlZnQodXVpZCk7XG4gICAgfVxuICB9XG5cbiAgYWRkSWNlQ2FuZGlkYXRlKHNpZ25hbCkge1xuICAgIGNvbnN0IHJ0Y0Nvbm5lY3Rpb24gPSB0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjO1xuICAgIHJ0Y0Nvbm5lY3Rpb24uYWRkSWNlQ2FuZGlkYXRlKG5ldyBJY2VDYW5kaWRhdGUoc2lnbmFsLmljZSkpO1xuICB9XG5cbiAgY3JlYXRlQW5zd2VyKHNpZ25hbCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXSB8fCAhdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yykge1xuICAgICAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgY2FsbCBpbiBjcmVhdGVBbnN3ZXInKTtcbiAgICAgICAgdGhpcy5zaGFyZVZpZGVvKHNpZ25hbCwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBTZXNzaW9uRGVzY3JpcHRpb24oc2lnbmFsLnNkcCkpO1xuICAgICAgLy8gT25seSBjcmVhdGUgYW5zd2VycyBpbiByZXNwb25zZSB0byBvZmZlcnNcbiAgICAgIGlmIChzaWduYWwuc2RwLnR5cGUgPT0gJ29mZmVyJykge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0dvdCBhbiBvZmZlciBmcm9tICcgKyBzaWduYWwuZnJvbSwgc2lnbmFsKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBhd2FpdCB0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjLmNyZWF0ZUFuc3dlcigpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFydGljaXBhbnRzW3NpZ25hbC5mcm9tXS5ydGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKCdzeXN0ZW06dmlkZW9fb2ZmZXInLCB7XG4gICAgICAgICAgJ2Zyb20nOiB0aGlzLmNoYW5uZWwudXVpZCxcbiAgICAgICAgICAndG8nOiBzaWduYWwuZnJvbSxcbiAgICAgICAgICAnc2RwJzogdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5sb2NhbERlc2NyaXB0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdHb3QgYW4gYXNud2VyIGZyb20gJyArIHNpZ25hbC5mcm9tKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaGFuZGxlIGxvY2FsIHN0cmVhbVxuICAgICAqIEBwYXJhbSB7Kn0gc3RyZWFtXG4gICAgICovXG4gIGdldFVzZXJNZWRpYVN1Y2Nlc3Moc3RyZWFtKSB7XG4gICAgdGhpcy5sb2NhbFN0cmVhbSA9IHN0cmVhbTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8oc3RyZWFtLCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3RQZWVyVmlkZW8oKTtcbiAgfVxuXG4gIHJlcXVlc3RQZWVyVmlkZW8oKSB7XG4gICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTp2aWRlb19yZXF1ZXN0Jywge1xuICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICBpc0Jyb2FkY2FzdGluZzogdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3RcbiAgICB9KTtcbiAgfVxuXG4gIGVycm9ySGFuZGxlcihlKSB7XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1BvcnRhbCBlcnJvcicsIGUpO1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGllU29ja2V0JykuZGVmYXVsdDtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgdmVyc2lvbjogMyxcbiAgY2x1c3RlcklkOiAnZGVtbycsXG4gIGFwaUtleTogJ29DZENNY01QUXBidk5qVUl6cXR2RjFkMlgyb2tXcERRajRBd0FSSnVBZ3RqaHpLeFZFalFVNklkQ2p3bScsXG4gIGNvbnNvbGVMb2dzOiBmYWxzZSxcbiAgbm90aWZ5U2VsZjogMCxcbiAgand0OiBudWxsLFxuICBwcmVzZW5jZTogMCxcbiAgYXV0aEVuZHBvaW50OiAnL2Jyb2FkY2FzdGluZy9hdXRoJyxcbiAgYXV0aEhlYWRlcnM6IHt9LFxuICBmb3JjZUF1dGg6IGZhbHNlLFxuICB1c2VySWQ6IG51bGwsXG4gIGJsb2NrY2hhaW5UZXN0TW9kZTogZmFsc2UsXG4gIGJsb2NrY2hhaW5HYXNGZWU6IDQxMDAwLFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFJUQ0ljZUNhbmRpZGF0ZTtcbiIsImV4cG9ydCBkZWZhdWx0IFJUQ1BlZXJDb25uZWN0aW9uO1xuIiwiZXhwb3J0IGRlZmF1bHQgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uO1xuIiwiZXhwb3J0IGRlZmF1bHQgV2ViU29ja2V0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=