var PieSocket;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
    forceAuth: false    
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
                        resolve(response.auth);
                    }catch(e){
                        reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]("Could not fetch auth token", "AuthEndpointResponseError"));
                    }
                }
            });
            xhr.addEventListener('error', ()=>{
                reject(new _InvalidAuthException_js__WEBPACK_IMPORTED_MODULE_3__["default"]("Could not fetch auth token", "AuthEndpointError"));
            });

            xhr.open("GET", this.options.authEndpoint);

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

        if(this.options.jwt){
            endpoint = endpoint+"&jwt="+this.options.jwt;
        }
        else if(this.isGuarded(channelId)){
            const authToken = await this.getAuthToken(channelId);
            endpoint = endpoint + "&jwt="+authToken;
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
module.exports = JSON.parse('{"name":"piesocket-js","version":"1.1.2","description":"PieSocket Javascript Client","main":"src/index.js","unpkg":"dist/piesocket.js","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","start":"webpack serve --mode=development --config webpack.dev.js ","build":"webpack --mode=production --config webpack.prod.js","prepare":"npm run build","watch":"webpack --mode=development --config webpack.dev.js --watch"},"repository":{"type":"git","url":"git+https://github.com/piesocket/piesocket-js.git"},"keywords":["piesocket","client","websocket","pubsub","http"],"author":"PieSocket","license":"MIT","bugs":{"url":"https://github.com/piesocket/piesocket-js/issues"},"homepage":"https://github.com/piesocket/piesocket-js#readme","devDependencies":{"@webpack-cli/serve":"^1.1.0","webpack":"^5.9.0","webpack-cli":"^4.2.0","webpack-dev-server":"^3.11.2","webpack-merge":"^5.4.0"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllc29ja2V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWxCOztBQUVmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrREFBTTtBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xHZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0xlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCbUM7QUFDRjtBQUNHO0FBQ3lCOztBQUU3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFZTs7QUFFZjtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBLDBCQUEwQixrREFBTTtBQUNoQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixtREFBTzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsbUNBQW1DLGdFQUFvQjtBQUN2RDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMkJBQTJCLGdFQUFvQjtBQUMvQyxhQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsdUJBQXVCLGtCQUFrQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcsb0JBQW9CLGVBQWUsd0JBQXdCLGtCQUFrQixrREFBYSxDQUFDLFlBQVksc0JBQXNCOztBQUVuUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RIQSx3RkFBK0M7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDQS9DO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL0NoYW5uZWwuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL0ludmFsaWRBdXRoRXhjZXB0aW9uLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Mb2dnZXIuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL1BpZVNvY2tldC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcblxuICAgIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBpZGVudGl0eSwgaW5pdD10cnVlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG5cbiAgICAgICAgaWYoIWluaXQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0KGVuZHBvaW50LCBpZGVudGl0eSk7XG4gICAgfVxuXG4gICAgaW5pdChlbmRwb2ludCwgaWRlbnRpdHkpeyAgICAgICAgXG4gICAgICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICAgICAgdGhpcy5pZGVudGl0eSA9IGlkZW50aXR5O1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGlkZW50aXR5KTtcbiAgICB9XG5cbiAgICBjb25uZWN0KCkge1xuICAgICAgICB2YXIgY29ubmVjdGlvbiA9IG5ldyBXZWJTb2NrZXQodGhpcy5lbmRwb2ludCk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbm9wZW4gPSB0aGlzLm9uT3Blbi5iaW5kKHRoaXMpO1xuICAgICAgICBjb25uZWN0aW9uLm9uZXJyb3IgPSB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmNsb3NlID0gdGhpcy5vbkNsb3NlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gICAgfVxuXG4gICAgb24oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vUmVnaXN0ZXIgdXNlciBkZWZpbmVkIGNhbGxiYWNrc1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBzZW5kKGRhdGEpe1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQoZGF0YSk7XG4gICAgfVxuXG4gICAgb25NZXNzYWdlKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIG1lc3NhZ2U6JywgZSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuZXJyb3IgJiYgbWVzc2FnZS5lcnJvci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChqc29uRXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGpzb25FeGNlcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydtZXNzYWdlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydtZXNzYWdlJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3BlbihlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQ2hhbm5lbCBjb25uZWN0ZWQ6JywgZSk7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ29wZW4nXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ29wZW4nXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25FcnJvcihlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDaGFubmVsIGVycm9yOicsIGUpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ2Vycm9yJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydlcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsb3NlKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydjbG9zZSddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snY2xvc2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVjb25uZWN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkUmVjb25uZWN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiUmVjb25uZWN0aW5nXCIpO1xuICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICB9XG5cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEludmFsaWRBdXRoRXhjZXB0aW9ue1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBuYW1lPVwiSW52YWxpZEF1dGhFeGNlcHRpb25cIikge1xuICAgIHRoaXMubWVzc2FnZSA9IFwiQXV0aCBlbmRwb2ludCBkaWQgbm90IHJldHVybiBhIHZhbGlkIEpXVCBUb2tlbiwgcGxlYXNlIHNlZTogaHR0cHM6Ly93d3cucGllc29ja2V0LmNvbS9kb2NzLzMuMC9hdXRoZW50aWNhdGlvblwiO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7ICBcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgbG9nKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YXJuKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IoLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsLmpzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IHBqc29uIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgSW52YWxpZEF1dGhFeGNlcHRpb24gZnJvbSAnLi9JbnZhbGlkQXV0aEV4Y2VwdGlvbi5qcyc7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHZlcnNpb246IDMsXG4gICAgY2x1c3RlcklkOiAnZGVtbycsXG4gICAgYXBpS2V5OiAnb0NkQ01jTVBRcGJ2TmpVSXpxdHZGMWQyWDJva1dwRFFqNEF3QVJKdUFndGpoekt4VkVqUVU2SWRDandtJyxcbiAgICBjb25zb2xlTG9nczogZmFsc2UsXG4gICAgbm90aWZ5U2VsZjogMCxcbiAgICBqd3Q6IG51bGwsXG4gICAgcHJlc2VuY2U6IDAsXG4gICAgYXV0aEVuZHBvaW50OiBcIi9icm9hZGNhc3RpbmcvYXV0aFwiLFxuICAgIGF1dGhIZWFkZXJzOiB7fSxcbiAgICBmb3JjZUF1dGg6IGZhbHNlICAgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVTb2NrZXQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICAgICAgdmFyIG1ha2VFbmRwb2ludCA9IHRoaXMuZ2V0RW5kcG9pbnQoY2hhbm5lbElkKTtcblxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJSZXR1cm5pbmcgZXhpc3RpbmcgY2hhbm5lbFwiLCBjaGFubmVsSWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiQ3JlYXRpbmcgbmV3IGNoYW5uZWxcIiwgY2hhbm5lbElkKTtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgQ2hhbm5lbChudWxsLCBudWxsLCBmYWxzZSk7XG5cbiAgICAgICAgbWFrZUVuZHBvaW50LnRoZW4oKGVuZHBvaW50KT0+e1xuICAgICAgICAgICAgY2hhbm5lbC5pbml0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgY2hhbm5lbElkOiBjaGFubmVsSWQsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUoY2hhbm5lbElkKXtcbiAgICAgICAgaWYodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKXtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q29ubmVjdGlvbnMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnM7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QXV0aFRva2VuKGNoYW5uZWwpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImNoYW5uZWxfbmFtZVwiLCBjaGFubmVsKTtcbiAgICBcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIFxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9ICBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuYXV0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgSW52YWxpZEF1dGhFeGNlcHRpb24oXCJDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlblwiLCBcIkF1dGhFbmRwb2ludFJlc3BvbnNlRXJyb3JcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKT0+e1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgSW52YWxpZEF1dGhFeGNlcHRpb24oXCJDb3VsZCBub3QgZmV0Y2ggYXV0aCB0b2tlblwiLCBcIkF1dGhFbmRwb2ludEVycm9yXCIpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB0aGlzLm9wdGlvbnMuYXV0aEVuZHBvaW50KTtcblxuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5hdXRoSGVhZGVycyk7XG4gICAgICAgICAgICBoZWFkZXJzLmZvckVhY2goaGVhZGVyID0+IHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRoaXMub3B0aW9ucy5hdXRoSGVhZGVyc1toZWFkZXJdKTtcbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7IFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpc0d1YXJkZWQoY2hhbm5lbCl7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5mb3JjZUF1dGgpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFwiXCIrY2hhbm5lbCkuc3RhcnRzV2l0aChcInByaXZhdGUtXCIpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEVuZHBvaW50KGNoYW5uZWxJZCkge1xuICAgICAgICBsZXQgZW5kcG9pbnQgPSBgd3NzOi8vJHt0aGlzLm9wdGlvbnMuY2x1c3RlcklkfS5waWVzb2NrZXQuY29tL3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufS8ke2NoYW5uZWxJZH0/YXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlLZXl9Jm5vdGlmeV9zZWxmPSR7dGhpcy5vcHRpb25zLm5vdGlmeVNlbGZ9JnNvdXJjZT1qc3NkayZ2PSR7cGpzb24udmVyc2lvbn0mcHJlc2VuY2U9JHt0aGlzLm9wdGlvbnMucHJlc2VuY2V9YFxuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5qd3Qpe1xuICAgICAgICAgICAgZW5kcG9pbnQgPSBlbmRwb2ludCtcIiZqd3Q9XCIrdGhpcy5vcHRpb25zLmp3dDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuaXNHdWFyZGVkKGNoYW5uZWxJZCkpe1xuICAgICAgICAgICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgdGhpcy5nZXRBdXRoVG9rZW4oY2hhbm5lbElkKTtcbiAgICAgICAgICAgIGVuZHBvaW50ID0gZW5kcG9pbnQgKyBcIiZqd3Q9XCIrYXV0aFRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmRwb2ludDtcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BpZVNvY2tldCcpLmRlZmF1bHQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=