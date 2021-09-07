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

    constructor(endpoint, identity) {
        this.endpoint = endpoint;
        this.identity = identity;
        this.connection = this.connect();
        this.events = {};
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


    onMessage(e) {
        this.logger.log('Channel message:', e);

        try {
            var message = JSON.parse(e.data);
            if (message.error.length) {
                this.shouldReconnect = false;
            }
        } catch (jsonException) {}

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




const defaultOptions = {
    version: 3,
    clusterId: 'demo',
    apiKey: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm',
    consoleLogs: false,
    notifySelf: true
}

class PieSocket {

    constructor(options) {
        options = options || {};

        this.options = {...defaultOptions, ...options };
        this.connections = {}
        this.logger = new _Logger_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.options);
    }

    subscribe(channelId) {
        var endpoint = this.getEndpoint(channelId);

        if (this.connections[channelId]) {
            this.logger.log("Returning existing channel", endpoint);
            return this.connections[channelId];
        }

        this.logger.log("Creating new channel", endpoint);
        var channel = new _Channel_js__WEBPACK_IMPORTED_MODULE_0__["default"](endpoint, {
            channelId: channelId,
            ...this.options
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

    getEndpoint(channelId) {
        return `wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${_package_json__WEBPACK_IMPORTED_MODULE_2__.version}`
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
module.exports = JSON.parse('{"name":"piesocket-js","version":"1.0.17","description":"PieSocket Javascript Client","main":"src/index.js","unpkg":"dist/piesocket.js","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","start":"webpack serve --mode=development --config webpack.dev.js ","build":"webpack --mode=production --config webpack.prod.js","prepare":"npm run build","watch":"webpack --mode=development --config webpack.dev.js --watch"},"repository":{"type":"git","url":"git+https://github.com/piesocket/piesocket-js.git"},"keywords":["piesocket","client","websocket","pubsub","http"],"author":"PieSocket","license":"MIT","bugs":{"url":"https://github.com/piesocket/piesocket-js/issues"},"homepage":"https://github.com/piesocket/piesocket-js#readme","devDependencies":{"@webpack-cli/serve":"^1.1.0","webpack":"^5.9.0","webpack-cli":"^4.2.0","webpack-dev-server":"^3.11.2","webpack-merge":"^5.4.0"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllc29ja2V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWxCOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrREFBTTtBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7O0FDcEZlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJtQztBQUNGO0FBQ0c7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCLGtEQUFNO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsbURBQU87QUFDakM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCLGtCQUFrQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcsb0JBQW9CLGVBQWUsd0JBQXdCLGtCQUFrQixrREFBYSxDQUFDO0FBQ3pNO0FBQ0E7Ozs7Ozs7Ozs7QUN6REEsd0ZBQStDOzs7Ozs7Ozs7Ozs7Ozs7OztVQ0EvQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9DaGFubmVsLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Mb2dnZXIuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL1BpZVNvY2tldC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcblxuICAgIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBpZGVudGl0eSkge1xuICAgICAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgICAgIHRoaXMuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgICAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cblxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvL1JlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gICAgfVxuXG5cbiAgICBvbk1lc3NhZ2UoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5lcnJvci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChqc29uRXhjZXB0aW9uKSB7fVxuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snbWVzc2FnZSddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snbWVzc2FnZSddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk9wZW4oZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IHRydWU7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydvcGVuJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydvcGVuJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRXJyb3IoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ2hhbm5lbCBlcnJvcjonLCBlKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbG9zZShlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ0NoYW5uZWwgY2xvc2VkOicsIGUpO1xuICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY29ubmVjdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNob3VsZFJlY29ubmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIlJlY29ubmVjdGluZ1wiKTtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfVxuXG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGxvZyguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2FybiguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC5qcyc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyLmpzJztcbmltcG9ydCBwanNvbiBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIGNsdXN0ZXJJZDogJ2RlbW8nLFxuICAgIGFwaUtleTogJ29DZENNY01QUXBidk5qVUl6cXR2RjFkMlgyb2tXcERRajRBd0FSSnVBZ3RqaHpLeFZFalFVNklkQ2p3bScsXG4gICAgY29uc29sZUxvZ3M6IGZhbHNlLFxuICAgIG5vdGlmeVNlbGY6IHRydWVcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGllU29ja2V0IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSB7fVxuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIodGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoY2hhbm5lbElkKSB7XG4gICAgICAgIHZhciBlbmRwb2ludCA9IHRoaXMuZ2V0RW5kcG9pbnQoY2hhbm5lbElkKTtcblxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJSZXR1cm5pbmcgZXhpc3RpbmcgY2hhbm5lbFwiLCBlbmRwb2ludCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiQ3JlYXRpbmcgbmV3IGNoYW5uZWxcIiwgZW5kcG9pbnQpO1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBDaGFubmVsKGVuZHBvaW50LCB7XG4gICAgICAgICAgICBjaGFubmVsSWQ6IGNoYW5uZWxJZCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUoY2hhbm5lbElkKXtcbiAgICAgICAgaWYodGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdKXtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXS5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q29ubmVjdGlvbnMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0RW5kcG9pbnQoY2hhbm5lbElkKSB7XG4gICAgICAgIHJldHVybiBgd3NzOi8vJHt0aGlzLm9wdGlvbnMuY2x1c3RlcklkfS5waWVzb2NrZXQuY29tL3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufS8ke2NoYW5uZWxJZH0/YXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlLZXl9Jm5vdGlmeV9zZWxmPSR7dGhpcy5vcHRpb25zLm5vdGlmeVNlbGZ9JnNvdXJjZT1qc3NkayZ2PSR7cGpzb24udmVyc2lvbn1gXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QaWVTb2NrZXQnKS5kZWZhdWx0OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9