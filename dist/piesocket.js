var PieSocket;(()=>{"use strict";var t={d:(e,s)=>{for(var n in s)t.o(s,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:s[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};(()=>{t.r(e),t.d(e,{default:()=>M});class s{constructor(t){this.options=t}log(...t){this.options.consoleLogs&&console.log(...t)}warn(...t){this.options.consoleLogs&&console.warn(...t)}error(...t){this.options.consoleLogs&&console.error(...t)}}const n={};class i{constructor(t){this.options=t,this.apiKey=this.options.apiKey,this.channel=this.options.channelId,this.blockchainTestMode=this.options.blockchainTestMode,this.blockchainGasFee=this.options.blockchainGasFee,this.blockchainTestMode?this.contractAddress="0x2321c321828946153a845e69ee168f413e85c90d":this.contractAddress="0x2a840CA40E082DbF24610B62a978900BfCaB23D3"}async init(){const t=new Web3(window.ethereum),e=await ethereum.request({method:"eth_requestAccounts"});this.account=e[0],this.contract=new t.eth.Contract(n.abi,this.contractAddress)}checkWeb3(){return"undefined"==typeof Web3?(console.log("Web3.js is not installed!"),!1):void 0!==window.ethereum||(console.log("MetaMask is not installed!"),!1)}async confirm(t){return new Promise((async(e,s)=>{if(this.checkWeb3()){this.contract||await this.init();const n=this.contract.methods.confirm(t).send({from:this.account,gas:this.blockchainGasFee});n.on("transactionHash",e),n.on("error",(t=>{s(t)}))}}))}async send(t){return new Promise((async(e,s)=>{if(this.checkWeb3()){this.contract||await this.init();const n=await this.getTransactionHash(t),i=this.contract.methods.send(n.payload).send({from:this.account,gas:this.blockchainGasFee});i.on("transactionHash",(t=>{e({hash:t,id:n.transaction_id})})),i.on("error",(t=>{s(t)}))}else"undefined"==typeof Web3?s("Please install Web3.js"):s("Please install MetaMask")}))}async getTransactionHash(t){return new Promise(((e,s)=>{const n=new FormData;n.append("apiKey",this.apiKey),n.append("channel",this.channel),n.append("message",JSON.stringify(t)),n.append("contract",this.contractAddress);const i=new XMLHttpRequest;i.addEventListener("readystatechange",(function(){if(4===this.readyState)try{const t=JSON.parse(this.responseText);t.errors&&(console.error(`PieSocket Error: ${JSON.stringify(t.errors)}`),s()),t.success?e(t.success):s("Unknown error")}catch(t){console.error("Could not connect to Blockchain Messaging API, try later"),s()}})),i.addEventListener("error",(()=>{console.error("Blockchain Messaging API seems unreachable at the moment, try later"),s()})),i.open("POST","https://www.piesocket.com/api/blockchain/payloadHash"),i.setRequestHeader("Accept","application/json"),i.send(n)}))}}let o={};try{o=WebSocket}catch(t){}const r=o;class a{constructor(t,e,s=!0){this.events={},this.listeners={},this.members=[],this.portal=null,this.uuid=null,this.onSocketConnected=()=>{},this.onSocketError=()=>{},s&&this.init(t,e)}init(t,e){this.endpoint=t,this.identity=e,this.connection=this.connect(),this.shouldReconnect=!1,this.logger=new s(e)}getMemberByUUID(t){let e=null;for(let s=0;s<this.members.length;s++)if(this.members[s].uuid==t){e=this.members[s];break}return e}getCurrentMember(){return this.getMemberByUUID(this.uuid)}connect(){const t=new r(this.endpoint);return t.onmessage=this.onMessage.bind(this),t.onopen=this.onOpen.bind(this),t.onerror=this.onError.bind(this),t.onclose=this.onClose.bind(this),this.identity.onSocketConnected&&(this.onSocketConnected=this.identity.onSocketConnected),this.identity.onSocketError&&(this.onSocketError=this.identity.onSocketError),t}on(t,e){this.events[t]=e}listen(t,e){this.listeners[t]=e}send(t){return this.connection.send(t)}async publish(t,e,s){return s&&s.blockchain?await this.sendOnBlockchain(t,e,s):this.connection.send(JSON.stringify({event:t,data:e,meta:s}))}async sendOnBlockchain(t,e,s){this.blockchain||(this.blockchain=new i(this.identity));try{const n=await this.blockchain.send(e);return this.events["blockchain-hash"]&&this.events["blockchain-hash"].bind(this)({event:t,data:e,meta:s,transactionHash:n.hash}),this.connection.send(JSON.stringify({event:t,data:e,meta:{...s,transaction_id:n.id,transaction_hash:n.hash}}))}catch(t){this.events["blockchain-error"]&&this.events["blockchain-error"].bind(this)(t)}}async confirmOnBlockchain(t,e){this.blockchain||(this.blockchain=new i(this.identity));try{const s=await this.blockchain.confirm(e);return this.events["blockchain-hash"]&&this.events["blockchain-hash"].bind(this)({event:t,confirmationHash:e,transactionHash:s}),this.connection.send(JSON.stringify({event:t,data:e,meta:{transaction_id:1,transaction_hash:s}}))}catch(t){this.events["blockchain-error"]&&this.events["blockchain-error"].bind(this)(t)}}onMessage(t){this.logger.log("Channel message:",t);try{const e=JSON.parse(t.data);e.error&&e.error.length&&(this.shouldReconnect=!1),e.event&&(this.handleMemberHandshake(e),this.listeners[e.event]&&this.listeners[e.event].bind(this)(e.data,e.meta),this.listeners["*"]&&this.listeners["*"].bind(this)(e.event,e.data,e.meta))}catch(t){console.error(t)}this.events.message&&this.events.message.bind(this)(t)}handleMemberHandshake(t){"system:member_list"==t.event||"system:member_joined"==t.event?this.members=t.data.members:"system:member_left"==t.event?(this.members=t.data.members,this.portal&&this.portal.removeParticipant(t.data.member.uuid)):"system:portal_broadcaster"==t.event&&t.data.from!=this.uuid?this.portal.requestOfferFromPeer(t.data):"system:stopped_screen"==t.event&&t.data.from!=this.uuid?this.portal.onRemoteScreenStopped(t.data.from,t.data.streamId):"system:portal_watcher"==t.event&&t.data.from!=this.uuid||"system:video_request"==t.event&&t.data.from!=this.uuid?this.portal.shareVideo(t.data):"system:portal_candidate"==t.event&&t.data.to==this.uuid?this.portal.addIceCandidate(t.data):"system:video_offer"==t.event&&t.data.to==this.uuid?this.portal.createAnswer(t.data):"system:video_answer"==t.event&&t.data.to==this.uuid&&this.portal.handleAnswer(t.data)}onOpen(t){this.logger.log("Channel connected:",t),this.shouldReconnect=!0,this.onSocketConnected(t)}onError(t){this.logger.error("Channel error:",t),this.connection.close(),this.onSocketError(t),this.events.error&&this.events.error.bind(this)(t)}onClose(t){this.logger.warn("Channel closed:",t),this.reconnect(),this.events.close&&this.events.close.bind(this)(t)}reconnect(){this.shouldReconnect&&(this.logger.log("Reconnecting"),this.connection=this.connect())}}let c={};try{c=RTCIceCandidate}catch(t){}const h=c;let d={};try{d=RTCPeerConnection}catch(t){}const l=d;let u={};try{u=RTCSessionDescription}catch(t){}const p=u,m={shouldBroadcast:!0,portal:!0,video:!1,audio:!0};class g{constructor(t,e){this.channel=t,this.logger=new s(e),this.identity={...m,...e},this.localStream=null,this.displayStream=null,this.peerConnectionConfig={iceServers:[{urls:"stun:stun.stunprotocol.org:3478"},{urls:"stun:stun.l.google.com:19302"}]},this.constraints={video:e.video,audio:e.audio},this.participants=[],this.isNegotiating=[],this.logger.log("Initializing video room"),this.init()}init(){if(this.constraints.video||this.constraints.audio)return"undefined"!=typeof navigator&&navigator.mediaDevices.getUserMedia?(navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler.bind(this)),!0):(this.logger.error("Your browser does not support getUserMedia API"),!1);this.requestPeerVideo()}shareVideo(t,e=!0){if(!this.identity.shouldBroadcast&&e&&!t.isBroadcasting)return void console.log("Refusing to call, denied broadcast request");const s=new l(this.peerConnectionConfig);s.onicecandidate=e=>{null!=e.candidate&&this.channel.publish("system:portal_candidate",{from:this.channel.uuid,to:t.from,ice:e.candidate})},s.ontrack=e=>{"video"==e.track.kind&&(this.participants[t.from].streams=e.streams,"function"==typeof this.identity.onParticipantJoined&&this.identity.onParticipantJoined(t.from,e.streams[0]))},s.onsignalingstatechange=e=>{this.isNegotiating[t.from]="stable"!=s.signalingState},this.localStream&&this.localStream.getTracks().forEach((t=>{s.addTrack(t,this.localStream)})),this.displayStream&&this.displayStream.getTracks().forEach((t=>{s.addTrack(t,this.displayStream)})),this.isNegotiating[t.from]=!1,s.onnegotiationneeded=async()=>{await this.sendVideoOffer(t,s,e)},this.participants[t.from]={rtc:s}}async onRemoteScreenStopped(t,e){"function"==typeof this.identity.onScreenSharingStopped&&this.identity.onScreenSharingStopped(t,e)}async onLocalScreen(t){t.getVideoTracks()[0].addEventListener("ended",(()=>{this.channel.publish("system:stopped_screen",{from:this.channel.uuid,streamId:t.id})})),this.displayStream=t;const e=this.participants;Object.keys(e).forEach((s=>{const n=e[s].rtc;t.getTracks().forEach((e=>{n.addTrack(e,t)}))}))}async shareScreen(){navigator.mediaDevices.getDisplayMedia().then(this.onLocalScreen.bind(this)).catch(this.errorHandler.bind(this))}async sendVideoOffer(t,e,s){if(this.isNegotiating[t.from])return void console.log("SKIP nested negotiations");this.isNegotiating[t.from]=!0;const n=await e.createOffer();await e.setLocalDescription(n),console.log("Making offer"),this.channel.publish("system:video_offer",{from:this.channel.uuid,to:t.from,sdp:e.localDescription})}removeParticipant(t){delete this.participants[t],"function"==typeof this.identity.onParticipantLeft&&this.identity.onParticipantLeft(t)}addIceCandidate(t){this.participants[t.from].rtc.addIceCandidate(new h(t.ice))}createAnswer(t){return new Promise((async(e,s)=>{if(this.participants[t.from]&&this.participants[t.from].rtc||(console.log("Starting call in createAnswer"),this.shareVideo(t,!1)),await this.participants[t.from].rtc.setRemoteDescription(new p(t.sdp)),"offer"==t.sdp.type){this.logger.log("Got an offer from "+t.from,t);const s=await this.participants[t.from].rtc.createAnswer();await this.participants[t.from].rtc.setLocalDescription(s),this.channel.publish("system:video_answer",{from:this.channel.uuid,to:t.from,sdp:this.participants[t.from].rtc.localDescription}),e()}else this.logger.log("Got an asnwer from "+t.from),e()}))}handleAnswer(t){this.participants[t.from].rtc.setRemoteDescription(new p(t.sdp))}getUserMediaSuccess(t){this.localStream=t,"function"==typeof this.identity.onLocalVideo&&this.identity.onLocalVideo(t,this),this.requestPeerVideo()}requestPeerVideo(){let t="system:portal_broadcaster";this.identity.shouldBroadcast||(t="system:portal_watcher"),this.channel.publish(t,{from:this.channel.uuid,isBroadcasting:this.identity.shouldBroadcast})}requestOfferFromPeer(){this.channel.publish("system:video_request",{from:this.channel.uuid,isBroadcasting:this.identity.shouldBroadcast})}errorHandler(t){this.logger.error("Portal error",t)}}class f{constructor(t=null,e="InvalidAuthException"){this.message=t||"Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication",this.name=e}}const y={version:3,clusterId:"demo",clusterDomain:null,apiKey:"oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm",consoleLogs:!1,notifySelf:0,jwt:null,presence:0,authEndpoint:"/broadcasting/auth",authHeaders:{},forceAuth:!1,userId:null,blockchainTestMode:!1,blockchainGasFee:41e3};var b,v=new Uint8Array(16);function w(){if(!b&&!(b="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return b(v)}const k=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var S=[],C=0;C<256;++C)S.push((C+256).toString(16).substr(1));const P=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=(S[t[e+0]]+S[t[e+1]]+S[t[e+2]]+S[t[e+3]]+"-"+S[t[e+4]]+S[t[e+5]]+"-"+S[t[e+6]]+S[t[e+7]]+"-"+S[t[e+8]]+S[t[e+9]]+"-"+S[t[e+10]]+S[t[e+11]]+S[t[e+12]]+S[t[e+13]]+S[t[e+14]]+S[t[e+15]]).toLowerCase();if(!function(t){return"string"==typeof t&&k.test(t)}(s))throw TypeError("Stringified UUID is invalid");return s},E=function(t,e,s){var n=(t=t||{}).random||(t.rng||w)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,e){s=s||0;for(var i=0;i<16;++i)e[s+i]=n[i];return e}return P(n)},M=class{constructor(t){t=t||{},this.options={...y,...t},this.connections={},this.logger=new s(this.options)}async subscribe(t,e={}){return new Promise((async(s,n)=>{(e.video||e.audio||e.portal)&&(this.options.notifySelf=!0);const i=E(),o=await this.getEndpoint(t,i);if(this.connections[t])this.logger.log("Returning existing channel",t),s(this.connections[t]);else{this.logger.log("Creating new channel",t);const r=new a(o,{channelId:t,onSocketConnected:()=>{r.uuid=i,(e.video||e.audio||e.portal)&&(r.portal=new g(r,{...this.options,...e})),this.connections[t]=r,s(r)},onSocketError:()=>{n("Failed to make websocket connection")},...this.options});"undefined"==typeof WebSocket&&(r.uuid=i,this.connections[t]=r,s(r))}}))}unsubscribe(t){return!!this.connections[t]&&(this.connections[t].shouldReconnect=!1,this.connections[t].connection.close(),delete this.connections[t],!0)}getConnections(){return this.connections}async getAuthToken(t){return new Promise(((e,s)=>{const n=new FormData;n.append("channel_name",t);const i=new XMLHttpRequest;i.withCredentials=!0,i.addEventListener("readystatechange",(function(){if(4===this.readyState)try{const t=JSON.parse(this.responseText);e(t)}catch(t){s(new f("Could not fetch auth token","AuthEndpointResponseError"))}})),i.addEventListener("error",(()=>{s(new f("Could not fetch auth token","AuthEndpointError"))})),i.open("POST",this.options.authEndpoint),Object.keys(this.options.authHeaders).forEach((t=>{i.setRequestHeader(t,this.options.authHeaders[t])})),i.send(n)}))}isGuarded(t){return!!this.options.forceAuth||(""+t).startsWith("private-")}async getEndpoint(t,e){let s=`wss://${null==this.options.clusterDomain?`${this.options.clusterId}.piesocket.com`:this.options.clusterDomain}/v${this.options.version}/${t}?api_key=${this.options.apiKey}&notify_self=${this.options.notifySelf}&source=jssdk&v=5.0.8&presence=${this.options.presence}`;if(this.options.jwt)s=s+"&jwt="+this.options.jwt;else if(this.isGuarded(t)){const e=await this.getAuthToken(t);e.auth&&(s=s+"&jwt="+e.auth)}return this.options.userId&&(s=s+"&user="+this.options.userId),s=s+"&uuid="+e,s}}})(),PieSocket=e})();