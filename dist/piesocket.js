var PieSocket;(()=>{var t={820:(t,e,n)=>{"use strict";n.d(e,{default:()=>f});class s{constructor(t){this.options=t}log(...t){this.options.consoleLogs&&console.log(...t)}warn(...t){this.options.consoleLogs&&console.warn(...t)}error(...t){this.options.consoleLogs&&console.error(...t)}}const o=JSON.parse('{"Mt":[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"string","name":"transaction_hash","type":"string"}],"name":"Confirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"string","name":"payload","type":"string"}],"name":"Sent","type":"event"},{"inputs":[{"internalType":"string","name":"payload","type":"string"}],"name":"send","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"transaction_hash","type":"string"}],"name":"confirm","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]}');class i{constructor(t){this.options=t,this.apiKey=this.options.apiKey,this.channel=this.options.channelId,this.blockchainTestMode=this.options.blockchainTestMode,this.blockchainGasFee=this.options.blockchainGasFee,this.blockchainTestMode?this.contractAddress="0x2321c321828946153a845e69ee168f413e85c90d":this.contractAddress="0x2a840CA40E082DbF24610B62a978900BfCaB23D3"}async init(){const t=new Web3(window.ethereum),e=await ethereum.request({method:"eth_requestAccounts"});this.account=e[0],this.contract=new t.eth.Contract(o.Mt,this.contractAddress)}checkWeb3(){return"undefined"==typeof Web3?(console.log("Web3.js is not installed!"),!1):void 0!==window.ethereum||(console.log("MetaMask is not installed!"),!1)}async confirm(t){return new Promise((async(e,n)=>{if(this.checkWeb3()){this.contract||await this.init();const s=this.contract.methods.confirm(t).send({from:this.account,gas:this.blockchainGasFee});s.on("transactionHash",e),s.on("error",(t=>{n(t)}))}}))}async send(t){return new Promise((async(e,n)=>{if(this.checkWeb3()){this.contract||await this.init();const s=await this.getTransactionHash(t),o=this.contract.methods.send(s.payload).send({from:this.account,gas:this.blockchainGasFee});o.on("transactionHash",(t=>{e({hash:t,id:s.transaction_id})})),o.on("error",(t=>{n(t)}))}else"undefined"==typeof Web3?n("Please install Web3.js"):n("Please install MetaMask")}))}async getTransactionHash(t){return new Promise(((e,n)=>{const s=new FormData;s.append("apiKey",this.apiKey),s.append("channel",this.channel),s.append("message",JSON.stringify(t)),s.append("contract",this.contractAddress);const o=new XMLHttpRequest;o.addEventListener("readystatechange",(function(){if(4===this.readyState)try{const t=JSON.parse(this.responseText);t.errors&&(console.error(`PieSocket Error: ${JSON.stringify(t.errors)}`),n()),t.success?e(t.success):n("Unknown error")}catch(t){console.error("Could not connect to Blockchain Messaging API, try later"),n()}})),o.addEventListener("error",(()=>{console.error("Blockchain Messaging API seems unreachable at the moment, try later"),n()})),o.open("POST","https://www.piesocket.com/api/blockchain/payloadHash"),o.setRequestHeader("Accept","application/json"),o.send(s)}))}}const r=WebSocket;class a{constructor(t,e,n=!0){this.events={},this.listeners={},this.members=[],this.portal=null,this.uuid=null,this.onSocketConnected=()=>{},this.onSocketError=()=>{},n&&this.init(t,e)}init(t,e){this.endpoint=t,this.identity=e,this.connection=this.connect(),this.shouldReconnect=!1,this.logger=new s(e)}getMemberByUUID(t){let e=null;for(let n=0;n<this.members.length;n++)if(this.members[n].uuid==t){e=this.members[n];break}return e}getCurrentMember(){return this.getMemberByUUID(this.uuid)}connect(){const t=new r(this.endpoint);return t.onmessage=this.onMessage.bind(this),t.onopen=this.onOpen.bind(this),t.onerror=this.onError.bind(this),t.onclose=this.onClose.bind(this),this.identity.onSocketConnected&&(this.onSocketConnected=this.identity.onSocketConnected),this.identity.onSocketError&&(this.onSocketError=this.identity.onSocketError),t}on(t,e){this.events[t]=e}listen(t,e){this.listeners[t]=e}send(t){return this.connection.send(t)}async publish(t,e,n){return n&&n.blockchain?await this.sendOnBlockchain(t,e,n):this.connection.send(JSON.stringify({event:t,data:e,meta:n}))}async sendOnBlockchain(t,e,n){this.blockchain||(this.blockchain=new i(this.identity));try{const s=await this.blockchain.send(e);return this.events["blockchain-hash"]&&this.events["blockchain-hash"].bind(this)({event:t,data:e,meta:n,transactionHash:s.hash}),this.connection.send(JSON.stringify({event:t,data:e,meta:{...n,transaction_id:s.id,transaction_hash:s.hash}}))}catch(t){this.events["blockchain-error"]&&this.events["blockchain-error"].bind(this)(t)}}async confirmOnBlockchain(t,e){this.blockchain||(this.blockchain=new i(this.identity));try{const n=await this.blockchain.confirm(e);return this.events["blockchain-hash"]&&this.events["blockchain-hash"].bind(this)({event:t,confirmationHash:e,transactionHash:n}),this.connection.send(JSON.stringify({event:t,data:e,meta:{transaction_id:1,transaction_hash:n}}))}catch(t){this.events["blockchain-error"]&&this.events["blockchain-error"].bind(this)(t)}}onMessage(t){this.logger.log("Channel message:",t);try{const e=JSON.parse(t.data);e.error&&e.error.length&&(this.shouldReconnect=!1),e.event&&(this.handleMemberHandshake(e),this.listeners[e.event]&&this.listeners[e.event].bind(this)(e.data,e.meta),this.listeners["*"]&&this.listeners["*"].bind(this)(e.event,e.data,e.meta))}catch(t){console.error(t)}this.events.message&&this.events.message.bind(this)(t)}handleMemberHandshake(t){"system:member_list"==t.event||"system:member_joined"==t.event?this.members=t.data.members:"system:member_left"==t.event?(this.members=t.data.members,this.portal&&this.portal.removeParticipant(t.data.member.uuid)):"system:portal_broadcaster"==t.event&&t.data.from!=this.uuid?this.portal.requestOfferFromPeer(t.data):"system:portal_watcher"==t.event&&t.data.from!=this.uuid||"system:video_request"==t.event&&t.data.from!=this.uuid?this.portal.shareVideo(t.data):"system:portal_candidate"==t.event&&t.data.to==this.uuid?this.portal.addIceCandidate(t.data):"system:video_offer"==t.event&&t.data.to==this.uuid?this.portal.createAnswer(t.data):"system:video_answer"==t.event&&t.data.to==this.uuid&&this.portal.handleAnswer(t.data)}onOpen(t){this.logger.log("Channel connected:",t),this.shouldReconnect=!0,this.onSocketConnected(t)}onError(t){this.logger.error("Channel error:",t),this.connection.close(),this.onSocketError(t),this.events.error&&this.events.error.bind(this)(t)}onClose(t){this.logger.warn("Channel closed:",t),this.reconnect(),this.events.close&&this.events.close.bind(this)(t)}reconnect(){this.shouldReconnect&&(this.logger.log("Reconnecting"),this.connection=this.connect())}}class c{constructor(t=null,e="InvalidAuthException"){this.message=t||"Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication",this.name=e}}const h={version:3,clusterId:"demo",apiKey:"oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm",consoleLogs:!1,notifySelf:0,jwt:null,presence:0,authEndpoint:"/broadcasting/auth",authHeaders:{},forceAuth:!1,userId:null,blockchainTestMode:!1,blockchainGasFee:41e3};var d,l=new Uint8Array(16);function u(){if(!d&&!(d="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return d(l)}const p=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,m=function(t){return"string"==typeof t&&p.test(t)};for(var y=[],b=0;b<256;++b)y.push((b+256).toString(16).substr(1));const g=function(t,e,n){var s=(t=t||{}).random||(t.rng||u)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,e){n=n||0;for(var o=0;o<16;++o)e[n+o]=s[o];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(y[t[e+0]]+y[t[e+1]]+y[t[e+2]]+y[t[e+3]]+"-"+y[t[e+4]]+y[t[e+5]]+"-"+y[t[e+6]]+y[t[e+7]]+"-"+y[t[e+8]]+y[t[e+9]]+"-"+y[t[e+10]]+y[t[e+11]]+y[t[e+12]]+y[t[e+13]]+y[t[e+14]]+y[t[e+15]]).toLowerCase();if(!m(n))throw TypeError("Stringified UUID is invalid");return n}(s)};class f{constructor(t){t=t||{},this.options={...h,...t},this.connections={},this.logger=new s(this.options)}async subscribe(t,e={}){return new Promise((async(e,n)=>{const s=g(),o=await this.getEndpoint(t,s);if(this.connections[t])this.logger.log("Returning existing channel",t),e(this.connections[t]);else{this.logger.log("Creating new channel",t);const i=new a(o,{channelId:t,onSocketConnected:()=>{i.uuid=s,this.connections[t]=i,e(i)},onSocketError:()=>{n("Failed to make websocket connection")},...this.options});"undefined"==typeof WebSocket&&(i.uuid=s,this.connections[t]=i,e(i))}}))}unsubscribe(t){return!!this.connections[t]&&(this.connections[t].shouldReconnect=!1,this.connections[t].connection.close(),delete this.connections[t],!0)}getConnections(){return this.connections}async getAuthToken(t){return new Promise(((e,n)=>{const s=new FormData;s.append("channel_name",t);const o=new XMLHttpRequest;o.withCredentials=!0,o.addEventListener("readystatechange",(function(){if(4===this.readyState)try{const t=JSON.parse(this.responseText);e(t)}catch(t){n(new c("Could not fetch auth token","AuthEndpointResponseError"))}})),o.addEventListener("error",(()=>{n(new c("Could not fetch auth token","AuthEndpointError"))})),o.open("POST",this.options.authEndpoint),Object.keys(this.options.authHeaders).forEach((t=>{o.setRequestHeader(t,this.options.authHeaders[t])})),o.send(s)}))}isGuarded(t){return!!this.options.forceAuth||(""+t).startsWith("private-")}async getEndpoint(t,e){let n=`wss://${this.options.clusterId}.piesocket.com/v${this.options.version}/${t}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=3.0.7&presence=${this.options.presence}`;if(this.options.jwt)n=n+"&jwt="+this.options.jwt;else if(this.isGuarded(t)){const e=await this.getAuthToken(t);e.auth&&(n=n+"&jwt="+e.auth)}return this.options.userId&&(n=n+"&user="+this.options.userId),n=n+"&uuid="+e,n}}},138:(t,e,n)=>{t.exports=n(820).default}},e={};function n(s){var o=e[s];if(void 0!==o)return o.exports;var i=e[s]={exports:{}};return t[s](i,i.exports,n),i.exports}n.d=(t,e)=>{for(var s in e)n.o(e,s)&&!n.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var s=n(138);PieSocket=s})();