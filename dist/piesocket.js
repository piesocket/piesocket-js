var PieSocket;PieSocket =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! default exports */
/*! export author [provided] [no usage info] [missing usage info prevents renaming] */
/*! export bugs [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export url [provided] [no usage info] [missing usage info prevents renaming] */
/*!   other exports [not provided] [no usage info] */
/*! export description [provided] [no usage info] [missing usage info prevents renaming] */
/*! export devDependencies [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export @webpack-cli/serve [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export webpack [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export webpack-cli [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export webpack-dev-server [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export webpack-merge [provided] [no usage info] [missing usage info prevents renaming] */
/*!   other exports [not provided] [no usage info] */
/*! export homepage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export keywords [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export 0 [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export 1 [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export 2 [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export 3 [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export 4 [provided] [no usage info] [missing usage info prevents renaming] */
/*!   other exports [not provided] [no usage info] */
/*! export license [provided] [no usage info] [missing usage info prevents renaming] */
/*! export main [provided] [no usage info] [missing usage info prevents renaming] */
/*! export name [provided] [no usage info] [missing usage info prevents renaming] */
/*! export repository [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export type [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export url [provided] [no usage info] [missing usage info prevents renaming] */
/*!   other exports [not provided] [no usage info] */
/*! export scripts [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export build [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export prepare [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export start [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export test [provided] [no usage info] [missing usage info prevents renaming] */
/*!   export watch [provided] [no usage info] [missing usage info prevents renaming] */
/*!   other exports [not provided] [no usage info] */
/*! export unpkg [provided] [no usage info] [missing usage info prevents renaming] */
/*! export version [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"piesocket-js\",\"version\":\"1.0.14\",\"description\":\"PieSocket Javascript Client\",\"main\":\"src/index.js\",\"unpkg\":\"dist/piesocket.js\",\"scripts\":{\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\",\"start\":\"webpack --mode=development --config webpack.dev.js serve\",\"build\":\"webpack --mode=production --config webpack.prod.js\",\"prepare\":\"npm run build\",\"watch\":\"webpack --mode=development --config webpack.dev.js --watch\"},\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/piesocket/piesocket-js.git\"},\"keywords\":[\"piesocket\",\"client\",\"websocket\",\"pubsub\",\"http\"],\"author\":\"PieSocket\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/piesocket/piesocket-js/issues\"},\"homepage\":\"https://github.com/piesocket/piesocket-js#readme\",\"devDependencies\":{\"@webpack-cli/serve\":\"^1.1.0\",\"webpack\":\"^5.9.0\",\"webpack-cli\":\"^4.2.0\",\"webpack-dev-server\":\"^3.11.0\",\"webpack-merge\":\"^5.4.0\"}}");

/***/ }),

/***/ "./src/Channel.js":
/*!************************!*\
  !*** ./src/Channel.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Channel
/* harmony export */ });
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logger */ "./src/Logger.js");


class Channel {

    constructor(endpoint, identity) {
        this.endpoint = endpoint;
        this.identity = identity;
        this.connection = this.connect();
        this.events = {};
        this.shouldReconnect = false;
        this.logger = new _Logger__WEBPACK_IMPORTED_MODULE_0__.default(identity);
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
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Logger
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
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ PieSocket
/* harmony export */ });
/* harmony import */ var _Channel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Channel */ "./src/Channel.js");
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logger */ "./src/Logger.js");


