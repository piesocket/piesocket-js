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

  /**
   * Wire this handle to a shared {@link Connection} (PieSocket v4). The socket
   * lifecycle lives on the Connection; this handle only routes frames.
   * @param {*} connection Shared Connection instance (null in non-browser envs)
   * @param {string} channelId
   * @param {*} identity
   */
  attachToConnection(connection, channelId, identity) {
    this.hub = connection;
    this.channelId = channelId;
    this.identity = identity;
    this.shouldReconnect = false;
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](identity);
  }

  memberKey(member) {
    if (member && typeof member === 'object') {
      return member.uuid != null ? 'uuid:' + member.uuid : 'obj:' + JSON.stringify(member);
    }
    return 'val:' + String(member);
  }

  addMember(member) {
    if (member == null) {
      return;
    }
    const key = this.memberKey(member);
    if (!this.members.some((m) => this.memberKey(m) === key)) {
      this.members.push(member);
    }
  }

  removeMember(member) {
    if (member == null) {
      return;
    }
    const key = this.memberKey(member);
    this.members = this.members.filter((m) => this.memberKey(m) !== key);
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
    if (this.hub) {
      return this.hub.send(this.channelId, data);
    }
    return this.connection.send(data);
  }

  async publish(event, data, meta) {
    if (meta && meta.blockchain) {
      return await this.sendOnBlockchain(event, data, meta);
    }

    const payload = {
      event: event,
      data: data,
      meta: meta,
    };

    if (this.hub) {
      return this.hub.send(this.channelId, payload);
    }
    return this.connection.send(JSON.stringify(payload));
  }

  /**
   * Re-sync this channel's presence roster from the server via
   * `system:get_members`. Resolves with the refreshed member list.
   * @return {Promise<Array>}
   */
  refreshMembers() {
    if (this.hub) {
      return this.hub.requestMembers(this.channelId);
    }
    return Promise.resolve(this.members);
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

      return this.send(JSON.stringify({'event': event, 'data': data, 'meta': {...meta, 'transaction_id': receipt.id, 'transaction_hash': receipt.hash}}));
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

      return this.send(JSON.stringify({'event': event, 'data': transactionHash, 'meta': {'transaction_id': 1, 'transaction_hash': hash}}));
    } catch (e) {
      if (this.events['blockchain-error']) {
        this.events['blockchain-error'].bind(this)(e);
      }
    }
  }

  onMessage(e) {
    this.logger.log('Channel message:', e);

    let message = null;
    try {
      message = JSON.parse(e.data);
    } catch (jsonException) {
      console.error(jsonException);
    }

    this.dispatch(message, e);
  }

  /**
   * Route a parsed frame to listeners + presence handling, then fire the
   * `message` lifecycle callback. Shared by the v3 socket path and the v4
   * multiplexed {@link Connection}.
   * @param {*} message Parsed frame, or null for a non-JSON payload
   * @param {*} rawEvent Original socket MessageEvent
   */
  dispatch(message, rawEvent) {
    if (message) {
      this.handleFrame(message);
    }

    // Fire lifecycle callback
    if (this.events['message']) {
      this.events['message'].bind(this)(rawEvent);
    }
  }

  handleFrame(message) {
    if (message.error && message.error.length) {
      this.shouldReconnect = false;
    }

    if (message.event) {
      this.handleMemberHandshake(message);

      if (this.listeners[message.event]) {
        this.listeners[message.event].bind(this)(message.data, message.meta);
      }

      if (this.listeners['*']) {
        this.listeners['*'].bind(this)(message.event, message.data, message.meta);
      }
    }
  }

  handleMemberHandshake(message) {
    // v4 delivers presence as deltas: member_joined / member_left carry only the
    // member that changed, and the full roster arrives once as member_list (on
    // join or in response to system::get_members / refreshMembers()). v4's
    // system events are double-colon (`system::x`) end-to-end; v3's stay
    // single-colon. Portal/WebRTC events below are always v3, so untouched.
    const deltaPresence = this.identity && this.identity.version == 4;
    const memberListEvent = deltaPresence ? 'system::member_list' : 'system:member_list';
    const memberJoinedEvent = deltaPresence ? 'system::member_joined' : 'system:member_joined';
    const memberLeftEvent = deltaPresence ? 'system::member_left' : 'system:member_left';

    if (message.event == memberListEvent) {
      this.members = Array.isArray(message.data.members) ? message.data.members : [];
    } else if (message.event == memberJoinedEvent) {
      if (deltaPresence) {
        this.addMember(message.data.member);
      } else {
        this.members = message.data.members;
      }
    } else if (message.event == memberLeftEvent) {
      if (deltaPresence) {
        this.removeMember(message.data.member);
      } else {
        this.members = message.data.members;
      }
      if (this.portal && message.data.member) {
        this.portal.removeParticipant(message.data.member.uuid);
      }
    } else if (message.event == 'system:portal_broadcaster' && message.data.from != this.uuid) {
      this.portal.requestOfferFromPeer(message.data);
    } else if (message.event == 'system:stopped_screen' && message.data.from != this.uuid) {
      this.portal.onRemoteScreenStopped(message.data.from, message.data.streamId);
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

/***/ "./src/Connection.js":
/*!***************************!*\
  !*** ./src/Connection.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Connection)
/* harmony export */ });
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _misc_WebSocket_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/WebSocket.js */ "./src/misc/WebSocket.js");



const CONTROL_TIMEOUT_MS = 10000;

// setTimeout in Node returns a Timeout with unref(); in browsers it returns a
// number. Keep a pending control frame from holding a Node process open.
const timeout = (fn, ms) => {
  const t = setTimeout(fn, ms);
  if (t && typeof t.unref === 'function') {
    t.unref();
  }
  return t;
};

/**
 * A single WebSocket shared by many {@link Channel} handles (PieSocket v4).
 *
 * The channel named in the connect URL is the "primary" — its lifecycle is the
 * socket's lifecycle. Every other channel is subscribed with a
 * `system::subscribe` control frame and rides the same socket; outbound frames
 * for it are tagged with `system::channel`, and inbound frames are routed back
 * to it by the `system::channel` / `data.channel` the server stamps on them.
 *
 * All v4 control/system events are `system::x` (double colon), on the wire
 * and in the frames handed to Channel — including the event name app code
 * passes to `channel.listen(...)`. This matches the `system::channel` /
 * `system::to` field convention and keeps v4 consistently double-colon
 * end-to-end; v3's single-colon events (`system:member_joined`, etc.) are a
 * separate, untouched convention that Channel still speaks natively.
 */
class Connection {
  constructor(endpoint, options, primaryChannelId) {
    this.options = options || {};
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.options);
    this.primaryChannelId = primaryChannelId;

    this.channels = {}; // channelId -> Channel
    this.pending = {}; // channelId -> { resolve, reject, timer, params }
    this.memberRequests = {}; // channelId -> [{ resolve, reject, timer }]

    this.connected = false;
    this.shouldReconnect = false;
    this._migrating = false;
    this._openedOnce = false;

    // Set by PieSocket to settle the first subscribe() promise.
    this.onPrimaryConnected = () => {};
    this.onPrimaryError = () => {};

    this.connect(endpoint);
  }

  connect(endpoint) {
    if (endpoint) {
      this.endpoint = endpoint;
    }

    const socket = new _misc_WebSocket_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.endpoint);
    try {
      socket.binaryType = 'arraybuffer';
    } catch (e) {
      // Some environments expose a read-only binaryType — ignore.
    }
    socket.onopen = this.onOpen.bind(this);
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);

    this.socket = socket;
    return socket;
  }

  isPrimary(channelId) {
    return channelId === this.primaryChannelId;
  }

  attachChannel(channelId, channel) {
    this.channels[channelId] = channel;
  }

  detachChannel(channelId) {
    delete this.channels[channelId];
    this._settleMemberRequests(channelId, 'reject', new Error('Channel detached'));
  }

  // ===== Outbound =====

  sendControl(event, data) {
    try {
      this.socket.send(JSON.stringify({event: event, data: data}));
    } catch (e) {
      this.logger.error('PieSocket: control frame send failed', e);
    }
  }

  /**
   * Send an application frame on behalf of `channelId`. Accepts either an
   * object (from Channel#publish) or a pre-serialised string (raw Channel#send
   * / blockchain payloads). Secondary channels get a `system::channel` tag.
   * @param {string} channelId
   * @param {(object|string)} data
   * @return {*}
   */
  send(channelId, data) {
    if (data && typeof data === 'object') {
      const payload = this.isPrimary(channelId) ?
        data :
        {...data, 'system::channel': channelId};
      return this.socket.send(JSON.stringify(payload));
    }

    if (!this.isPrimary(channelId)) {
      try {
        const obj = JSON.parse(data);
        if (obj && typeof obj === 'object') {
          obj['system::channel'] = channelId;
          return this.socket.send(JSON.stringify(obj));
        }
      } catch (e) {
        // Not JSON — fall through and send verbatim.
      }
    }

    return this.socket.send(data);
  }

  // ===== Subscription control =====

  subscribeChannel(channelId, params) {
    return new Promise((resolve, reject) => {
      const timer = timeout(() => {
        delete this.pending[channelId];
        reject(new Error(`system::subscribe timed out for "${channelId}"`));
      }, CONTROL_TIMEOUT_MS);

      this.pending[channelId] = {resolve, reject, timer, params};

      if (this.connected) {
        this.sendControl('system::subscribe', params);
      }
      // Otherwise onOpen() replays every pending subscribe.
    });
  }

  unsubscribeChannel(channelId) {
    return new Promise((resolve, reject) => {
      if (this.isPrimary(channelId)) {
        reject(new Error('Cannot unsubscribe the primary channel directly'));
        return;
      }

      const timer = timeout(() => {
        delete this.pending[channelId];
        resolve();
      }, CONTROL_TIMEOUT_MS);

      this.pending[channelId] = {resolve, reject, timer};
      this.sendControl('system::unsubscribe', {channel: channelId});
    });
  }

  requestMembers(channelId) {
    return new Promise((resolve, reject) => {
      if (!this.memberRequests[channelId]) {
        this.memberRequests[channelId] = [];
      }

      const timer = timeout(() => {
        this._settleMemberRequests(
            channelId,
            'reject',
            new Error(`system::get_members timed out for "${channelId}"`),
        );
      }, CONTROL_TIMEOUT_MS);

      this.memberRequests[channelId].push({resolve, reject, timer});
      this.sendControl('system::get_members', {channel: channelId});
    });
  }

  /**
   * Re-open the socket with `newPrimaryId` as the primary channel, keeping every
   * other subscription. Used when the current primary is unsubscribed. Frames in
   * flight during the swap may be missed.
   * @param {string} newPrimaryId
   * @param {string} endpoint New primary connect URL
   * @return {void}
   */
  migratePrimary(newPrimaryId, endpoint) {
    this._migrating = true;

    const old = this.socket;
    try {
      old.onclose = () => {};
      old.onmessage = () => {};
      old.close();
    } catch (e) {
      // ignore
    }

    this.primaryChannelId = newPrimaryId;
    if (this.channels[newPrimaryId]) {
      // The new primary is subscribed via the URL now, not a control frame.
      delete this.channels[newPrimaryId].subscribeParams;
    }

    this.connected = false;
    this.connect(endpoint);
    this._migrating = false;
  }

  close() {
    this.shouldReconnect = false;
    try {
      this.socket.close();
    } catch (e) {
      // ignore
    }
  }

  // ===== Socket events =====

  onOpen(e) {
    this.connected = true;
    this.shouldReconnect = true;

    // Replay every secondary subscription (reconnect / primary migration).
    Object.keys(this.channels).forEach((channelId) => {
      if (this.isPrimary(channelId)) {
        return;
      }
      const params = this.channels[channelId].subscribeParams;
      if (params) {
        this.sendControl('system::subscribe', params);
      }
    });

    // Replay subscribes that were still in flight across a reconnect.
    Object.keys(this.pending).forEach((channelId) => {
      if (this.pending[channelId].params) {
        this.sendControl('system::subscribe', this.pending[channelId].params);
      }
    });

    // Settle the first subscribe() promise exactly once — a reconnect or a
    // primary migration must not re-run that closure (it captured the original
    // primary channel).
    if (!this._openedOnce) {
      this._openedOnce = true;
      this.onPrimaryConnected(e);
    }

    const primary = this.channels[this.primaryChannelId];
    if (primary && typeof primary.onOpen === 'function') {
      primary.onOpen(e);
    }
  }

  onMessage(e) {
    let message;
    try {
      message = JSON.parse(e.data);
    } catch (jsonException) {
      const primary = this.channels[this.primaryChannelId];
      if (primary) {
        primary.dispatch(null, e);
      }
      return;
    }

    const event = message && message.event;

    if (
      event === 'system::subscribe_success' ||
      event === 'system::subscribe_error' ||
      event === 'system::unsubscribe_success' ||
      event === 'system::unsubscribe_error'
    ) {
      return this._settleControl(message);
    }

    if (event === 'system::member_list_error') {
      const channelId = (message.data && message.data.channel) || this.primaryChannelId;
      return this._settleMemberRequests(
          channelId,
          'reject',
          new Error((message.data && message.data.error) || 'Could not fetch members'),
      );
    }

    if (event === 'system::binary') {
      const channelId = message['system::channel'] || this.primaryChannelId;
      const channel = this.channels[channelId] || this.channels[this.primaryChannelId];
      if (channel) {
        channel.dispatch(
            {event: 'system::binary', data: this._decodeBase64(message.data), meta: message.meta},
            e,
        );
      }
      return;
    }

    const channelId =
      message['system::channel'] ||
      (message.data && message.data.channel) ||
      this.primaryChannelId;
    const channel = this.channels[channelId] || this.channels[this.primaryChannelId];
    if (!channel) {
      return;
    }

    channel.dispatch(message, e);

    if (event === 'system::member_list') {
      this._settleMemberRequests(channelId, 'resolve', channel.members);
    }
  }

  onError(e) {
    this.logger.error('PieSocket: connection error', e);

    if (!this.connected) {
      this.onPrimaryError(e);
    }

    Object.keys(this.channels).forEach((channelId) => {
      const channel = this.channels[channelId];
      if (channel.events && channel.events['error']) {
        channel.events['error'].bind(channel)(e);
      }
    });

    try {
      this.socket.close();
    } catch (err) {
      // ignore
    }
  }

  onClose(e) {
    this.connected = false;

    Object.keys(this.channels).forEach((channelId) => {
      const channel = this.channels[channelId];
      if (channel.events && channel.events['close']) {
        channel.events['close'].bind(channel)(e);
      }
    });

    if (this.shouldReconnect && !this._migrating) {
      this.logger.log('PieSocket: reconnecting multiplexed connection');
      this.connect();
    }
  }

  // ===== Internals =====

  _settleControl(message) {
    const channelId = message.data && message.data.channel;
    const entry = channelId && this.pending[channelId];
    if (!entry) {
      return;
    }

    clearTimeout(entry.timer);
    delete this.pending[channelId];

    if (message.event.endsWith('_success')) {
      entry.resolve(message.data);
    } else {
      entry.reject(new Error((message.data && message.data.error) || message.event));
    }
  }

  _settleMemberRequests(channelId, how, value) {
    const list = this.memberRequests[channelId];
    if (!list || !list.length) {
      return;
    }
    delete this.memberRequests[channelId];
    list.forEach(({resolve, reject, timer}) => {
      clearTimeout(timer);
      if (how === 'resolve') {
        resolve(value);
      } else {
        reject(value);
      }
    });
  }

  _decodeBase64(b64) {
    if (typeof b64 !== 'string') {
      return b64;
    }
    if (typeof atob === 'function') {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      return bytes.buffer;
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64');
    }
    return b64;
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
/* harmony import */ var _Connection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Connection.js */ "./src/Connection.js");
/* harmony import */ var _Logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Logger.js */ "./src/Logger.js");
/* harmony import */ var _Portal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Portal.js */ "./src/Portal.js");
/* harmony import */ var _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InvalidAuthException.js */ "./src/InvalidAuthException.js");
/* harmony import */ var _misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc/DefaultOptions.js */ "./src/misc/DefaultOptions.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");








