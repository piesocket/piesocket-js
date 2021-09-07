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

    send(data){
        return this.connection.send(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllc29ja2V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWxCOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrREFBTTtBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7O0FDdkZlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJtQztBQUNGO0FBQ0c7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCLGtEQUFNO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsbURBQU87QUFDakM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCLGtCQUFrQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcsb0JBQW9CLGVBQWUsd0JBQXdCLGtCQUFrQixrREFBYSxDQUFDO0FBQ3pNO0FBQ0E7Ozs7Ozs7Ozs7QUN6REEsd0ZBQStDOzs7Ozs7Ozs7Ozs7Ozs7OztVQ0EvQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9DaGFubmVsLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9Mb2dnZXIuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL1BpZVNvY2tldC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcblxuICAgIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBpZGVudGl0eSkge1xuICAgICAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgICAgIHRoaXMuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgICAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cblxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvL1JlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgc2VuZChkYXRhKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKGRhdGEpO1xuICAgIH1cblxuICAgIG9uTWVzc2FnZShlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQ2hhbm5lbCBtZXNzYWdlOicsIGUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmVycm9yLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGpzb25FeGNlcHRpb24pIHt9XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydtZXNzYWdlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydtZXNzYWdlJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3BlbihlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQ2hhbm5lbCBjb25uZWN0ZWQ6JywgZSk7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVjb25uZWN0ID0gdHJ1ZTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ29wZW4nXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ29wZW4nXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25FcnJvcihlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDaGFubmVsIGVycm9yOicsIGUpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ2Vycm9yJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydlcnJvciddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsb3NlKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydjbG9zZSddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snY2xvc2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVjb25uZWN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkUmVjb25uZWN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiUmVjb25uZWN0aW5nXCIpO1xuICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICB9XG5cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgbG9nKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YXJuKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IoLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsLmpzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9Mb2dnZXIuanMnO1xuaW1wb3J0IHBqc29uIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHZlcnNpb246IDMsXG4gICAgY2x1c3RlcklkOiAnZGVtbycsXG4gICAgYXBpS2V5OiAnb0NkQ01jTVBRcGJ2TmpVSXpxdHZGMWQyWDJva1dwRFFqNEF3QVJKdUFndGpoekt4VkVqUVU2SWRDandtJyxcbiAgICBjb25zb2xlTG9nczogZmFsc2UsXG4gICAgbm90aWZ5U2VsZjogdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVTb2NrZXQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gdGhpcy5nZXRFbmRwb2ludChjaGFubmVsSWQpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIlJldHVybmluZyBleGlzdGluZyBjaGFubmVsXCIsIGVuZHBvaW50KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJDcmVhdGluZyBuZXcgY2hhbm5lbFwiLCBlbmRwb2ludCk7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IENoYW5uZWwoZW5kcG9pbnQsIHtcbiAgICAgICAgICAgIGNoYW5uZWxJZDogY2hhbm5lbElkLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICByZXR1cm4gY2hhbm5lbDtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZShjaGFubmVsSWQpe1xuICAgICAgICBpZih0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pe1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDb25uZWN0aW9ucygpe1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBnZXRFbmRwb2ludChjaGFubmVsSWQpIHtcbiAgICAgICAgcmV0dXJuIGB3c3M6Ly8ke3RoaXMub3B0aW9ucy5jbHVzdGVySWR9LnBpZXNvY2tldC5jb20vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259LyR7Y2hhbm5lbElkfT9hcGlfa2V5PSR7dGhpcy5vcHRpb25zLmFwaUtleX0mbm90aWZ5X3NlbGY9JHt0aGlzLm9wdGlvbnMubm90aWZ5U2VsZn0mc291cmNlPWpzc2RrJnY9JHtwanNvbi52ZXJzaW9ufWBcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BpZVNvY2tldCcpLmRlZmF1bHQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=