var pjson = __webpack_require__(/*! ../package.json */ "./package.json");

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
        this.logger = new _Logger__WEBPACK_IMPORTED_MODULE_1__.default(this.options);
    }

    subscribe(channelId) {
        var endpoint = this.getEndpoint(channelId);

        if (this.connections[channelId]) {
            this.logger.log("Returning existing channel", endpoint);
            return this.connections[channelId];
        }

        this.logger.log("Creating new channel", endpoint);
        var channel = new _Channel__WEBPACK_IMPORTED_MODULE_0__.default(endpoint, {
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
        return `wss://${this.options.clusterId}.websocket.me/v${this.options.version}/${channelId}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=${pjson.version}`
    }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [maybe used in main (runtime-defined)] */
/*! runtime requirements: module, __webpack_require__ */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./PieSocket */ "./src/PieSocket.js").default;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvTG9nZ2VyLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9QaWVTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE4Qjs7QUFFZjs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNENBQU07QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BGZTs7QUFFZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJnQztBQUNGO0FBQzlCLFlBQVksbUJBQU8sQ0FBQyx1Q0FBaUI7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCLDRDQUFNO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsNkNBQU87QUFDakM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCLGlCQUFpQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcsb0JBQW9CLGVBQWUsd0JBQXdCLGtCQUFrQixjQUFjO0FBQ3hNO0FBQ0EsQzs7Ozs7Ozs7Ozs7OztBQ3pEQSxxRkFBK0MsQzs7Ozs7O1VDQS9DO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwaWVzb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgICAgICB0aGlzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoaWRlbnRpdHkpO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKSB7XG4gICAgICAgIHZhciBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCh0aGlzLmVuZHBvaW50KTtcbiAgICAgICAgY29ubmVjdGlvbi5vbm1lc3NhZ2UgPSB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgICAgICBjb25uZWN0aW9uLm9ub3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25lcnJvciA9IHRoaXMub25FcnJvci5iaW5kKHRoaXMpO1xuICAgICAgICBjb25uZWN0aW9uLm9uY2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgICB9XG5cbiAgICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLy9SZWdpc3RlciB1c2VyIGRlZmluZWQgY2FsbGJhY2tzXG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICAgIH1cblxuXG4gICAgb25NZXNzYWdlKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIG1lc3NhZ2U6JywgZSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuZXJyb3IubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoanNvbkV4Y2VwdGlvbikge31cblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ21lc3NhZ2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ21lc3NhZ2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PcGVuKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdDaGFubmVsIGNvbm5lY3RlZDonLCBlKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSB0cnVlO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snb3BlbiddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snb3BlbiddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkVycm9yKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0NoYW5uZWwgZXJyb3I6JywgZSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snZXJyb3InXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ2Vycm9yJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xvc2UoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdDaGFubmVsIGNsb3NlZDonLCBlKTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ2Nsb3NlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydjbG9zZSddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNvbm5lY3QoKSB7XG4gICAgICAgIGlmICghdGhpcy5zaG91bGRSZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJSZWNvbm5lY3RpbmdcIik7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH1cblxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG5cbiAgICBsb2coLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhcm4oLi4uZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnNvbGVMb2dzKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcnJvciguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoLi4uZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL0xvZ2dlcic7XG52YXIgcGpzb24gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgdmVyc2lvbjogMyxcbiAgICBjbHVzdGVySWQ6ICdkZW1vJyxcbiAgICBhcGlLZXk6ICdvQ2RDTWNNUFFwYnZOalVJenF0dkYxZDJYMm9rV3BEUWo0QXdBUkp1QWd0amh6S3hWRWpRVTZJZENqd20nLFxuICAgIGNvbnNvbGVMb2dzOiBmYWxzZSxcbiAgICBub3RpZnlTZWxmOiB0cnVlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZVNvY2tldCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0ge31cbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGNoYW5uZWxJZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQgPSB0aGlzLmdldEVuZHBvaW50KGNoYW5uZWxJZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKFwiUmV0dXJuaW5nIGV4aXN0aW5nIGNoYW5uZWxcIiwgZW5kcG9pbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIkNyZWF0aW5nIG5ldyBjaGFubmVsXCIsIGVuZHBvaW50KTtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgQ2hhbm5lbChlbmRwb2ludCwge1xuICAgICAgICAgICAgY2hhbm5lbElkOiBjaGFubmVsSWQsXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSA9IGNoYW5uZWw7XG4gICAgICAgIHJldHVybiBjaGFubmVsO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlKGNoYW5uZWxJZCl7XG4gICAgICAgIGlmKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSl7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uc2hvdWxkUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0uY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENvbm5lY3Rpb25zKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zO1xuICAgIH1cblxuICAgIGdldEVuZHBvaW50KGNoYW5uZWxJZCkge1xuICAgICAgICByZXR1cm4gYHdzczovLyR7dGhpcy5vcHRpb25zLmNsdXN0ZXJJZH0ud2Vic29ja2V0Lm1lL3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufS8ke2NoYW5uZWxJZH0/YXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlLZXl9Jm5vdGlmeV9zZWxmPSR7dGhpcy5vcHRpb25zLm5vdGlmeVNlbGZ9JnNvdXJjZT1qc3NkayZ2PSR7cGpzb24udmVyc2lvbn1gXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QaWVTb2NrZXQnKS5kZWZhdWx0OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBtb2R1bGUgZXhwb3J0cyBtdXN0IGJlIHJldHVybmVkIGZyb20gcnVudGltZSBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==