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

    constructor(endpoint, identity) {
        this.endpoint = endpoint;
        this.identity = identity;
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
            this.events['message'].bind(this)(e);
        }
    }

    onOpen(e) {
        console.log('Channel connected:', e);

        //User defined callback
        if (this.events['open']) {
            this.events['open'].bind(this)(e);
        }
    }

    onError(e) {
        console.error('Channel error:', e);
        this.connection.close();

        //User defined callback
        if (this.events['error']) {
            this.events['error'].bind(this)(e);
        }
    }

    onClose(e) {
        console.warn('Channel closed:', e);
        this.reconnect();

        //User defined callback
        if (this.events['close']) {
            this.events['close'].bind(this)(e);
        }
    }

    reconnect() {
        console.log("Reconnecting");
        this.connect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvQ2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvLi9zcmMvUGllU29ja2V0LmpzIiwid2VicGFjazovL1BpZVNvY2tldC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllU29ja2V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVTb2NrZXQvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckVnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlOztBQUVmO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLDZDQUFPO0FBQ2pDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLHdCQUF3QixpQkFBaUIscUJBQXFCLEdBQUcsVUFBVSxXQUFXLHFCQUFxQjtBQUNuSTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7QUNyQ0EscUZBQStDLEM7Ozs7OztVQ0EvQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoicGllc29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgaWRlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgICAgICB0aGlzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cblxuICAgIGNvbm5lY3QoKSB7XG4gICAgICAgIHZhciBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCh0aGlzLmVuZHBvaW50KTtcbiAgICAgICAgY29ubmVjdGlvbi5vbm1lc3NhZ2UgPSB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgICAgICBjb25uZWN0aW9uLm9ub3BlbiA9IHRoaXMub25PcGVuLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbm5lY3Rpb24ub25lcnJvciA9IHRoaXMub25FcnJvci5iaW5kKHRoaXMpO1xuICAgICAgICBjb25uZWN0aW9uLm9uY2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgICB9XG5cbiAgICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLy9SZWdpc3RlciB1c2VyIGRlZmluZWQgY2FsbGJhY2tzXG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICAgIH1cblxuXG4gICAgb25NZXNzYWdlKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NoYW5uZWwgbWVzc2FnZTonLCBlKTtcblxuICAgICAgICAvL1VzZXIgZGVmaW5lZCBjYWxsYmFja1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbJ21lc3NhZ2UnXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbJ21lc3NhZ2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PcGVuKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NoYW5uZWwgY29ubmVjdGVkOicsIGUpO1xuXG4gICAgICAgIC8vVXNlciBkZWZpbmVkIGNhbGxiYWNrXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1snb3BlbiddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snb3BlbiddLmJpbmQodGhpcykoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkVycm9yKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQ2hhbm5lbCBlcnJvcjonLCBlKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydlcnJvciddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snZXJyb3InXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbG9zZShlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2hhbm5lbCBjbG9zZWQ6JywgZSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG5cbiAgICAgICAgLy9Vc2VyIGRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzWydjbG9zZSddKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1snY2xvc2UnXS5iaW5kKHRoaXMpKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVjb25uZWN0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlY29ubmVjdGluZ1wiKTtcbiAgICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwnO1xuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgdmVyc2lvbjogMyxcbiAgICBjbHVzdGVyX2lkOiAnZGVtbycsXG4gICAgYXBpX2tleTogJ29DZENNY01QUXBidk5qVUl6cXR2RjFkMlgyb2tXcERRajRBd0FSSnVBZ3RqaHpLeFZFalFVNklkQ2p3bSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGllU29ja2V0IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gey4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSB7fVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjaGFubmVsSWQpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gdGhpcy5nZXRFbmRwb2ludChjaGFubmVsSWQpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0dXJuaW5nIGV4aXN0aW5nIGNoYW5uZWxcIiwgZW5kcG9pbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnNbY2hhbm5lbElkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbmV3IGNoYW5uZWxcIiwgZW5kcG9pbnQpO1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBDaGFubmVsKGVuZHBvaW50LCB7XG4gICAgICAgICAgICBjaGFubmVsSWQ6IGNoYW5uZWxJZCxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uc1tjaGFubmVsSWRdID0gY2hhbm5lbDtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWw7XG4gICAgfVxuXG4gICAgZ2V0RW5kcG9pbnQoY2hhbm5lbElkKSB7XG4gICAgICAgIHJldHVybiBgd3NzOi8vJHt0aGlzLm9wdGlvbnMuY2x1c3Rlcl9pZH0ud2Vic29ja2V0Lm1lL3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufS8ke2NoYW5uZWxJZH0/YXBpX2tleT0ke3RoaXMub3B0aW9ucy5hcGlfa2V5fWBcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BpZVNvY2tldCcpLmRlZmF1bHQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG1vZHVsZSBleHBvcnRzIG11c3QgYmUgcmV0dXJuZWQgZnJvbSBydW50aW1lIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbnJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9