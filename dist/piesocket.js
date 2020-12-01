var PieSocket;PieSocket =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
        this.shouldReconnect = true;
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

        var message = JSON.parse(e.data);
        if (message.error.length) {
            this.shouldReconnect = false;
        }

        //User defined callback
        if (this.events['message']) {
            this.events['message'].bind(this)(e);
        }
    }

    onOpen(e) {
        this.logger.log('Channel connected:', e);

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


const defaultOptions = {
    version: 3,
    cluster_id: 'demo',
    api_key: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm',
    consoleLogs: false
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

    getEndpoint(channelId) {
        return `wss://${this.options.cluster_id}.websocket.me/v${this.options.version}/${channelId}?api_key=${this.options.api_key}`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvTG9nZ2VyLmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9QaWVTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vUGllU29ja2V0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1BpZVNvY2tldC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBOEI7O0FBRWY7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDRDQUFNO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakZlOztBQUVmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QmdDO0FBQ0Y7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCLDRDQUFNO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsNkNBQU87QUFDakM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0Isd0JBQXdCLGlCQUFpQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcscUJBQXFCO0FBQ25JO0FBQ0EsQzs7Ozs7Ozs7Ozs7OztBQ3ZDQSxxRkFBK0MsQzs7Ozs7O1VDQS9DO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwaWVzb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgICAgICB0aGlzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihpZGVudGl0eSk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgICAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cblxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvL1JlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gICAgfVxuXG5cbiAgICBvbk1lc3NhZ2UoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgICAgICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgaWYgKG1lc3NhZ2UuZXJyb3IubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNob3VsZFJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydtZXNzYWdlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydtZXNzYWdlJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3BlbihlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQ2hhbm5lbCBjb25uZWN0ZWQ6JywgZSk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydvcGVuJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWydvcGVuJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRXJyb3IoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ2hhbm5lbCBlcnJvcjonLCBlKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbG9zZShlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ0NoYW5uZWwgY2xvc2VkOicsIGUpO1xuICAgICAgICB0aGlzLnJlY29ubmVjdCgpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10uYmluZCh0aGlzKShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY29ubmVjdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNob3VsZFJlY29ubmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIlJlY29ubmVjdGluZ1wiKTtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfVxuXG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGxvZyguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2FybiguLi5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29uc29sZUxvZ3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKC4uLmRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25zb2xlTG9ncykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciguLi5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vTG9nZ2VyJztcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHZlcnNpb246IDMsXG4gICAgY2x1c3Rlcl9pZDogJ2RlbW8nLFxuICAgIGFwaV9rZXk6ICdvQ2RDTWNNUFFwYnZOalVJenF0dkYxZDJYMm9rV3BEUWo0QXdBUkp1QWd0amh6S3hWRWpRVTZJZENqd20nLFxuICAgIGNvbnNvbGVMb2dzOiBmYWxzZVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVTb2NrZXQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gdGhpcy5nZXRFbmRwb2ludChjaGFubmVsSWQpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIlJldHVybmluZyBleGlzdGluZyBjaGFubmVsXCIsIGVuZHBvaW50KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJDcmVhdGluZyBuZXcgY2hhbm5lbFwiLCBlbmRwb2ludCk7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IENoYW5uZWwoZW5kcG9pbnQsIHtcbiAgICAgICAgICAgIGNoYW5uZWxJZDogY2hhbm5lbElkLFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgICAgICByZXR1cm4gY2hhbm5lbDtcbiAgICB9XG5cbiAgICBnZXRFbmRwb2ludChjaGFubmVsSWQpIHtcbiAgICAgICAgcmV0dXJuIGB3c3M6Ly8ke3RoaXMub3B0aW9ucy5jbHVzdGVyX2lkfS53ZWJzb2NrZXQubWUvdiR7dGhpcy5vcHRpb25zLnZlcnNpb259LyR7Y2hhbm5lbElkfT9hcGlfa2V5PSR7dGhpcy5vcHRpb25zLmFwaV9rZXl9YFxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGllU29ja2V0JykuZGVmYXVsdDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbW9kdWxlIGV4cG9ydHMgbXVzdCBiZSByZXR1cm5lZCBmcm9tIHJ1bnRpbWUgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xucmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=