const SDK_VERSION = '5.4.0';

class PieSocket {
  constructor(options) {
    options = options || {};

    this.options = {..._misc_DefaultOptions_js__WEBPACK_IMPORTED_MODULE_5__["default"], ...options};
    this.connections = {};
    this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.options);
  }

  async subscribe(channelId, roomOptions={}) {
    const isPortal = !!(roomOptions.video || roomOptions.audio || roomOptions.portal);

    // v4 multi-channel: one shared WebSocket for every subscribe() call. Portals
    // keep a dedicated standalone connection — WebRTC signalling is 1:1.
    if (this.options.version == 4 && !isPortal) {
      return this.subscribeMultiplexed(channelId);
    }

    return this.subscribeStandalone(channelId, roomOptions, isPortal);
  }

  subscribeStandalone(channelId, roomOptions, isPortal) {
    return new Promise(async (resolve, reject) => {
      if (isPortal) {
        // Force config when video is required
        this.options.notifySelf = true;
      }

      const uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_6__["default"])();
      // Portals always speak the v3 protocol even when version:4 is configured.
      const version = isPortal && this.options.version == 4 ? 3 : this.options.version;
      const endpoint = await this.getEndpoint(channelId, uuid, version);

      if (this.connections[channelId]) {
        this.logger.log('Returning existing channel', channelId);
        resolve(this.connections[channelId]);
      } else {
        this.logger.log('Creating new channel', channelId);
        const channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](endpoint, {
          channelId: channelId,
          onSocketConnected: () => {
            channel.uuid = uuid;
            if (isPortal) {
              channel.portal = new _Portal_js__WEBPACK_IMPORTED_MODULE_3__["default"](channel, {
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
          // Portals are forced onto the v3 socket above even when
          // options.version is 4 — the identity must agree, or Channel's
          // delta-presence logic listens for v4's double-colon member events
          // on a socket that only ever sends v3's single-colon ones.
          version,
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

  async subscribeMultiplexed(channelId) {
    if (this.connections[channelId]) {
      this.logger.log('Returning existing channel', channelId);
      return this.connections[channelId];
    }

    const uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_6__["default"])();
    const presence =
      this.options.presence == 1 ||
      this.options.presence === true ||
      ('' + channelId).startsWith('presence-');
    const noWebSocket = typeof WebSocket == 'undefined';

    // First subscription opens the shared socket, with this channel as
    // primary. Two subscribe() calls fired without awaiting each other (e.g.
    // Promise.all right after construction) would otherwise both observe
    // `_multiplex` unset — before either's `getEndpoint()` await resolves —
    // and each open their own socket, silently orphaning one. A racing call
    // waits on the in-flight open instead, then retries as a secondary
    // subscribe once `_multiplex` is set.
    if (!this._multiplex) {
      if (this._multiplexOpening) {
        await this._multiplexOpening.catch(() => {});
        return this.subscribeMultiplexed(channelId);
      }

      this._multiplexOpening = this._openPrimaryConnection(channelId, uuid, presence, noWebSocket)
          .finally(() => {
            this._multiplexOpening = null;
          });
      return this._multiplexOpening;
    }

    // Shared socket already exists — subscribe with a control frame.
    const jwt = await this.resolveAuth(channelId);
    const channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, null, false);
    channel.attachToConnection(this._multiplex, channelId, {...this.options, channelId});
    channel.uuid = uuid;
    const params = this.buildSubscribeParams(channelId, presence, uuid, jwt);
    channel.subscribeParams = params;

    if (!noWebSocket) {
      await this._multiplex.subscribeChannel(channelId, params);
    }

    this._multiplex.attachChannel(channelId, channel);
    this.connections[channelId] = channel;
    return channel;
  }

  async _openPrimaryConnection(channelId, uuid, presence, noWebSocket) {
    const endpoint = await this.getEndpoint(channelId, uuid);

    return new Promise((resolve, reject) => {
      const conn = new _Connection_js__WEBPACK_IMPORTED_MODULE_1__["default"](endpoint, this.options, channelId);
      this._multiplex = conn;

      const channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, null, false);
      channel.attachToConnection(conn, channelId, {...this.options, channelId});
      channel.uuid = uuid;
      channel.subscribeParams = this.buildSubscribeParams(
          channelId, presence, uuid, this.options.jwt || null,
      );
      conn.attachChannel(channelId, channel);

      conn.onPrimaryConnected = () => {
        this.connections[channelId] = channel;
        resolve(channel);
      };
      conn.onPrimaryError = () => {
        this._multiplex = null;
        reject('Failed to make websocket connection');
      };

      if (noWebSocket) {
        // Mirrors subscribeStandalone: resolve without waiting for onopen.
        this.connections[channelId] = channel;
        resolve(channel);
      }
    });
  }

  buildSubscribeParams(channelId, presence, uuid, jwt) {
    const params = {channel: channelId, presence: presence, uuid: uuid};
    if (jwt) {
      params.jwt = jwt;
    }
    if (this.options.userId) {
      params.user = this.options.userId;
    }
    return params;
  }

  unsubscribe(channelId) {
    const channel = this.connections[channelId];
    if (!channel) {
      return false;
    }

    // v4 multiplexed handle — no socket of its own.
    if (this._multiplex && channel.hub) {
      const conn = this._multiplex;

      if (channelId === conn.primaryChannelId) {
        const others = Object.keys(conn.channels).filter((id) => id !== channelId);
        if (others.length === 0) {
          conn.close();
          this._multiplex = null;
        } else {
          // Promote another subscription to primary and keep the rest.
          const newPrimaryId = others[0];
          const newPrimary = conn.channels[newPrimaryId];
          conn.detachChannel(channelId);
          this.getEndpoint(newPrimaryId, newPrimary.uuid)
              .then((endpoint) => conn.migratePrimary(newPrimaryId, endpoint))
              .catch((e) => this.logger.error('PieSocket: primary migration failed', e));
        }
      } else {
        conn.unsubscribeChannel(channelId).catch(() => {});
        conn.detachChannel(channelId);
      }

      delete this.connections[channelId];
      return true;
    }

    // Standalone (v3 / portal) channel owns its own socket.
    channel.shouldReconnect = false;
    if (channel.connection) {
      channel.connection.close();
    }
    delete this.connections[channelId];
    return true;
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

  /**
   * Resolve the JWT for a channel: the configured token, or one fetched from the
   * auth endpoint for guarded channels. Returns null when none applies.
   * @param {string} channelId
   * @return {Promise<?string>}
   */
  async resolveAuth(channelId) {
    if (this.options.jwt) {
      return this.options.jwt;
    }
    if (this.isGuarded(channelId)) {
      const auth = await this.getAuthToken(channelId);
      if (auth && auth.auth) {
        return auth.auth;
      }
    }
    return null;
  }

  async getEndpoint(channelId, uuid, version) {
    version = version || this.options.version;
    const clusterDomain = this.options.clusterDomain == null ? `${this.options.clusterId}.piesocket.com` : this.options.clusterDomain;
    const protocol = this.options.ssl ? 'wss' : 'ws';
    const query = `api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${SDK_VERSION}&presence=${this.options.presence}`;
    let endpoint = `${protocol}://${clusterDomain}/v${version}/${channelId}?${query}`;

    // Set auth
    const jwt = await this.resolveAuth(channelId);
    if (jwt) {
      endpoint = endpoint + '&jwt=' + jwt;
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

  async onRemoteScreenStopped(uuid, streamId) {
    if (typeof this.identity.onScreenSharingStopped == 'function') {
      this.identity.onScreenSharingStopped(uuid, streamId);
    }
  }

  async onLocalScreen(screenStream) {
    // Register stop handler
    screenStream.getVideoTracks()[0].addEventListener('ended', () => {
      this.channel.publish('system:stopped_screen', {
        from: this.channel.uuid,
        streamId: screenStream.id,
      });
    });

    // Send it to other peers
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
  ssl: true,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG9GQUFvRjtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQix1QkFBdUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsZ0JBQWdCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Ozs7Ozs7QUNoQkY7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDSjVCO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRixpRUFBZSxjQUFjLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ0o5QjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsaUVBQWUsa0JBQWtCLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ0psQztBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7O1VDSnRCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOdUM7QUFDdkMsaUVBQWUscURBQVMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1BpZVNvY2tldC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9CbG9ja2NoYWluLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9DaGFubmVsLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Db25uZWN0aW9uLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9JbnZhbGlkQXV0aEV4Y2VwdGlvbi5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvTG9nZ2VyLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9QaWVTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL1BvcnRhbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9EZWZhdWx0T3B0aW9ucy5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvbWlzYy9SVENJY2VDYW5kaWRhdGUuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvUlRDUGVlckNvbm5lY3Rpb24uanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL21pc2MvUlRDU2Vzc2lvbkRlc2NyaXB0aW9uLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9taXNjL1dlYlNvY2tldC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJjb25zdCBQaWVNZXNzYWdlID0ge307XG5jb25zdCBCQ01FbmRwb2ludCA9ICdodHRwczovL3d3dy5waWVzb2NrZXQuY29tL2FwaS9ibG9ja2NoYWluL3BheWxvYWRIYXNoJztcbmNvbnN0IFBpZU1lc3NhZ2VBZGRyZXNzRGV2ID0gJzB4MjMyMWMzMjE4Mjg5NDYxNTNhODQ1ZTY5ZWUxNjhmNDEzZTg1YzkwZCc7XG5jb25zdCBQaWVNZXNzYWdlQWRkcmVzc1Byb2QgPSAnMHgyYTg0MENBNDBFMDgyRGJGMjQ2MTBCNjJhOTc4OTAwQmZDYUIyM0QzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2tjaGFpbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5hcGlLZXkgPSB0aGlzLm9wdGlvbnMuYXBpS2V5O1xuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMub3B0aW9ucy5jaGFubmVsSWQ7XG4gICAgdGhpcy5ibG9ja2NoYWluVGVzdE1vZGUgPSB0aGlzLm9wdGlvbnMuYmxvY2tjaGFpblRlc3RNb2RlO1xuICAgIHRoaXMuYmxvY2tjaGFpbkdhc0ZlZSA9IHRoaXMub3B0aW9ucy5ibG9ja2NoYWluR2FzRmVlO1xuXG4gICAgaWYgKHRoaXMuYmxvY2tjaGFpblRlc3RNb2RlKSB7XG4gICAgICB0aGlzLmNvbnRyYWN0QWRkcmVzcyA9IFBpZU1lc3NhZ2VBZGRyZXNzRGV2O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRyYWN0QWRkcmVzcyA9IFBpZU1lc3NhZ2VBZGRyZXNzUHJvZDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IHczID0gbmV3IFdlYjMod2luZG93LmV0aGVyZXVtKTtcbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IGV0aGVyZXVtLnJlcXVlc3Qoe21ldGhvZDogJ2V0aF9yZXF1ZXN0QWNjb3VudHMnfSk7XG4gICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudHNbMF07XG5cbiAgICB0aGlzLmNvbnRyYWN0ID0gbmV3IHczLmV0aC5Db250cmFjdChQaWVNZXNzYWdlLmFiaSwgdGhpcy5jb250cmFjdEFkZHJlc3MpO1xuICB9XG5cbiAgY2hlY2tXZWIzKCkge1xuICAgIGlmICh0eXBlb2YgV2ViMyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2coJ1dlYjMuanMgaXMgbm90IGluc3RhbGxlZCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5ldGhlcmV1bSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2coJ01ldGFNYXNrIGlzIG5vdCBpbnN0YWxsZWQhJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBjb25maXJtKGhhc2gpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hlY2tXZWIzKCkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyYWN0KSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNlaXB0ID0gdGhpcy5jb250cmFjdC5tZXRob2RzLmNvbmZpcm0oaGFzaCkuc2VuZCh7ZnJvbTogdGhpcy5hY2NvdW50LCBnYXM6IHRoaXMuYmxvY2tjaGFpbkdhc0ZlZX0pO1xuICAgICAgICByZWNlaXB0Lm9uKCd0cmFuc2FjdGlvbkhhc2gnLCByZXNvbHZlKTtcbiAgICAgICAgcmVjZWlwdC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmQobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5jaGVja1dlYjMoKSkge1xuICAgICAgICBpZiAoIXRoaXMuY29udHJhY3QpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJhY21IYXNoID0gYXdhaXQgdGhpcy5nZXRUcmFuc2FjdGlvbkhhc2gobWVzc2FnZSk7XG5cbiAgICAgICAgY29uc3QgcmVjZWlwdCA9IHRoaXMuY29udHJhY3QubWV0aG9kcy5zZW5kKGJhY21IYXNoLnBheWxvYWQpLnNlbmQoe2Zyb206IHRoaXMuYWNjb3VudCwgZ2FzOiB0aGlzLmJsb2NrY2hhaW5HYXNGZWV9KTtcbiAgICAgICAgcmVjZWlwdC5vbigndHJhbnNhY3Rpb25IYXNoJywgKGhhc2gpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICAgICAgICBpZDogYmFjbUhhc2gudHJhbnNhY3Rpb25faWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWNlaXB0Lm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBXZWIzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVqZWN0KCdQbGVhc2UgaW5zdGFsbCBXZWIzLmpzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdQbGVhc2UgaW5zdGFsbCBNZXRhTWFzaycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRUcmFuc2FjdGlvbkhhc2gobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAgIGRhdGEuYXBwZW5kKCdhcGlLZXknLCB0aGlzLmFwaUtleSk7XG4gICAgICBkYXRhLmFwcGVuZCgnY2hhbm5lbCcsIHRoaXMuY2hhbm5lbCk7XG4gICAgICBkYXRhLmFwcGVuZCgnbWVzc2FnZScsIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgIGRhdGEuYXBwZW5kKCdjb250cmFjdCcsIHRoaXMuY29udHJhY3RBZGRyZXNzKTtcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUGllU29ja2V0IEVycm9yOiAke0pTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmVycm9ycyl9YCk7XG4gICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLnN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KCdVbmtub3duIGVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbm5lY3QgdG8gQmxvY2tjaGFpbiBNZXNzYWdpbmcgQVBJLCB0cnkgbGF0ZXInKTtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQmxvY2tjaGFpbiBNZXNzYWdpbmcgQVBJIHNlZW1zIHVucmVhY2hhYmxlIGF0IHRoZSBtb21lbnQsIHRyeSBsYXRlcicpO1xuICAgICAgICByZWplY3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIub3BlbignUE9TVCcsIEJDTUVuZHBvaW50KTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEJsb2NrY2hhaW4gZnJvbSAnLi9CbG9ja2NoYWluLmpzJztcbmltcG9ydCBTb2NrZXQgZnJvbSAnLi9taXNjL1dlYlNvY2tldC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHksIGluaXQ9dHJ1ZSkge1xuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLm1lbWJlcnMgPSBbXTtcbiAgICB0aGlzLnBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy51dWlkID0gbnVsbDtcbiAgICB0aGlzLm9uU29ja2V0Q29ubmVjdGVkID0gKCkgPT4ge307XG4gICAgdGhpcy5vblNvY2tldEVycm9yID0gKCkgPT4ge307XG5cbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmluaXQoZW5kcG9pbnQsIGlkZW50aXR5KTtcbiAgfVxuXG4gIGluaXQoZW5kcG9pbnQsIGlkZW50aXR5KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogV2lyZSB0aGlzIGhhbmRsZSB0byBhIHNoYXJlZCB7QGxpbmsgQ29ubmVjdGlvbn0gKFBpZVNvY2tldCB2NCkuIFRoZSBzb2NrZXRcbiAgICogbGlmZWN5Y2xlIGxpdmVzIG9uIHRoZSBDb25uZWN0aW9uOyB0aGlzIGhhbmRsZSBvbmx5IHJvdXRlcyBmcmFtZXMuXG4gICAqIEBwYXJhbSB7Kn0gY29ubmVjdGlvbiBTaGFyZWQgQ29ubmVjdGlvbiBpbnN0YW5jZSAobnVsbCBpbiBub24tYnJvd3NlciBlbnZzKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhbm5lbElkXG4gICAqIEBwYXJhbSB7Kn0gaWRlbnRpdHlcbiAgICovXG4gIGF0dGFjaFRvQ29ubmVjdGlvbihjb25uZWN0aW9uLCBjaGFubmVsSWQsIGlkZW50aXR5KSB7XG4gICAgdGhpcy5odWIgPSBjb25uZWN0aW9uO1xuICAgIHRoaXMuY2hhbm5lbElkID0gY2hhbm5lbElkO1xuICAgIHRoaXMuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gIH1cblxuICBtZW1iZXJLZXkobWVtYmVyKSB7XG4gICAgaWYgKG1lbWJlciAmJiB0eXBlb2YgbWVtYmVyID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIG1lbWJlci51dWlkICE9IG51bGwgPyAndXVpZDonICsgbWVtYmVyLnV1aWQgOiAnb2JqOicgKyBKU09OLnN0cmluZ2lmeShtZW1iZXIpO1xuICAgIH1cbiAgICByZXR1cm4gJ3ZhbDonICsgU3RyaW5nKG1lbWJlcik7XG4gIH1cblxuICBhZGRNZW1iZXIobWVtYmVyKSB7XG4gICAgaWYgKG1lbWJlciA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHRoaXMubWVtYmVyS2V5KG1lbWJlcik7XG4gICAgaWYgKCF0aGlzLm1lbWJlcnMuc29tZSgobSkgPT4gdGhpcy5tZW1iZXJLZXkobSkgPT09IGtleSkpIHtcbiAgICAgIHRoaXMubWVtYmVycy5wdXNoKG1lbWJlcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTWVtYmVyKG1lbWJlcikge1xuICAgIGlmIChtZW1iZXIgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSB0aGlzLm1lbWJlcktleShtZW1iZXIpO1xuICAgIHRoaXMubWVtYmVycyA9IHRoaXMubWVtYmVycy5maWx0ZXIoKG0pID0+IHRoaXMubWVtYmVyS2V5KG0pICE9PSBrZXkpO1xuICB9XG5cbiAgZ2V0TWVtYmVyQnlVVUlEKHV1aWQpIHtcbiAgICBsZXQgbWVtYmVyID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMubWVtYmVyc1tpXS51dWlkID09IHV1aWQpIHtcbiAgICAgICAgbWVtYmVyID0gdGhpcy5tZW1iZXJzW2ldO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lbWJlcjtcbiAgfVxuXG4gIGdldEN1cnJlbnRNZW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWVtYmVyQnlVVUlEKHRoaXMudXVpZCk7XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICBjb25uZWN0aW9uLm9ub3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgY29ubmVjdGlvbi5vbmNsb3NlID0gdGhpcy5vbkNsb3NlLmJpbmQodGhpcyk7XG5cbiAgICBpZiAodGhpcy5pZGVudGl0eS5vblNvY2tldENvbm5lY3RlZCkge1xuICAgICAgdGhpcy5vblNvY2tldENvbm5lY3RlZCA9IHRoaXMuaWRlbnRpdHkub25Tb2NrZXRDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaWRlbnRpdHkub25Tb2NrZXRFcnJvcikge1xuICAgICAgdGhpcy5vblNvY2tldEVycm9yID0gdGhpcy5pZGVudGl0eS5vblNvY2tldEVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiBjb25uZWN0aW9uO1xuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgLy8gUmVnaXN0ZXIgbGlmZWN5Y2xlIGNhbGxiYWNrc1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICB9XG5cbiAgbGlzdGVuKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIC8vIFJlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICB0aGlzLmxpc3RlbmVyc1tldmVudF0gPSBjYWxsYmFjaztcbiAgfVxuXG5cbiAgc2VuZChkYXRhKSB7XG4gICAgaWYgKHRoaXMuaHViKSB7XG4gICAgICByZXR1cm4gdGhpcy5odWIuc2VuZCh0aGlzLmNoYW5uZWxJZCwgZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChkYXRhKTtcbiAgfVxuXG4gIGFzeW5jIHB1Ymxpc2goZXZlbnQsIGRhdGEsIG1ldGEpIHtcbiAgICBpZiAobWV0YSAmJiBtZXRhLmJsb2NrY2hhaW4pIHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNlbmRPbkJsb2NrY2hhaW4oZXZlbnQsIGRhdGEsIG1ldGEpO1xuICAgIH1cblxuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgbWV0YTogbWV0YSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuaHViKSB7XG4gICAgICByZXR1cm4gdGhpcy5odWIuc2VuZCh0aGlzLmNoYW5uZWxJZCwgcGF5bG9hZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gIH1cblxuICAvKipcbiAgICogUmUtc3luYyB0aGlzIGNoYW5uZWwncyBwcmVzZW5jZSByb3N0ZXIgZnJvbSB0aGUgc2VydmVyIHZpYVxuICAgKiBgc3lzdGVtOmdldF9tZW1iZXJzYC4gUmVzb2x2ZXMgd2l0aCB0aGUgcmVmcmVzaGVkIG1lbWJlciBsaXN0LlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPEFycmF5Pn1cbiAgICovXG4gIHJlZnJlc2hNZW1iZXJzKCkge1xuICAgIGlmICh0aGlzLmh1Yikge1xuICAgICAgcmV0dXJuIHRoaXMuaHViLnJlcXVlc3RNZW1iZXJzKHRoaXMuY2hhbm5lbElkKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLm1lbWJlcnMpO1xuICB9XG5cblxuICBhc3luYyBzZW5kT25CbG9ja2NoYWluKGV2ZW50LCBkYXRhLCBtZXRhKSB7XG4gICAgaWYgKCF0aGlzLmJsb2NrY2hhaW4pIHtcbiAgICAgIHRoaXMuYmxvY2tjaGFpbiA9IG5ldyBCbG9ja2NoYWluKHRoaXMuaWRlbnRpdHkpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXB0ID0gYXdhaXQgdGhpcy5ibG9ja2NoYWluLnNlbmQoZGF0YSk7XG5cbiAgICAgIGlmICh0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1oYXNoJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddLmJpbmQodGhpcykoe1xuICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIG1ldGE6IG1ldGEsXG4gICAgICAgICAgdHJhbnNhY3Rpb25IYXNoOiByZWNlaXB0Lmhhc2gsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZW5kKEpTT04uc3RyaW5naWZ5KHsnZXZlbnQnOiBldmVudCwgJ2RhdGEnOiBkYXRhLCAnbWV0YSc6IHsuLi5tZXRhLCAndHJhbnNhY3Rpb25faWQnOiByZWNlaXB0LmlkLCAndHJhbnNhY3Rpb25faGFzaCc6IHJlY2VpcHQuaGFzaH19KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWVycm9yJ10pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBhc3luYyBjb25maXJtT25CbG9ja2NoYWluKGV2ZW50LCB0cmFuc2FjdGlvbkhhc2gpIHtcbiAgICBpZiAoIXRoaXMuYmxvY2tjaGFpbikge1xuICAgICAgdGhpcy5ibG9ja2NoYWluID0gbmV3IEJsb2NrY2hhaW4odGhpcy5pZGVudGl0eSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCB0aGlzLmJsb2NrY2hhaW4uY29uZmlybSh0cmFuc2FjdGlvbkhhc2gpO1xuXG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4taGFzaCddKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzWydibG9ja2NoYWluLWhhc2gnXS5iaW5kKHRoaXMpKHtcbiAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgY29uZmlybWF0aW9uSGFzaDogdHJhbnNhY3Rpb25IYXNoLFxuICAgICAgICAgIHRyYW5zYWN0aW9uSGFzaDogaGFzaCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeydldmVudCc6IGV2ZW50LCAnZGF0YSc6IHRyYW5zYWN0aW9uSGFzaCwgJ21ldGEnOiB7J3RyYW5zYWN0aW9uX2lkJzogMSwgJ3RyYW5zYWN0aW9uX2hhc2gnOiBoYXNofX0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAodGhpcy5ldmVudHNbJ2Jsb2NrY2hhaW4tZXJyb3InXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1snYmxvY2tjaGFpbi1lcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25NZXNzYWdlKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgIGxldCBtZXNzYWdlID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICB9IGNhdGNoIChqc29uRXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGpzb25FeGNlcHRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuZGlzcGF0Y2gobWVzc2FnZSwgZSk7XG4gIH1cblxuICAvKipcbiAgICogUm91dGUgYSBwYXJzZWQgZnJhbWUgdG8gbGlzdGVuZXJzICsgcHJlc2VuY2UgaGFuZGxpbmcsIHRoZW4gZmlyZSB0aGVcbiAgICogYG1lc3NhZ2VgIGxpZmVjeWNsZSBjYWxsYmFjay4gU2hhcmVkIGJ5IHRoZSB2MyBzb2NrZXQgcGF0aCBhbmQgdGhlIHY0XG4gICAqIG11bHRpcGxleGVkIHtAbGluayBDb25uZWN0aW9ufS5cbiAgICogQHBhcmFtIHsqfSBtZXNzYWdlIFBhcnNlZCBmcmFtZSwgb3IgbnVsbCBmb3IgYSBub24tSlNPTiBwYXlsb2FkXG4gICAqIEBwYXJhbSB7Kn0gcmF3RXZlbnQgT3JpZ2luYWwgc29ja2V0IE1lc3NhZ2VFdmVudFxuICAgKi9cbiAgZGlzcGF0Y2gobWVzc2FnZSwgcmF3RXZlbnQpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5oYW5kbGVGcmFtZShtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyBGaXJlIGxpZmVjeWNsZSBjYWxsYmFja1xuICAgIGlmICh0aGlzLmV2ZW50c1snbWVzc2FnZSddKSB7XG4gICAgICB0aGlzLmV2ZW50c1snbWVzc2FnZSddLmJpbmQodGhpcykocmF3RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZyYW1lKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS5lcnJvciAmJiBtZXNzYWdlLmVycm9yLmxlbmd0aCkge1xuICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5ldmVudCkge1xuICAgICAgdGhpcy5oYW5kbGVNZW1iZXJIYW5kc2hha2UobWVzc2FnZSk7XG5cbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1ttZXNzYWdlLmV2ZW50XSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1ttZXNzYWdlLmV2ZW50XS5iaW5kKHRoaXMpKG1lc3NhZ2UuZGF0YSwgbWVzc2FnZS5tZXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJzWycqJ10pIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbJyonXS5iaW5kKHRoaXMpKG1lc3NhZ2UuZXZlbnQsIG1lc3NhZ2UuZGF0YSwgbWVzc2FnZS5tZXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVNZW1iZXJIYW5kc2hha2UobWVzc2FnZSkge1xuICAgIC8vIHY0IGRlbGl2ZXJzIHByZXNlbmNlIGFzIGRlbHRhczogbWVtYmVyX2pvaW5lZCAvIG1lbWJlcl9sZWZ0IGNhcnJ5IG9ubHkgdGhlXG4gICAgLy8gbWVtYmVyIHRoYXQgY2hhbmdlZCwgYW5kIHRoZSBmdWxsIHJvc3RlciBhcnJpdmVzIG9uY2UgYXMgbWVtYmVyX2xpc3QgKG9uXG4gICAgLy8gam9pbiBvciBpbiByZXNwb25zZSB0byBzeXN0ZW06OmdldF9tZW1iZXJzIC8gcmVmcmVzaE1lbWJlcnMoKSkuIHY0J3NcbiAgICAvLyBzeXN0ZW0gZXZlbnRzIGFyZSBkb3VibGUtY29sb24gKGBzeXN0ZW06OnhgKSBlbmQtdG8tZW5kOyB2MydzIHN0YXlcbiAgICAvLyBzaW5nbGUtY29sb24uIFBvcnRhbC9XZWJSVEMgZXZlbnRzIGJlbG93IGFyZSBhbHdheXMgdjMsIHNvIHVudG91Y2hlZC5cbiAgICBjb25zdCBkZWx0YVByZXNlbmNlID0gdGhpcy5pZGVudGl0eSAmJiB0aGlzLmlkZW50aXR5LnZlcnNpb24gPT0gNDtcbiAgICBjb25zdCBtZW1iZXJMaXN0RXZlbnQgPSBkZWx0YVByZXNlbmNlID8gJ3N5c3RlbTo6bWVtYmVyX2xpc3QnIDogJ3N5c3RlbTptZW1iZXJfbGlzdCc7XG4gICAgY29uc3QgbWVtYmVySm9pbmVkRXZlbnQgPSBkZWx0YVByZXNlbmNlID8gJ3N5c3RlbTo6bWVtYmVyX2pvaW5lZCcgOiAnc3lzdGVtOm1lbWJlcl9qb2luZWQnO1xuICAgIGNvbnN0IG1lbWJlckxlZnRFdmVudCA9IGRlbHRhUHJlc2VuY2UgPyAnc3lzdGVtOjptZW1iZXJfbGVmdCcgOiAnc3lzdGVtOm1lbWJlcl9sZWZ0JztcblxuICAgIGlmIChtZXNzYWdlLmV2ZW50ID09IG1lbWJlckxpc3RFdmVudCkge1xuICAgICAgdGhpcy5tZW1iZXJzID0gQXJyYXkuaXNBcnJheShtZXNzYWdlLmRhdGEubWVtYmVycykgPyBtZXNzYWdlLmRhdGEubWVtYmVycyA6IFtdO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSBtZW1iZXJKb2luZWRFdmVudCkge1xuICAgICAgaWYgKGRlbHRhUHJlc2VuY2UpIHtcbiAgICAgICAgdGhpcy5hZGRNZW1iZXIobWVzc2FnZS5kYXRhLm1lbWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1lbWJlcnMgPSBtZXNzYWdlLmRhdGEubWVtYmVycztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gbWVtYmVyTGVmdEV2ZW50KSB7XG4gICAgICBpZiAoZGVsdGFQcmVzZW5jZSkge1xuICAgICAgICB0aGlzLnJlbW92ZU1lbWJlcihtZXNzYWdlLmRhdGEubWVtYmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWVtYmVycyA9IG1lc3NhZ2UuZGF0YS5tZW1iZXJzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucG9ydGFsICYmIG1lc3NhZ2UuZGF0YS5tZW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3J0YWwucmVtb3ZlUGFydGljaXBhbnQobWVzc2FnZS5kYXRhLm1lbWJlci51dWlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTpwb3J0YWxfYnJvYWRjYXN0ZXInICYmIG1lc3NhZ2UuZGF0YS5mcm9tICE9IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwucmVxdWVzdE9mZmVyRnJvbVBlZXIobWVzc2FnZS5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTpzdG9wcGVkX3NjcmVlbicgJiYgbWVzc2FnZS5kYXRhLmZyb20gIT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5vblJlbW90ZVNjcmVlblN0b3BwZWQobWVzc2FnZS5kYXRhLmZyb20sIG1lc3NhZ2UuZGF0YS5zdHJlYW1JZCk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmV2ZW50ID09ICdzeXN0ZW06cG9ydGFsX3dhdGNoZXInICYmIG1lc3NhZ2UuZGF0YS5mcm9tICE9IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuc2hhcmVWaWRlbyhtZXNzYWdlLmRhdGEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOnZpZGVvX3JlcXVlc3QnICYmIG1lc3NhZ2UuZGF0YS5mcm9tICE9IHRoaXMudXVpZCkge1xuICAgICAgdGhpcy5wb3J0YWwuc2hhcmVWaWRlbyhtZXNzYWdlLmRhdGEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOnBvcnRhbF9jYW5kaWRhdGUnICYmIG1lc3NhZ2UuZGF0YS50byA9PSB0aGlzLnV1aWQpIHtcbiAgICAgIHRoaXMucG9ydGFsLmFkZEljZUNhbmRpZGF0ZShtZXNzYWdlLmRhdGEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PSAnc3lzdGVtOnZpZGVvX29mZmVyJyAmJiBtZXNzYWdlLmRhdGEudG8gPT0gdGhpcy51dWlkKSB7XG4gICAgICB0aGlzLnBvcnRhbC5jcmVhdGVBbnN3ZXIobWVzc2FnZS5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZXZlbnQgPT0gJ3N5c3RlbTp2aWRlb19hbnN3ZXInICYmIG1lc3NhZ2UuZGF0YS50byA9PSB0aGlzLnV1aWQpIHtcbiAgICAgIHRoaXMucG9ydGFsLmhhbmRsZUFuc3dlcihtZXNzYWdlLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIG9uT3BlbihlKSB7XG4gICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIGNvbm5lY3RlZDonLCBlKTtcbiAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IHRydWU7XG5cbiAgICAvLyBTeXN0ZW0gaW5pdCBjYWxsYmFja1xuICAgIHRoaXMub25Tb2NrZXRDb25uZWN0ZWQoZSk7XG4gIH1cblxuICBvbkVycm9yKGUpIHtcbiAgICB0aGlzLmxvZ2dlci5lcnJvcignQ2hhbm5lbCBlcnJvcjonLCBlKTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcblxuICAgIC8vIFN5c3RlbSBpbml0IGVycm9yIGNhbGxiYWNrXG4gICAgdGhpcy5vblNvY2tldEVycm9yKGUpO1xuXG4gICAgLy8gVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICB0aGlzLmV2ZW50c1snZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xvc2UoZSkge1xuICAgIHRoaXMubG9nZ2VyLndhcm4oJ0NoYW5uZWwgY2xvc2VkOicsIGUpO1xuICAgIHRoaXMucmVjb25uZWN0KCk7XG5cbiAgICAvLyBVc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICBpZiAodGhpcy5ldmVudHNbJ2Nsb3NlJ10pIHtcbiAgICAgIHRoaXMuZXZlbnRzWydjbG9zZSddLmJpbmQodGhpcykoZSk7XG4gICAgfVxuICB9XG5cbiAgcmVjb25uZWN0KCkge1xuICAgIGlmICghdGhpcy5zaG91bGRSZWNvbm5lY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIubG9nKCdSZWNvbm5lY3RpbmcnKTtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3QoKTtcbiAgfVxufVxuIiwiaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgU29ja2V0IGZyb20gJy4vbWlzYy9XZWJTb2NrZXQuanMnO1xuXG5jb25zdCBDT05UUk9MX1RJTUVPVVRfTVMgPSAxMDAwMDtcblxuLy8gc2V0VGltZW91dCBpbiBOb2RlIHJldHVybnMgYSBUaW1lb3V0IHdpdGggdW5yZWYoKTsgaW4gYnJvd3NlcnMgaXQgcmV0dXJucyBhXG4vLyBudW1iZXIuIEtlZXAgYSBwZW5kaW5nIGNvbnRyb2wgZnJhbWUgZnJvbSBob2xkaW5nIGEgTm9kZSBwcm9jZXNzIG9wZW4uXG5jb25zdCB0aW1lb3V0ID0gKGZuLCBtcykgPT4ge1xuICBjb25zdCB0ID0gc2V0VGltZW91dChmbiwgbXMpO1xuICBpZiAodCAmJiB0eXBlb2YgdC51bnJlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHQudW5yZWYoKTtcbiAgfVxuICByZXR1cm4gdDtcbn07XG5cbi8qKlxuICogQSBzaW5nbGUgV2ViU29ja2V0IHNoYXJlZCBieSBtYW55IHtAbGluayBDaGFubmVsfSBoYW5kbGVzIChQaWVTb2NrZXQgdjQpLlxuICpcbiAqIFRoZSBjaGFubmVsIG5hbWVkIGluIHRoZSBjb25uZWN0IFVSTCBpcyB0aGUgXCJwcmltYXJ5XCIg4oCUIGl0cyBsaWZlY3ljbGUgaXMgdGhlXG4gKiBzb2NrZXQncyBsaWZlY3ljbGUuIEV2ZXJ5IG90aGVyIGNoYW5uZWwgaXMgc3Vic2NyaWJlZCB3aXRoIGFcbiAqIGBzeXN0ZW06OnN1YnNjcmliZWAgY29udHJvbCBmcmFtZSBhbmQgcmlkZXMgdGhlIHNhbWUgc29ja2V0OyBvdXRib3VuZCBmcmFtZXNcbiAqIGZvciBpdCBhcmUgdGFnZ2VkIHdpdGggYHN5c3RlbTo6Y2hhbm5lbGAsIGFuZCBpbmJvdW5kIGZyYW1lcyBhcmUgcm91dGVkIGJhY2tcbiAqIHRvIGl0IGJ5IHRoZSBgc3lzdGVtOjpjaGFubmVsYCAvIGBkYXRhLmNoYW5uZWxgIHRoZSBzZXJ2ZXIgc3RhbXBzIG9uIHRoZW0uXG4gKlxuICogQWxsIHY0IGNvbnRyb2wvc3lzdGVtIGV2ZW50cyBhcmUgYHN5c3RlbTo6eGAgKGRvdWJsZSBjb2xvbiksIG9uIHRoZSB3aXJlXG4gKiBhbmQgaW4gdGhlIGZyYW1lcyBoYW5kZWQgdG8gQ2hhbm5lbCDigJQgaW5jbHVkaW5nIHRoZSBldmVudCBuYW1lIGFwcCBjb2RlXG4gKiBwYXNzZXMgdG8gYGNoYW5uZWwubGlzdGVuKC4uLilgLiBUaGlzIG1hdGNoZXMgdGhlIGBzeXN0ZW06OmNoYW5uZWxgIC9cbiAqIGBzeXN0ZW06OnRvYCBmaWVsZCBjb252ZW50aW9uIGFuZCBrZWVwcyB2NCBjb25zaXN0ZW50bHkgZG91YmxlLWNvbG9uXG4gKiBlbmQtdG8tZW5kOyB2MydzIHNpbmdsZS1jb2xvbiBldmVudHMgKGBzeXN0ZW06bWVtYmVyX2pvaW5lZGAsIGV0Yy4pIGFyZSBhXG4gKiBzZXBhcmF0ZSwgdW50b3VjaGVkIGNvbnZlbnRpb24gdGhhdCBDaGFubmVsIHN0aWxsIHNwZWFrcyBuYXRpdmVseS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBvcHRpb25zLCBwcmltYXJ5Q2hhbm5lbElkKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIodGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnByaW1hcnlDaGFubmVsSWQgPSBwcmltYXJ5Q2hhbm5lbElkO1xuXG4gICAgdGhpcy5jaGFubmVscyA9IHt9OyAvLyBjaGFubmVsSWQgLT4gQ2hhbm5lbFxuICAgIHRoaXMucGVuZGluZyA9IHt9OyAvLyBjaGFubmVsSWQgLT4geyByZXNvbHZlLCByZWplY3QsIHRpbWVyLCBwYXJhbXMgfVxuICAgIHRoaXMubWVtYmVyUmVxdWVzdHMgPSB7fTsgLy8gY2hhbm5lbElkIC0+IFt7IHJlc29sdmUsIHJlamVjdCwgdGltZXIgfV1cblxuICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICB0aGlzLl9taWdyYXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9vcGVuZWRPbmNlID0gZmFsc2U7XG5cbiAgICAvLyBTZXQgYnkgUGllU29ja2V0IHRvIHNldHRsZSB0aGUgZmlyc3Qgc3Vic2NyaWJlKCkgcHJvbWlzZS5cbiAgICB0aGlzLm9uUHJpbWFyeUNvbm5lY3RlZCA9ICgpID0+IHt9O1xuICAgIHRoaXMub25QcmltYXJ5RXJyb3IgPSAoKSA9PiB7fTtcblxuICAgIHRoaXMuY29ubmVjdChlbmRwb2ludCk7XG4gIH1cblxuICBjb25uZWN0KGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50KSB7XG4gICAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc29ja2V0ID0gbmV3IFNvY2tldCh0aGlzLmVuZHBvaW50KTtcbiAgICB0cnkge1xuICAgICAgc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFNvbWUgZW52aXJvbm1lbnRzIGV4cG9zZSBhIHJlYWQtb25seSBiaW5hcnlUeXBlIOKAlCBpZ25vcmUuXG4gICAgfVxuICAgIHNvY2tldC5vbm9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHNvY2tldC5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgc29ja2V0Lm9uY2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgIHJldHVybiBzb2NrZXQ7XG4gIH1cblxuICBpc1ByaW1hcnkoY2hhbm5lbElkKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxJZCA9PT0gdGhpcy5wcmltYXJ5Q2hhbm5lbElkO1xuICB9XG5cbiAgYXR0YWNoQ2hhbm5lbChjaGFubmVsSWQsIGNoYW5uZWwpIHtcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICB9XG5cbiAgZGV0YWNoQ2hhbm5lbChjaGFubmVsSWQpIHtcbiAgICBkZWxldGUgdGhpcy5jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgIHRoaXMuX3NldHRsZU1lbWJlclJlcXVlc3RzKGNoYW5uZWxJZCwgJ3JlamVjdCcsIG5ldyBFcnJvcignQ2hhbm5lbCBkZXRhY2hlZCcpKTtcbiAgfVxuXG4gIC8vID09PT09IE91dGJvdW5kID09PT09XG5cbiAgc2VuZENvbnRyb2woZXZlbnQsIGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7ZXZlbnQ6IGV2ZW50LCBkYXRhOiBkYXRhfSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdQaWVTb2NrZXQ6IGNvbnRyb2wgZnJhbWUgc2VuZCBmYWlsZWQnLCBlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhbiBhcHBsaWNhdGlvbiBmcmFtZSBvbiBiZWhhbGYgb2YgYGNoYW5uZWxJZGAuIEFjY2VwdHMgZWl0aGVyIGFuXG4gICAqIG9iamVjdCAoZnJvbSBDaGFubmVsI3B1Ymxpc2gpIG9yIGEgcHJlLXNlcmlhbGlzZWQgc3RyaW5nIChyYXcgQ2hhbm5lbCNzZW5kXG4gICAqIC8gYmxvY2tjaGFpbiBwYXlsb2FkcykuIFNlY29uZGFyeSBjaGFubmVscyBnZXQgYSBgc3lzdGVtOjpjaGFubmVsYCB0YWcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFubmVsSWRcbiAgICogQHBhcmFtIHsob2JqZWN0fHN0cmluZyl9IGRhdGFcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIHNlbmQoY2hhbm5lbElkLCBkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5pc1ByaW1hcnkoY2hhbm5lbElkKSA/XG4gICAgICAgIGRhdGEgOlxuICAgICAgICB7Li4uZGF0YSwgJ3N5c3RlbTo6Y2hhbm5lbCc6IGNoYW5uZWxJZH07XG4gICAgICByZXR1cm4gdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzUHJpbWFyeShjaGFubmVsSWQpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgb2JqWydzeXN0ZW06OmNoYW5uZWwnXSA9IGNoYW5uZWxJZDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBOb3QgSlNPTiDigJQgZmFsbCB0aHJvdWdoIGFuZCBzZW5kIHZlcmJhdGltLlxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNvY2tldC5zZW5kKGRhdGEpO1xuICB9XG5cbiAgLy8gPT09PT0gU3Vic2NyaXB0aW9uIGNvbnRyb2wgPT09PT1cblxuICBzdWJzY3JpYmVDaGFubmVsKGNoYW5uZWxJZCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnBlbmRpbmdbY2hhbm5lbElkXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgc3lzdGVtOjpzdWJzY3JpYmUgdGltZWQgb3V0IGZvciBcIiR7Y2hhbm5lbElkfVwiYCkpO1xuICAgICAgfSwgQ09OVFJPTF9USU1FT1VUX01TKTtcblxuICAgICAgdGhpcy5wZW5kaW5nW2NoYW5uZWxJZF0gPSB7cmVzb2x2ZSwgcmVqZWN0LCB0aW1lciwgcGFyYW1zfTtcblxuICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VuZENvbnRyb2woJ3N5c3RlbTo6c3Vic2NyaWJlJywgcGFyYW1zKTtcbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSBvbk9wZW4oKSByZXBsYXlzIGV2ZXJ5IHBlbmRpbmcgc3Vic2NyaWJlLlxuICAgIH0pO1xuICB9XG5cbiAgdW5zdWJzY3JpYmVDaGFubmVsKGNoYW5uZWxJZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ByaW1hcnkoY2hhbm5lbElkKSkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdDYW5ub3QgdW5zdWJzY3JpYmUgdGhlIHByaW1hcnkgY2hhbm5lbCBkaXJlY3RseScpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0aW1lciA9IHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkZWxldGUgdGhpcy5wZW5kaW5nW2NoYW5uZWxJZF07XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0sIENPTlRST0xfVElNRU9VVF9NUyk7XG5cbiAgICAgIHRoaXMucGVuZGluZ1tjaGFubmVsSWRdID0ge3Jlc29sdmUsIHJlamVjdCwgdGltZXJ9O1xuICAgICAgdGhpcy5zZW5kQ29udHJvbCgnc3lzdGVtOjp1bnN1YnNjcmliZScsIHtjaGFubmVsOiBjaGFubmVsSWR9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVlc3RNZW1iZXJzKGNoYW5uZWxJZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMubWVtYmVyUmVxdWVzdHNbY2hhbm5lbElkXSkge1xuICAgICAgICB0aGlzLm1lbWJlclJlcXVlc3RzW2NoYW5uZWxJZF0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGltZXIgPSB0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2V0dGxlTWVtYmVyUmVxdWVzdHMoXG4gICAgICAgICAgICBjaGFubmVsSWQsXG4gICAgICAgICAgICAncmVqZWN0JyxcbiAgICAgICAgICAgIG5ldyBFcnJvcihgc3lzdGVtOjpnZXRfbWVtYmVycyB0aW1lZCBvdXQgZm9yIFwiJHtjaGFubmVsSWR9XCJgKSxcbiAgICAgICAgKTtcbiAgICAgIH0sIENPTlRST0xfVElNRU9VVF9NUyk7XG5cbiAgICAgIHRoaXMubWVtYmVyUmVxdWVzdHNbY2hhbm5lbElkXS5wdXNoKHtyZXNvbHZlLCByZWplY3QsIHRpbWVyfSk7XG4gICAgICB0aGlzLnNlbmRDb250cm9sKCdzeXN0ZW06OmdldF9tZW1iZXJzJywge2NoYW5uZWw6IGNoYW5uZWxJZH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlLW9wZW4gdGhlIHNvY2tldCB3aXRoIGBuZXdQcmltYXJ5SWRgIGFzIHRoZSBwcmltYXJ5IGNoYW5uZWwsIGtlZXBpbmcgZXZlcnlcbiAgICogb3RoZXIgc3Vic2NyaXB0aW9uLiBVc2VkIHdoZW4gdGhlIGN1cnJlbnQgcHJpbWFyeSBpcyB1bnN1YnNjcmliZWQuIEZyYW1lcyBpblxuICAgKiBmbGlnaHQgZHVyaW5nIHRoZSBzd2FwIG1heSBiZSBtaXNzZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdQcmltYXJ5SWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IE5ldyBwcmltYXJ5IGNvbm5lY3QgVVJMXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBtaWdyYXRlUHJpbWFyeShuZXdQcmltYXJ5SWQsIGVuZHBvaW50KSB7XG4gICAgdGhpcy5fbWlncmF0aW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IG9sZCA9IHRoaXMuc29ja2V0O1xuICAgIHRyeSB7XG4gICAgICBvbGQub25jbG9zZSA9ICgpID0+IHt9O1xuICAgICAgb2xkLm9ubWVzc2FnZSA9ICgpID0+IHt9O1xuICAgICAgb2xkLmNsb3NlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuXG4gICAgdGhpcy5wcmltYXJ5Q2hhbm5lbElkID0gbmV3UHJpbWFyeUlkO1xuICAgIGlmICh0aGlzLmNoYW5uZWxzW25ld1ByaW1hcnlJZF0pIHtcbiAgICAgIC8vIFRoZSBuZXcgcHJpbWFyeSBpcyBzdWJzY3JpYmVkIHZpYSB0aGUgVVJMIG5vdywgbm90IGEgY29udHJvbCBmcmFtZS5cbiAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW25ld1ByaW1hcnlJZF0uc3Vic2NyaWJlUGFyYW1zO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb25uZWN0KGVuZHBvaW50KTtcbiAgICB0aGlzLl9taWdyYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICB9XG5cbiAgLy8gPT09PT0gU29ja2V0IGV2ZW50cyA9PT09PVxuXG4gIG9uT3BlbihlKSB7XG4gICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgIC8vIFJlcGxheSBldmVyeSBzZWNvbmRhcnkgc3Vic2NyaXB0aW9uIChyZWNvbm5lY3QgLyBwcmltYXJ5IG1pZ3JhdGlvbikuXG4gICAgT2JqZWN0LmtleXModGhpcy5jaGFubmVscykuZm9yRWFjaCgoY2hhbm5lbElkKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ByaW1hcnkoY2hhbm5lbElkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxJZF0uc3Vic2NyaWJlUGFyYW1zO1xuICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICB0aGlzLnNlbmRDb250cm9sKCdzeXN0ZW06OnN1YnNjcmliZScsIHBhcmFtcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYXkgc3Vic2NyaWJlcyB0aGF0IHdlcmUgc3RpbGwgaW4gZmxpZ2h0IGFjcm9zcyBhIHJlY29ubmVjdC5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnBlbmRpbmcpLmZvckVhY2goKGNoYW5uZWxJZCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGVuZGluZ1tjaGFubmVsSWRdLnBhcmFtcykge1xuICAgICAgICB0aGlzLnNlbmRDb250cm9sKCdzeXN0ZW06OnN1YnNjcmliZScsIHRoaXMucGVuZGluZ1tjaGFubmVsSWRdLnBhcmFtcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXR0bGUgdGhlIGZpcnN0IHN1YnNjcmliZSgpIHByb21pc2UgZXhhY3RseSBvbmNlIOKAlCBhIHJlY29ubmVjdCBvciBhXG4gICAgLy8gcHJpbWFyeSBtaWdyYXRpb24gbXVzdCBub3QgcmUtcnVuIHRoYXQgY2xvc3VyZSAoaXQgY2FwdHVyZWQgdGhlIG9yaWdpbmFsXG4gICAgLy8gcHJpbWFyeSBjaGFubmVsKS5cbiAgICBpZiAoIXRoaXMuX29wZW5lZE9uY2UpIHtcbiAgICAgIHRoaXMuX29wZW5lZE9uY2UgPSB0cnVlO1xuICAgICAgdGhpcy5vblByaW1hcnlDb25uZWN0ZWQoZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJpbWFyeSA9IHRoaXMuY2hhbm5lbHNbdGhpcy5wcmltYXJ5Q2hhbm5lbElkXTtcbiAgICBpZiAocHJpbWFyeSAmJiB0eXBlb2YgcHJpbWFyeS5vbk9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByaW1hcnkub25PcGVuKGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uTWVzc2FnZShlKSB7XG4gICAgbGV0IG1lc3NhZ2U7XG4gICAgdHJ5IHtcbiAgICAgIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgfSBjYXRjaCAoanNvbkV4Y2VwdGlvbikge1xuICAgICAgY29uc3QgcHJpbWFyeSA9IHRoaXMuY2hhbm5lbHNbdGhpcy5wcmltYXJ5Q2hhbm5lbElkXTtcbiAgICAgIGlmIChwcmltYXJ5KSB7XG4gICAgICAgIHByaW1hcnkuZGlzcGF0Y2gobnVsbCwgZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnQgPSBtZXNzYWdlICYmIG1lc3NhZ2UuZXZlbnQ7XG5cbiAgICBpZiAoXG4gICAgICBldmVudCA9PT0gJ3N5c3RlbTo6c3Vic2NyaWJlX3N1Y2Nlc3MnIHx8XG4gICAgICBldmVudCA9PT0gJ3N5c3RlbTo6c3Vic2NyaWJlX2Vycm9yJyB8fFxuICAgICAgZXZlbnQgPT09ICdzeXN0ZW06OnVuc3Vic2NyaWJlX3N1Y2Nlc3MnIHx8XG4gICAgICBldmVudCA9PT0gJ3N5c3RlbTo6dW5zdWJzY3JpYmVfZXJyb3InXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGxlQ29udHJvbChtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQgPT09ICdzeXN0ZW06Om1lbWJlcl9saXN0X2Vycm9yJykge1xuICAgICAgY29uc3QgY2hhbm5lbElkID0gKG1lc3NhZ2UuZGF0YSAmJiBtZXNzYWdlLmRhdGEuY2hhbm5lbCkgfHwgdGhpcy5wcmltYXJ5Q2hhbm5lbElkO1xuICAgICAgcmV0dXJuIHRoaXMuX3NldHRsZU1lbWJlclJlcXVlc3RzKFxuICAgICAgICAgIGNoYW5uZWxJZCxcbiAgICAgICAgICAncmVqZWN0JyxcbiAgICAgICAgICBuZXcgRXJyb3IoKG1lc3NhZ2UuZGF0YSAmJiBtZXNzYWdlLmRhdGEuZXJyb3IpIHx8ICdDb3VsZCBub3QgZmV0Y2ggbWVtYmVycycpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQgPT09ICdzeXN0ZW06OmJpbmFyeScpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxJZCA9IG1lc3NhZ2VbJ3N5c3RlbTo6Y2hhbm5lbCddIHx8IHRoaXMucHJpbWFyeUNoYW5uZWxJZDtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxJZF0gfHwgdGhpcy5jaGFubmVsc1t0aGlzLnByaW1hcnlDaGFubmVsSWRdO1xuICAgICAgaWYgKGNoYW5uZWwpIHtcbiAgICAgICAgY2hhbm5lbC5kaXNwYXRjaChcbiAgICAgICAgICAgIHtldmVudDogJ3N5c3RlbTo6YmluYXJ5JywgZGF0YTogdGhpcy5fZGVjb2RlQmFzZTY0KG1lc3NhZ2UuZGF0YSksIG1ldGE6IG1lc3NhZ2UubWV0YX0sXG4gICAgICAgICAgICBlLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5uZWxJZCA9XG4gICAgICBtZXNzYWdlWydzeXN0ZW06OmNoYW5uZWwnXSB8fFxuICAgICAgKG1lc3NhZ2UuZGF0YSAmJiBtZXNzYWdlLmRhdGEuY2hhbm5lbCkgfHxcbiAgICAgIHRoaXMucHJpbWFyeUNoYW5uZWxJZDtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsSWRdIHx8IHRoaXMuY2hhbm5lbHNbdGhpcy5wcmltYXJ5Q2hhbm5lbElkXTtcbiAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjaGFubmVsLmRpc3BhdGNoKG1lc3NhZ2UsIGUpO1xuXG4gICAgaWYgKGV2ZW50ID09PSAnc3lzdGVtOjptZW1iZXJfbGlzdCcpIHtcbiAgICAgIHRoaXMuX3NldHRsZU1lbWJlclJlcXVlc3RzKGNoYW5uZWxJZCwgJ3Jlc29sdmUnLCBjaGFubmVsLm1lbWJlcnMpO1xuICAgIH1cbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKCdQaWVTb2NrZXQ6IGNvbm5lY3Rpb24gZXJyb3InLCBlKTtcblxuICAgIGlmICghdGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMub25QcmltYXJ5RXJyb3IoZSk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXModGhpcy5jaGFubmVscykuZm9yRWFjaCgoY2hhbm5lbElkKSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgICAgaWYgKGNoYW5uZWwuZXZlbnRzICYmIGNoYW5uZWwuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICAgIGNoYW5uZWwuZXZlbnRzWydlcnJvciddLmJpbmQoY2hhbm5lbCkoZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgfVxuXG4gIG9uQ2xvc2UoZSkge1xuICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmNoYW5uZWxzKS5mb3JFYWNoKChjaGFubmVsSWQpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxJZF07XG4gICAgICBpZiAoY2hhbm5lbC5ldmVudHMgJiYgY2hhbm5lbC5ldmVudHNbJ2Nsb3NlJ10pIHtcbiAgICAgICAgY2hhbm5lbC5ldmVudHNbJ2Nsb3NlJ10uYmluZChjaGFubmVsKShlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnNob3VsZFJlY29ubmVjdCAmJiAhdGhpcy5fbWlncmF0aW5nKSB7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ1BpZVNvY2tldDogcmVjb25uZWN0aW5nIG11bHRpcGxleGVkIGNvbm5lY3Rpb24nKTtcbiAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vID09PT09IEludGVybmFscyA9PT09PVxuXG4gIF9zZXR0bGVDb250cm9sKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBjaGFubmVsSWQgPSBtZXNzYWdlLmRhdGEgJiYgbWVzc2FnZS5kYXRhLmNoYW5uZWw7XG4gICAgY29uc3QgZW50cnkgPSBjaGFubmVsSWQgJiYgdGhpcy5wZW5kaW5nW2NoYW5uZWxJZF07XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChlbnRyeS50aW1lcik7XG4gICAgZGVsZXRlIHRoaXMucGVuZGluZ1tjaGFubmVsSWRdO1xuXG4gICAgaWYgKG1lc3NhZ2UuZXZlbnQuZW5kc1dpdGgoJ19zdWNjZXNzJykpIHtcbiAgICAgIGVudHJ5LnJlc29sdmUobWVzc2FnZS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cnkucmVqZWN0KG5ldyBFcnJvcigobWVzc2FnZS5kYXRhICYmIG1lc3NhZ2UuZGF0YS5lcnJvcikgfHwgbWVzc2FnZS5ldmVudCkpO1xuICAgIH1cbiAgfVxuXG4gIF9zZXR0bGVNZW1iZXJSZXF1ZXN0cyhjaGFubmVsSWQsIGhvdywgdmFsdWUpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5tZW1iZXJSZXF1ZXN0c1tjaGFubmVsSWRdO1xuICAgIGlmICghbGlzdCB8fCAhbGlzdC5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMubWVtYmVyUmVxdWVzdHNbY2hhbm5lbElkXTtcbiAgICBsaXN0LmZvckVhY2goKHtyZXNvbHZlLCByZWplY3QsIHRpbWVyfSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIGlmIChob3cgPT09ICdyZXNvbHZlJykge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfZGVjb2RlQmFzZTY0KGI2NCkge1xuICAgIGlmICh0eXBlb2YgYjY0ICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGI2NDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBiaW4gPSBhdG9iKGI2NCk7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJpbi5sZW5ndGgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcy5idWZmZXI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgQnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGI2NCwgJ2Jhc2U2NCcpO1xuICAgIH1cbiAgICByZXR1cm4gYjY0O1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZhbGlkQXV0aEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U9bnVsbCwgbmFtZT0nSW52YWxpZEF1dGhFeGNlcHRpb24nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnQXV0aCBlbmRwb2ludCBkaWQgbm90IHJldHVybiBhIHZhbGlkIEpXVCBUb2tlbiwgcGxlYXNlIHNlZTogaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9kb2NzLzMuMC9hdXRoZW50aWNhdGlvbic7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBsb2coLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm4oLi4uZGF0YSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBlcnJvciguLi5kYXRhKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL0Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgUG9ydGFsIGZyb20gJy4vUG9ydGFsLmpzJztcbmltcG9ydCBJbnZhbGlkQXV0aEV4Y2VwdGlvbiBmcm9tICcuL0ludmFsaWRBdXRoRXhjZXB0aW9uLmpzJztcbmltcG9ydCBkZWZhdWx0T3B0aW9ucyBmcm9tICcuL21pc2MvRGVmYXVsdE9wdGlvbnMuanMnO1xuaW1wb3J0IHt2NCBhcyB1dWlkdjR9IGZyb20gJ3V1aWQnO1xuXG5jb25zdCBTREtfVkVSU0lPTiA9ICc1LjQuMCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9O1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgc3Vic2NyaWJlKGNoYW5uZWxJZCwgcm9vbU9wdGlvbnM9e30pIHtcbiAgICBjb25zdCBpc1BvcnRhbCA9ICEhKHJvb21PcHRpb25zLnZpZGVvIHx8IHJvb21PcHRpb25zLmF1ZGlvIHx8IHJvb21PcHRpb25zLnBvcnRhbCk7XG5cbiAgICAvLyB2NCBtdWx0aS1jaGFubmVsOiBvbmUgc2hhcmVkIFdlYlNvY2tldCBmb3IgZXZlcnkgc3Vic2NyaWJlKCkgY2FsbC4gUG9ydGFsc1xuICAgIC8vIGtlZXAgYSBkZWRpY2F0ZWQgc3RhbmRhbG9uZSBjb25uZWN0aW9uIOKAlCBXZWJSVEMgc2lnbmFsbGluZyBpcyAxOjEuXG4gICAgaWYgKHRoaXMub3B0aW9ucy52ZXJzaW9uID09IDQgJiYgIWlzUG9ydGFsKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVNdWx0aXBsZXhlZChjaGFubmVsSWQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmliZVN0YW5kYWxvbmUoY2hhbm5lbElkLCByb29tT3B0aW9ucywgaXNQb3J0YWwpO1xuICB9XG5cbiAgc3Vic2NyaWJlU3RhbmRhbG9uZShjaGFubmVsSWQsIHJvb21PcHRpb25zLCBpc1BvcnRhbCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoaXNQb3J0YWwpIHtcbiAgICAgICAgLy8gRm9yY2UgY29uZmlnIHdoZW4gdmlkZW8gaXMgcmVxdWlyZWRcbiAgICAgICAgdGhpcy5vcHRpb25zLm5vdGlmeVNlbGYgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1dWlkID0gdXVpZHY0KCk7XG4gICAgICAvLyBQb3J0YWxzIGFsd2F5cyBzcGVhayB0aGUgdjMgcHJvdG9jb2wgZXZlbiB3aGVuIHZlcnNpb246NCBpcyBjb25maWd1cmVkLlxuICAgICAgY29uc3QgdmVyc2lvbiA9IGlzUG9ydGFsICYmIHRoaXMub3B0aW9ucy52ZXJzaW9uID09IDQgPyAzIDogdGhpcy5vcHRpb25zLnZlcnNpb247XG4gICAgICBjb25zdCBlbmRwb2ludCA9IGF3YWl0IHRoaXMuZ2V0RW5kcG9pbnQoY2hhbm5lbElkLCB1dWlkLCB2ZXJzaW9uKTtcblxuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ1JldHVybmluZyBleGlzdGluZyBjaGFubmVsJywgY2hhbm5lbElkKTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdDcmVhdGluZyBuZXcgY2hhbm5lbCcsIGNoYW5uZWxJZCk7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBuZXcgQ2hhbm5lbChlbmRwb2ludCwge1xuICAgICAgICAgIGNoYW5uZWxJZDogY2hhbm5lbElkLFxuICAgICAgICAgIG9uU29ja2V0Q29ubmVjdGVkOiAoKSA9PiB7XG4gICAgICAgICAgICBjaGFubmVsLnV1aWQgPSB1dWlkO1xuICAgICAgICAgICAgaWYgKGlzUG9ydGFsKSB7XG4gICAgICAgICAgICAgIGNoYW5uZWwucG9ydGFsID0gbmV3IFBvcnRhbChjaGFubmVsLCB7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIC4uLnJvb21PcHRpb25zLFxuICAgICAgICAgICAgICB9KTsgYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICAgICAgcmVzb2x2ZShjaGFubmVsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uU29ja2V0RXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCgnRmFpbGVkIHRvIG1ha2Ugd2Vic29ja2V0IGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgICAvLyBQb3J0YWxzIGFyZSBmb3JjZWQgb250byB0aGUgdjMgc29ja2V0IGFib3ZlIGV2ZW4gd2hlblxuICAgICAgICAgIC8vIG9wdGlvbnMudmVyc2lvbiBpcyA0IOKAlCB0aGUgaWRlbnRpdHkgbXVzdCBhZ3JlZSwgb3IgQ2hhbm5lbCdzXG4gICAgICAgICAgLy8gZGVsdGEtcHJlc2VuY2UgbG9naWMgbGlzdGVucyBmb3IgdjQncyBkb3VibGUtY29sb24gbWVtYmVyIGV2ZW50c1xuICAgICAgICAgIC8vIG9uIGEgc29ja2V0IHRoYXQgb25seSBldmVyIHNlbmRzIHYzJ3Mgc2luZ2xlLWNvbG9uIG9uZXMuXG4gICAgICAgICAgdmVyc2lvbixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBXZWJTb2NrZXQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlcyB0aGUgcHJvbWlzZSBpbiBjYXNlIFdlYlNvY2tldCBpcyBub3QgZGVmaW5lZFxuICAgICAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgICByZXNvbHZlKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzdWJzY3JpYmVNdWx0aXBsZXhlZChjaGFubmVsSWQpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ1JldHVybmluZyBleGlzdGluZyBjaGFubmVsJywgY2hhbm5lbElkKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF07XG4gICAgfVxuXG4gICAgY29uc3QgdXVpZCA9IHV1aWR2NCgpO1xuICAgIGNvbnN0IHByZXNlbmNlID1cbiAgICAgIHRoaXMub3B0aW9ucy5wcmVzZW5jZSA9PSAxIHx8XG4gICAgICB0aGlzLm9wdGlvbnMucHJlc2VuY2UgPT09IHRydWUgfHxcbiAgICAgICgnJyArIGNoYW5uZWxJZCkuc3RhcnRzV2l0aCgncHJlc2VuY2UtJyk7XG4gICAgY29uc3Qgbm9XZWJTb2NrZXQgPSB0eXBlb2YgV2ViU29ja2V0ID09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gRmlyc3Qgc3Vic2NyaXB0aW9uIG9wZW5zIHRoZSBzaGFyZWQgc29ja2V0LCB3aXRoIHRoaXMgY2hhbm5lbCBhc1xuICAgIC8vIHByaW1hcnkuIFR3byBzdWJzY3JpYmUoKSBjYWxscyBmaXJlZCB3aXRob3V0IGF3YWl0aW5nIGVhY2ggb3RoZXIgKGUuZy5cbiAgICAvLyBQcm9taXNlLmFsbCByaWdodCBhZnRlciBjb25zdHJ1Y3Rpb24pIHdvdWxkIG90aGVyd2lzZSBib3RoIG9ic2VydmVcbiAgICAvLyBgX211bHRpcGxleGAgdW5zZXQg4oCUIGJlZm9yZSBlaXRoZXIncyBgZ2V0RW5kcG9pbnQoKWAgYXdhaXQgcmVzb2x2ZXMg4oCUXG4gICAgLy8gYW5kIGVhY2ggb3BlbiB0aGVpciBvd24gc29ja2V0LCBzaWxlbnRseSBvcnBoYW5pbmcgb25lLiBBIHJhY2luZyBjYWxsXG4gICAgLy8gd2FpdHMgb24gdGhlIGluLWZsaWdodCBvcGVuIGluc3RlYWQsIHRoZW4gcmV0cmllcyBhcyBhIHNlY29uZGFyeVxuICAgIC8vIHN1YnNjcmliZSBvbmNlIGBfbXVsdGlwbGV4YCBpcyBzZXQuXG4gICAgaWYgKCF0aGlzLl9tdWx0aXBsZXgpIHtcbiAgICAgIGlmICh0aGlzLl9tdWx0aXBsZXhPcGVuaW5nKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuX211bHRpcGxleE9wZW5pbmcuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVNdWx0aXBsZXhlZChjaGFubmVsSWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tdWx0aXBsZXhPcGVuaW5nID0gdGhpcy5fb3BlblByaW1hcnlDb25uZWN0aW9uKGNoYW5uZWxJZCwgdXVpZCwgcHJlc2VuY2UsIG5vV2ViU29ja2V0KVxuICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpcGxleE9wZW5pbmcgPSBudWxsO1xuICAgICAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxleE9wZW5pbmc7XG4gICAgfVxuXG4gICAgLy8gU2hhcmVkIHNvY2tldCBhbHJlYWR5IGV4aXN0cyDigJQgc3Vic2NyaWJlIHdpdGggYSBjb250cm9sIGZyYW1lLlxuICAgIGNvbnN0IGp3dCA9IGF3YWl0IHRoaXMucmVzb2x2ZUF1dGgoY2hhbm5lbElkKTtcbiAgICBjb25zdCBjaGFubmVsID0gbmV3IENoYW5uZWwobnVsbCwgbnVsbCwgZmFsc2UpO1xuICAgIGNoYW5uZWwuYXR0YWNoVG9Db25uZWN0aW9uKHRoaXMuX211bHRpcGxleCwgY2hhbm5lbElkLCB7Li4udGhpcy5vcHRpb25zLCBjaGFubmVsSWR9KTtcbiAgICBjaGFubmVsLnV1aWQgPSB1dWlkO1xuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuYnVpbGRTdWJzY3JpYmVQYXJhbXMoY2hhbm5lbElkLCBwcmVzZW5jZSwgdXVpZCwgand0KTtcbiAgICBjaGFubmVsLnN1YnNjcmliZVBhcmFtcyA9IHBhcmFtcztcblxuICAgIGlmICghbm9XZWJTb2NrZXQpIHtcbiAgICAgIGF3YWl0IHRoaXMuX211bHRpcGxleC5zdWJzY3JpYmVDaGFubmVsKGNoYW5uZWxJZCwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tdWx0aXBsZXguYXR0YWNoQ2hhbm5lbChjaGFubmVsSWQsIGNoYW5uZWwpO1xuICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSA9IGNoYW5uZWw7XG4gICAgcmV0dXJuIGNoYW5uZWw7XG4gIH1cblxuICBhc3luYyBfb3BlblByaW1hcnlDb25uZWN0aW9uKGNoYW5uZWxJZCwgdXVpZCwgcHJlc2VuY2UsIG5vV2ViU29ja2V0KSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSBhd2FpdCB0aGlzLmdldEVuZHBvaW50KGNoYW5uZWxJZCwgdXVpZCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY29ubiA9IG5ldyBDb25uZWN0aW9uKGVuZHBvaW50LCB0aGlzLm9wdGlvbnMsIGNoYW5uZWxJZCk7XG4gICAgICB0aGlzLl9tdWx0aXBsZXggPSBjb25uO1xuXG4gICAgICBjb25zdCBjaGFubmVsID0gbmV3IENoYW5uZWwobnVsbCwgbnVsbCwgZmFsc2UpO1xuICAgICAgY2hhbm5lbC5hdHRhY2hUb0Nvbm5lY3Rpb24oY29ubiwgY2hhbm5lbElkLCB7Li4udGhpcy5vcHRpb25zLCBjaGFubmVsSWR9KTtcbiAgICAgIGNoYW5uZWwudXVpZCA9IHV1aWQ7XG4gICAgICBjaGFubmVsLnN1YnNjcmliZVBhcmFtcyA9IHRoaXMuYnVpbGRTdWJzY3JpYmVQYXJhbXMoXG4gICAgICAgICAgY2hhbm5lbElkLCBwcmVzZW5jZSwgdXVpZCwgdGhpcy5vcHRpb25zLmp3dCB8fCBudWxsLFxuICAgICAgKTtcbiAgICAgIGNvbm4uYXR0YWNoQ2hhbm5lbChjaGFubmVsSWQsIGNoYW5uZWwpO1xuXG4gICAgICBjb25uLm9uUHJpbWFyeUNvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgcmVzb2x2ZShjaGFubmVsKTtcbiAgICAgIH07XG4gICAgICBjb25uLm9uUHJpbWFyeUVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9tdWx0aXBsZXggPSBudWxsO1xuICAgICAgICByZWplY3QoJ0ZhaWxlZCB0byBtYWtlIHdlYnNvY2tldCBjb25uZWN0aW9uJyk7XG4gICAgICB9O1xuXG4gICAgICBpZiAobm9XZWJTb2NrZXQpIHtcbiAgICAgICAgLy8gTWlycm9ycyBzdWJzY3JpYmVTdGFuZGFsb25lOiByZXNvbHZlIHdpdGhvdXQgd2FpdGluZyBmb3Igb25vcGVuLlxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICByZXNvbHZlKGNoYW5uZWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYnVpbGRTdWJzY3JpYmVQYXJhbXMoY2hhbm5lbElkLCBwcmVzZW5jZSwgdXVpZCwgand0KSB7XG4gICAgY29uc3QgcGFyYW1zID0ge2NoYW5uZWw6IGNoYW5uZWxJZCwgcHJlc2VuY2U6IHByZXNlbmNlLCB1dWlkOiB1dWlkfTtcbiAgICBpZiAoand0KSB7XG4gICAgICBwYXJhbXMuand0ID0gand0O1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnVzZXJJZCkge1xuICAgICAgcGFyYW1zLnVzZXIgPSB0aGlzLm9wdGlvbnMudXNlcklkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoY2hhbm5lbElkKSB7XG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyB2NCBtdWx0aXBsZXhlZCBoYW5kbGUg4oCUIG5vIHNvY2tldCBvZiBpdHMgb3duLlxuICAgIGlmICh0aGlzLl9tdWx0aXBsZXggJiYgY2hhbm5lbC5odWIpIHtcbiAgICAgIGNvbnN0IGNvbm4gPSB0aGlzLl9tdWx0aXBsZXg7XG5cbiAgICAgIGlmIChjaGFubmVsSWQgPT09IGNvbm4ucHJpbWFyeUNoYW5uZWxJZCkge1xuICAgICAgICBjb25zdCBvdGhlcnMgPSBPYmplY3Qua2V5cyhjb25uLmNoYW5uZWxzKS5maWx0ZXIoKGlkKSA9PiBpZCAhPT0gY2hhbm5lbElkKTtcbiAgICAgICAgaWYgKG90aGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb25uLmNsb3NlKCk7XG4gICAgICAgICAgdGhpcy5fbXVsdGlwbGV4ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBQcm9tb3RlIGFub3RoZXIgc3Vic2NyaXB0aW9uIHRvIHByaW1hcnkgYW5kIGtlZXAgdGhlIHJlc3QuXG4gICAgICAgICAgY29uc3QgbmV3UHJpbWFyeUlkID0gb3RoZXJzWzBdO1xuICAgICAgICAgIGNvbnN0IG5ld1ByaW1hcnkgPSBjb25uLmNoYW5uZWxzW25ld1ByaW1hcnlJZF07XG4gICAgICAgICAgY29ubi5kZXRhY2hDaGFubmVsKGNoYW5uZWxJZCk7XG4gICAgICAgICAgdGhpcy5nZXRFbmRwb2ludChuZXdQcmltYXJ5SWQsIG5ld1ByaW1hcnkudXVpZClcbiAgICAgICAgICAgICAgLnRoZW4oKGVuZHBvaW50KSA9PiBjb25uLm1pZ3JhdGVQcmltYXJ5KG5ld1ByaW1hcnlJZCwgZW5kcG9pbnQpKVxuICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHRoaXMubG9nZ2VyLmVycm9yKCdQaWVTb2NrZXQ6IHByaW1hcnkgbWlncmF0aW9uIGZhaWxlZCcsIGUpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29ubi51bnN1YnNjcmliZUNoYW5uZWwoY2hhbm5lbElkKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIGNvbm4uZGV0YWNoQ2hhbm5lbChjaGFubmVsSWQpO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gU3RhbmRhbG9uZSAodjMgLyBwb3J0YWwpIGNoYW5uZWwgb3ducyBpdHMgb3duIHNvY2tldC5cbiAgICBjaGFubmVsLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgIGlmIChjaGFubmVsLmNvbm5lY3Rpb24pIHtcbiAgICAgIGNoYW5uZWwuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0Q29ubmVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnM7XG4gIH1cblxuICBhc3luYyBnZXRBdXRoVG9rZW4oY2hhbm5lbCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZGF0YS5hcHBlbmQoJ2NoYW5uZWxfbmFtZScsIGNoYW5uZWwpO1xuXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKCdDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlbicsICdBdXRoRW5kcG9pbnRSZXNwb25zZUVycm9yJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKT0+e1xuICAgICAgICByZWplY3QobmV3IEludmFsaWRBdXRoRXhjZXB0aW9uKCdDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlbicsICdBdXRoRW5kcG9pbnRFcnJvcicpKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIub3BlbignUE9TVCcsIHRoaXMub3B0aW9ucy5hdXRoRW5kcG9pbnQpO1xuXG4gICAgICBjb25zdCBoZWFkZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzKTtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdGhpcy5vcHRpb25zLmF1dGhIZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgaXNHdWFyZGVkKGNoYW5uZWwpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZvcmNlQXV0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuICgnJytjaGFubmVsKS5zdGFydHNXaXRoKCdwcml2YXRlLScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmUgdGhlIEpXVCBmb3IgYSBjaGFubmVsOiB0aGUgY29uZmlndXJlZCB0b2tlbiwgb3Igb25lIGZldGNoZWQgZnJvbSB0aGVcbiAgICogYXV0aCBlbmRwb2ludCBmb3IgZ3VhcmRlZCBjaGFubmVscy4gUmV0dXJucyBudWxsIHdoZW4gbm9uZSBhcHBsaWVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhbm5lbElkXG4gICAqIEByZXR1cm4ge1Byb21pc2U8P3N0cmluZz59XG4gICAqL1xuICBhc3luYyByZXNvbHZlQXV0aChjaGFubmVsSWQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmp3dCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5qd3Q7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzR3VhcmRlZChjaGFubmVsSWQpKSB7XG4gICAgICBjb25zdCBhdXRoID0gYXdhaXQgdGhpcy5nZXRBdXRoVG9rZW4oY2hhbm5lbElkKTtcbiAgICAgIGlmIChhdXRoICYmIGF1dGguYXV0aCkge1xuICAgICAgICByZXR1cm4gYXV0aC5hdXRoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIGdldEVuZHBvaW50KGNoYW5uZWxJZCwgdXVpZCwgdmVyc2lvbikge1xuICAgIHZlcnNpb24gPSB2ZXJzaW9uIHx8IHRoaXMub3B0aW9ucy52ZXJzaW9uO1xuICAgIGNvbnN0IGNsdXN0ZXJEb21haW4gPSB0aGlzLm9wdGlvbnMuY2x1c3RlckRvbWFpbiA9PSBudWxsID8gYCR7dGhpcy5vcHRpb25zLmNsdXN0ZXJJZH0ucGllc29ja2V0LmNvbWAgOiB0aGlzLm9wdGlvbnMuY2x1c3RlckRvbWFpbjtcbiAgICBjb25zdCBwcm90b2NvbCA9IHRoaXMub3B0aW9ucy5zc2wgPyAnd3NzJyA6ICd3cyc7XG4gICAgY29uc3QgcXVlcnkgPSBgYXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlLZXl9Jm5vdGlmeV9zZWxmPSR7dGhpcy5vcHRpb25zLm5vdGlmeVNlbGZ9JnNvdXJjZT1qc3NkayZ2PSR7U0RLX1ZFUlNJT059JnByZXNlbmNlPSR7dGhpcy5vcHRpb25zLnByZXNlbmNlfWA7XG4gICAgbGV0IGVuZHBvaW50ID0gYCR7cHJvdG9jb2x9Oi8vJHtjbHVzdGVyRG9tYWlufS92JHt2ZXJzaW9ufS8ke2NoYW5uZWxJZH0/JHtxdWVyeX1gO1xuXG4gICAgLy8gU2V0IGF1dGhcbiAgICBjb25zdCBqd3QgPSBhd2FpdCB0aGlzLnJlc29sdmVBdXRoKGNoYW5uZWxJZCk7XG4gICAgaWYgKGp3dCkge1xuICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludCArICcmand0PScgKyBqd3Q7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVzZXIgaWRlbnRpdHlcbiAgICBpZiAodGhpcy5vcHRpb25zLnVzZXJJZCkge1xuICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludCArICcmdXNlcj0nK3RoaXMub3B0aW9ucy51c2VySWQ7XG4gICAgfVxuXG4gICAgLy8gQWRkIHV1aWRcbiAgICBlbmRwb2ludCA9IGVuZHBvaW50KycmdXVpZD0nK3V1aWQ7XG5cbiAgICByZXR1cm4gZW5kcG9pbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IEljZUNhbmRpZGF0ZSBmcm9tICcuL21pc2MvUlRDSWNlQ2FuZGlkYXRlLmpzJztcbmltcG9ydCBQZWVyQ29ubmVjdGlvbiBmcm9tICcuL21pc2MvUlRDUGVlckNvbm5lY3Rpb24uanMnO1xuaW1wb3J0IFNlc3Npb25EZXNjcmlwdGlvbiBmcm9tICcuL21pc2MvUlRDU2Vzc2lvbkRlc2NyaXB0aW9uLmpzJztcbmNvbnN0IGRlZmF1bHRQb3J0YWxPcHRpb25zID0ge1xuICBzaG91bGRCcm9hZGNhc3Q6IHRydWUsXG4gIHBvcnRhbDogdHJ1ZSxcbiAgdmlkZW86IGZhbHNlLFxuICBhdWRpbzogdHJ1ZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcnRhbCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdmlkZW8gcm9vbSBpbnN0YW5jZVxuICAgKiBAcGFyYW0geyp9IGNoYW5uZWxcbiAgICogQHBhcmFtIHsqfSBpZGVudGl0eVxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfSBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIHRoZSBQb3J0YWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGlkZW50aXR5KSB7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoaWRlbnRpdHkpO1xuICAgIHRoaXMuaWRlbnRpdHkgPSB7Li4uZGVmYXVsdFBvcnRhbE9wdGlvbnMsIC4uLmlkZW50aXR5fTtcbiAgICB0aGlzLmxvY2FsU3RyZWFtID0gbnVsbDtcbiAgICB0aGlzLmRpc3BsYXlTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMucGVlckNvbm5lY3Rpb25Db25maWcgPSB7XG4gICAgICBpY2VTZXJ2ZXJzOiBbXG4gICAgICAgIHt1cmxzOiAnc3R1bjpzdHVuLnN0dW5wcm90b2NvbC5vcmc6MzQ3OCd9LFxuICAgICAgICB7dXJsczogJ3N0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDInfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgICB0aGlzLmNvbnN0cmFpbnRzID0ge1xuICAgICAgdmlkZW86IGlkZW50aXR5LnZpZGVvLFxuICAgICAgYXVkaW86IGlkZW50aXR5LmF1ZGlvLFxuICAgIH07XG5cbiAgICB0aGlzLnBhcnRpY2lwYW50cyA9IFtdO1xuICAgIHRoaXMuaXNOZWdvdGlhdGluZyA9IFtdO1xuXG4gICAgdGhpcy5sb2dnZXIubG9nKCdJbml0aWFsaXppbmcgdmlkZW8gcm9vbScpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbG9jYWwgdmlkZW9cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnN0cmFpbnRzLnZpZGVvICYmICF0aGlzLmNvbnN0cmFpbnRzLmF1ZGlvKSB7XG4gICAgICB0aGlzLnJlcXVlc3RQZWVyVmlkZW8oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnICYmXG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYVxuICAgICkge1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAgIC5nZXRVc2VyTWVkaWEodGhpcy5jb25zdHJhaW50cylcbiAgICAgICAgICAudGhlbih0aGlzLmdldFVzZXJNZWRpYVN1Y2Nlc3MuYmluZCh0aGlzKSlcbiAgICAgICAgICAuY2F0Y2godGhpcy5lcnJvckhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGdldFVzZXJNZWRpYSBBUEknKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzaGFyZVZpZGVvKHNpZ25hbCwgaXNDYWxsZXIgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLmlkZW50aXR5LnNob3VsZEJyb2FkY2FzdCAmJiBpc0NhbGxlciAmJiAhc2lnbmFsLmlzQnJvYWRjYXN0aW5nKSB7XG4gICAgICBjb25zb2xlLmxvZygnUmVmdXNpbmcgdG8gY2FsbCwgZGVuaWVkIGJyb2FkY2FzdCByZXF1ZXN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcnRjQ29ubmVjdGlvbiA9IG5ldyBQZWVyQ29ubmVjdGlvbih0aGlzLnBlZXJDb25uZWN0aW9uQ29uZmlnKTtcblxuICAgIHJ0Y0Nvbm5lY3Rpb24ub25pY2VjYW5kaWRhdGUgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5jYW5kaWRhdGUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNoYW5uZWwucHVibGlzaCgnc3lzdGVtOnBvcnRhbF9jYW5kaWRhdGUnLCB7XG4gICAgICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICAgICAgdG86IHNpZ25hbC5mcm9tLFxuICAgICAgICAgIGljZTogZXZlbnQuY2FuZGlkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQudHJhY2sua2luZCAhPSAndmlkZW8nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnN0cmVhbXMgPSBldmVudC5zdHJlYW1zO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmlkZW50aXR5Lm9uUGFydGljaXBhbnRKb2luZWQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmlkZW50aXR5Lm9uUGFydGljaXBhbnRKb2luZWQoc2lnbmFsLmZyb20sIGV2ZW50LnN0cmVhbXNbMF0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBydGNDb25uZWN0aW9uLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSAoZSkgPT4ge1xuICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgQ2hyb21lOiBza2lwIG5lc3RlZCBuZWdvdGlhdGlvbnNcbiAgICAgIHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0gPVxuICAgICAgICBydGNDb25uZWN0aW9uLnNpZ25hbGluZ1N0YXRlICE9ICdzdGFibGUnO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5sb2NhbFN0cmVhbSkge1xuICAgICAgdGhpcy5sb2NhbFN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICBydGNDb25uZWN0aW9uLmFkZFRyYWNrKHRyYWNrLCB0aGlzLmxvY2FsU3RyZWFtKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRpc3BsYXlTdHJlYW0pIHtcbiAgICAgIHRoaXMuZGlzcGxheVN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICBydGNDb25uZWN0aW9uLmFkZFRyYWNrKHRyYWNrLCB0aGlzLmRpc3BsYXlTdHJlYW0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pc05lZ290aWF0aW5nW3NpZ25hbC5mcm9tXSA9IGZhbHNlO1xuXG4gICAgcnRjQ29ubmVjdGlvbi5vbm5lZ290aWF0aW9ubmVlZGVkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zZW5kVmlkZW9PZmZlcihzaWduYWwsIHJ0Y0Nvbm5lY3Rpb24sIGlzQ2FsbGVyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dID0ge1xuICAgICAgcnRjOiBydGNDb25uZWN0aW9uLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBvblJlbW90ZVNjcmVlblN0b3BwZWQodXVpZCwgc3RyZWFtSWQpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpdHkub25TY3JlZW5TaGFyaW5nU3RvcHBlZCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmlkZW50aXR5Lm9uU2NyZWVuU2hhcmluZ1N0b3BwZWQodXVpZCwgc3RyZWFtSWQpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9uTG9jYWxTY3JlZW4oc2NyZWVuU3RyZWFtKSB7XG4gICAgLy8gUmVnaXN0ZXIgc3RvcCBoYW5kbGVyXG4gICAgc2NyZWVuU3RyZWFtLmdldFZpZGVvVHJhY2tzKClbMF0uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmNoYW5uZWwucHVibGlzaCgnc3lzdGVtOnN0b3BwZWRfc2NyZWVuJywge1xuICAgICAgICBmcm9tOiB0aGlzLmNoYW5uZWwudXVpZCxcbiAgICAgICAgc3RyZWFtSWQ6IHNjcmVlblN0cmVhbS5pZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU2VuZCBpdCB0byBvdGhlciBwZWVyc1xuICAgIHRoaXMuZGlzcGxheVN0cmVhbSA9IHNjcmVlblN0cmVhbTtcbiAgICBjb25zdCBwYXJ0aWNpcGFudHMgPSB0aGlzLnBhcnRpY2lwYW50cztcblxuICAgIGNvbnN0IHBhcnRpY2lwYW50c0lkcyA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50cyk7XG4gICAgcGFydGljaXBhbnRzSWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICBjb25zdCBydGMgPSBwYXJ0aWNpcGFudHNbaWRdLnJ0YztcbiAgICAgIHNjcmVlblN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICBydGMuYWRkVHJhY2sodHJhY2ssIHNjcmVlblN0cmVhbSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNoYXJlU2NyZWVuKCkge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldERpc3BsYXlNZWRpYSgpXG4gICAgICAgIC50aGVuKHRoaXMub25Mb2NhbFNjcmVlbi5iaW5kKHRoaXMpKVxuICAgICAgICAuY2F0Y2godGhpcy5lcnJvckhhbmRsZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICBhc3luYyBzZW5kVmlkZW9PZmZlcihzaWduYWwsIHJ0Y0Nvbm5lY3Rpb24sIGlzQ2FsbGVyKSB7XG4gICAgLy8gaWYgKCFpc0NhbGxlcikge1xuICAgIC8vICAgY29uc29sZS5sb2coXCJTa2lwcGVkLCBub3QgdGhlIGNhbGxlclwiKTtcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG5cbiAgICBpZiAodGhpcy5pc05lZ290aWF0aW5nW3NpZ25hbC5mcm9tXSkge1xuICAgICAgY29uc29sZS5sb2coJ1NLSVAgbmVzdGVkIG5lZ290aWF0aW9ucycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaXNOZWdvdGlhdGluZ1tzaWduYWwuZnJvbV0gPSB0cnVlO1xuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBhd2FpdCBydGNDb25uZWN0aW9uLmNyZWF0ZU9mZmVyKCk7XG4gICAgYXdhaXQgcnRjQ29ubmVjdGlvbi5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcblxuICAgIGNvbnNvbGUubG9nKCdNYWtpbmcgb2ZmZXInKTtcbiAgICAvLyBTZW5kIGEgY2FsbCBvZmZlclxuICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKCdzeXN0ZW06dmlkZW9fb2ZmZXInLCB7XG4gICAgICBmcm9tOiB0aGlzLmNoYW5uZWwudXVpZCxcbiAgICAgIHRvOiBzaWduYWwuZnJvbSxcbiAgICAgIHNkcDogcnRjQ29ubmVjdGlvbi5sb2NhbERlc2NyaXB0aW9uLFxuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlUGFydGljaXBhbnQodXVpZCkge1xuICAgIGRlbGV0ZSB0aGlzLnBhcnRpY2lwYW50c1t1dWlkXTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vblBhcnRpY2lwYW50TGVmdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmlkZW50aXR5Lm9uUGFydGljaXBhbnRMZWZ0KHV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEljZUNhbmRpZGF0ZShzaWduYWwpIHtcbiAgICBjb25zdCBydGNDb25uZWN0aW9uID0gdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0YztcbiAgICBydGNDb25uZWN0aW9uLmFkZEljZUNhbmRpZGF0ZShuZXcgSWNlQ2FuZGlkYXRlKHNpZ25hbC5pY2UpKTtcbiAgfVxuXG4gIGNyZWF0ZUFuc3dlcihzaWduYWwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dIHx8XG4gICAgICAgICF0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIGNhbGwgaW4gY3JlYXRlQW5zd2VyJyk7XG4gICAgICAgIHRoaXMuc2hhcmVWaWRlbyhzaWduYWwsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihcbiAgICAgICAgICBuZXcgU2Vzc2lvbkRlc2NyaXB0aW9uKHNpZ25hbC5zZHApLFxuICAgICAgKTtcbiAgICAgIC8vIE9ubHkgY3JlYXRlIGFuc3dlcnMgaW4gcmVzcG9uc2UgdG8gb2ZmZXJzXG4gICAgICBpZiAoc2lnbmFsLnNkcC50eXBlID09ICdvZmZlcicpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdHb3QgYW4gb2ZmZXIgZnJvbSAnICsgc2lnbmFsLmZyb20sIHNpZ25hbCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gYXdhaXQgdGhpcy5wYXJ0aWNpcGFudHNbXG4gICAgICAgICAgICBzaWduYWwuZnJvbVxuICAgICAgICBdLnJ0Yy5jcmVhdGVBbnN3ZXIoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnBhcnRpY2lwYW50c1tzaWduYWwuZnJvbV0ucnRjLnNldExvY2FsRGVzY3JpcHRpb24oXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goJ3N5c3RlbTp2aWRlb19hbnN3ZXInLCB7XG4gICAgICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICAgICAgdG86IHNpZ25hbC5mcm9tLFxuICAgICAgICAgIHNkcDogdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5sb2NhbERlc2NyaXB0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdHb3QgYW4gYXNud2VyIGZyb20gJyArIHNpZ25hbC5mcm9tKTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVBbnN3ZXIoc2lnbmFsKSB7XG4gICAgdGhpcy5wYXJ0aWNpcGFudHNbc2lnbmFsLmZyb21dLnJ0Yy5zZXRSZW1vdGVEZXNjcmlwdGlvbihcbiAgICAgICAgbmV3IFNlc3Npb25EZXNjcmlwdGlvbihzaWduYWwuc2RwKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGhhbmRsZSBsb2NhbCBzdHJlYW1cbiAgICogQHBhcmFtIHsqfSBzdHJlYW1cbiAgICovXG4gIGdldFVzZXJNZWRpYVN1Y2Nlc3Moc3RyZWFtKSB7XG4gICAgdGhpcy5sb2NhbFN0cmVhbSA9IHN0cmVhbTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pZGVudGl0eS5vbkxvY2FsVmlkZW8oc3RyZWFtLCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3RQZWVyVmlkZW8oKTtcbiAgfVxuXG4gIHJlcXVlc3RQZWVyVmlkZW8oKSB7XG4gICAgbGV0IGV2ZW50TmFtZSA9ICdzeXN0ZW06cG9ydGFsX2Jyb2FkY2FzdGVyJztcblxuICAgIGlmICghdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3QpIHtcbiAgICAgIGV2ZW50TmFtZSA9ICdzeXN0ZW06cG9ydGFsX3dhdGNoZXInO1xuICAgIH1cblxuICAgIHRoaXMuY2hhbm5lbC5wdWJsaXNoKGV2ZW50TmFtZSwge1xuICAgICAgZnJvbTogdGhpcy5jaGFubmVsLnV1aWQsXG4gICAgICBpc0Jyb2FkY2FzdGluZzogdGhpcy5pZGVudGl0eS5zaG91bGRCcm9hZGNhc3QsXG4gICAgfSk7XG4gIH1cblxuICByZXF1ZXN0T2ZmZXJGcm9tUGVlcigpIHtcbiAgICB0aGlzLmNoYW5uZWwucHVibGlzaCgnc3lzdGVtOnZpZGVvX3JlcXVlc3QnLCB7XG4gICAgICBmcm9tOiB0aGlzLmNoYW5uZWwudXVpZCxcbiAgICAgIGlzQnJvYWRjYXN0aW5nOiB0aGlzLmlkZW50aXR5LnNob3VsZEJyb2FkY2FzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGVycm9ySGFuZGxlcihlKSB7XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1BvcnRhbCBlcnJvcicsIGUpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIHZlcnNpb246IDMsXG4gIGNsdXN0ZXJJZDogJ2RlbW8nLFxuICBjbHVzdGVyRG9tYWluOiBudWxsLFxuICBzc2w6IHRydWUsXG4gIGFwaUtleTogJ29DZENNY01QUXBidk5qVUl6cXR2RjFkMlgyb2tXcERRajRBd0FSSnVBZ3RqaHpLeFZFalFVNklkQ2p3bScsXG4gIGNvbnNvbGVMb2dzOiBmYWxzZSxcbiAgbm90aWZ5U2VsZjogMCxcbiAgand0OiBudWxsLFxuICBwcmVzZW5jZTogMCxcbiAgYXV0aEVuZHBvaW50OiAnL2Jyb2FkY2FzdGluZy9hdXRoJyxcbiAgYXV0aEhlYWRlcnM6IHt9LFxuICBmb3JjZUF1dGg6IGZhbHNlLFxuICB1c2VySWQ6IG51bGwsXG4gIGJsb2NrY2hhaW5UZXN0TW9kZTogZmFsc2UsXG4gIGJsb2NrY2hhaW5HYXNGZWU6IDQxMDAwLFxufTtcbiIsImxldCBpY2VDYW5kaWRhdGUgPSB7fTtcbnRyeSB7XG4gIGljZUNhbmRpZGF0ZSA9IFJUQ0ljZUNhbmRpZGF0ZTtcbn0gY2F0Y2ggKGUpIHt9XG5leHBvcnQgZGVmYXVsdCBpY2VDYW5kaWRhdGU7XG4iLCJsZXQgcGVlckNvbm5lY3Rpb24gPSB7fTtcbnRyeSB7XG4gIHBlZXJDb25uZWN0aW9uID0gUlRDUGVlckNvbm5lY3Rpb247XG59IGNhdGNoIChlKSB7fVxuZXhwb3J0IGRlZmF1bHQgcGVlckNvbm5lY3Rpb247XG4iLCJsZXQgc2Vzc2lvbkRlc2NyaXB0aW9uID0ge307XG50cnkge1xuICBzZXNzaW9uRGVzY3JpcHRpb24gPSBSVENTZXNzaW9uRGVzY3JpcHRpb247XG59IGNhdGNoIChlKSB7fVxuZXhwb3J0IGRlZmF1bHQgc2Vzc2lvbkRlc2NyaXB0aW9uO1xuIiwibGV0IHNvY2tldCA9IHt9O1xudHJ5IHtcbiAgc29ja2V0ID0gV2ViU29ja2V0O1xufSBjYXRjaCAoZSkge31cbmV4cG9ydCBkZWZhdWx0IHNvY2tldDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFBpZVNvY2tldCBmcm9tICcuL1BpZVNvY2tldC5qcyc7XG5leHBvcnQgZGVmYXVsdCBQaWVTb2NrZXQ7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=