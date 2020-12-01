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
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Channel
/* harmony export */ });
class Channel {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.connection = this.connect();
        this.events = {};
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
        console.log('Channel message:', e);

        //User defined callback
        if (this.events['message']) {
            this.events['message'](e);
        }
    }

    onOpen(e) {
        console.log('Channel connected:', e);

        //User defined callback
        if (this.events['open']) {
            this.events['open'](e);
        }
    }

    onError(e) {
        console.error('Channel error:', e);

        //User defined callback
        if (this.events['error']) {
            this.events['error'](e);
        }
    }

    onClose(e) {
        console.warn('Channel closed:', e);

        //User defined callback
        if (this.events['close']) {
            this.events['close'](e);
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

const defaultOptions = {
    version: 3,
    cluster_id: 'demo',
    api_key: 'oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm'
}

class PieSocket {

    constructor(options) {
        options = options || {};

        this.options = {...defaultOptions, ...options };
        this.connections = {}
        console.log(this.options);
    }

    subscribe(channelId) {
        var endpoint = this.getEndpoint(channelId);

        if (this.connections[channelId]) {
            console.log("Returning existing channel", endpoint);
            return this.connections[channelId];
        }

        console.log("Creating new channel", endpoint);
        var channel = new _Channel__WEBPACK_IMPORTED_MODULE_0__.default(endpoint);
        this.connections[channelId] = channel;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvUGllU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLDZDQUFPO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0Isd0JBQXdCLGlCQUFpQixxQkFBcUIsR0FBRyxVQUFVLFdBQVcscUJBQXFCO0FBQ25JO0FBQ0EsQzs7Ozs7Ozs7Ozs7OztBQ2pDQSxxRkFBK0MsQzs7Ozs7O1VDQS9DO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwaWVzb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFubmVsIHtcblxuICAgIGNvbnN0cnVjdG9yKGVuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgfVxuXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHRoaXMuZW5kcG9pbnQpO1xuICAgICAgICBjb25uZWN0aW9uLm9ubWVzc2FnZSA9IHRoaXMub25NZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25vcGVuID0gdGhpcy5vbk9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgY29ubmVjdGlvbi5vbmVycm9yID0gdGhpcy5vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IHRoaXMub25DbG9zZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cblxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvL1JlZ2lzdGVyIHVzZXIgZGVmaW5lZCBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gY2FsbGJhY2s7XG4gICAgfVxuXG5cbiAgICBvbk1lc3NhZ2UoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ2hhbm5lbCBtZXNzYWdlOicsIGUpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snbWVzc2FnZSddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snbWVzc2FnZSddKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PcGVuKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snb3BlbiddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snb3BlbiddKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25FcnJvcihlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NoYW5uZWwgZXJyb3I6JywgZSk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snZXJyb3InXShlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xvc2UoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NoYW5uZWwgY2xvc2VkOicsIGUpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snY2xvc2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ2Nsb3NlJ10oZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbCc7XG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIGNsdXN0ZXJfaWQ6ICdkZW1vJyxcbiAgICBhcGlfa2V5OiAnb0NkQ01jTVBRcGJ2TmpVSXpxdHZGMWQyWDJva1dwRFFqNEF3QVJKdUFndGpoekt4VkVqUVU2SWRDandtJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVTb2NrZXQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGNoYW5uZWxJZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQgPSB0aGlzLmdldEVuZHBvaW50KGNoYW5uZWxJZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXR1cm5pbmcgZXhpc3RpbmcgY2hhbm5lbFwiLCBlbmRwb2ludCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBuZXcgY2hhbm5lbFwiLCBlbmRwb2ludCk7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IENoYW5uZWwoZW5kcG9pbnQpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0gPSBjaGFubmVsO1xuICAgIH1cblxuICAgIGdldEVuZHBvaW50KGNoYW5uZWxJZCkge1xuICAgICAgICByZXR1cm4gYHdzczovLyR7dGhpcy5vcHRpb25zLmNsdXN0ZXJfaWR9LndlYnNvY2tldC5tZS92JHt0aGlzLm9wdGlvbnMudmVyc2lvbn0vJHtjaGFubmVsSWR9P2FwaV9rZXk9JHt0aGlzLm9wdGlvbnMuYXBpX2tleX1gXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QaWVTb2NrZXQnKS5kZWZhdWx0OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBtb2R1bGUgZXhwb3J0cyBtdXN0IGJlIHJldHVybmVkIGZyb20gcnVudGltZSBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==