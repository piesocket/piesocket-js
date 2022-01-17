import Logger from './Logger.js';

export default class Video {
    
    /**
     * Creates a video room instance
     * @param {*} channel 
     */
    constructor(channel, identity){
        this.channel = channel;
        this.logger = new Logger(identity);
        this.identity = identity;
        this.localStream = null;
        this.peerConnectionConfig = {
            'iceServers': [
            {'urls': 'stun:stun.stunprotocol.org:3478'},
            {'urls': 'stun:stun.l.google.com:19302'},
            ]
        };
        this.constraints = {
            video: true,
            audio: true
        };

        this.participants = [];
        this.isNegotiating = [];


        this.logger.log('Initializing video room');
        this.init();
    }

    /**
     * Initialize local video
     */
    init(){ 
        if(navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler);
		} else {
			alert('Your browser does not support getUserMedia API');
		}
    }

    shareVideo(signal, isCaller=true){

        const rtcConnection = new RTCPeerConnection(this.peerConnectionConfig);

        rtcConnection.onicecandidate = (event) => {
            if(event.candidate != null) {    
               this.channel.publish("system:video_accept",{
                   'from': this.channel.uuid,
                   'to': signal.from,
                   'ice': event.candidate,
               });
           }
        }

        rtcConnection.ontrack = (event) => {
			if(event.track.kind!="video"){
				return;
			}	

            this.participants[signal.from].streams = event.streams;
            if(typeof this.identity.onParticipantJoined == "function"){
                this.identity.onParticipantJoined(signal.from, event.streams[0]);
            }        
		}

        rtcConnection.onsignalingstatechange = (e) => {  
            // Workaround for Chrome: skip nested negotiations
            this.isNegotiating[signal.from] = (rtcConnection.signalingState != "stable");
        }

        this.localStream.getTracks().forEach((track) => { rtcConnection.addTrack(track, this.localStream); });
        
        this.isNegotiating[signal.from] = false;
        rtcConnection.onnegotiationneeded = async () => {

            if(!isCaller){
                return;
            }

            console.log("I need negotiation");

 			if (this.isNegotiating[signal.from]) {
			    console.log("SKIP nested negotiations");
			    return;
		    } 

 			this.isNegotiating[signal.from] = true;


 			var description = await rtcConnection.createOffer();                       
            await rtcConnection.setLocalDescription(description); 
            
            console.log('Making offer');
            //Send a call offer
            this.channel.publish("system:video_offer", {
                'from': this.channel.uuid,
                'to' : signal.from,
                'sdp': rtcConnection.localDescription, 
            });
				 			
		}; 

        this.participants[signal.from] = {
            rtc: rtcConnection
        };
    }

    removeParticipant(uuid){
        delete this.participants[uuid];

        if(typeof this.identity.onParticipantLeft == "function"){
            this.identity.onParticipantLeft(uuid);
        }
    }

    addIceCandidate(signal){
        const rtcConnection =  this.participants[signal.from].rtc;
        rtcConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
    }

    createAnswer(signal){
        if(!this.participants[signal.from] || !this.participants[signal.from].rtc) {
            console.log("Starting call in createAnswer")
            this.shareVideo(signal, false);
        }
        
        this.participants[signal.from].rtc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
            // Only create answers in response to offers
            if(signal.sdp.type == 'offer') {
              
              console.log("Got an offer from "+signal.from,signal)

              this.participants[signal.from].rtc.createAnswer().then((description) => {
                    //The remove description  		
                    this.participants[signal.from].rtc.setLocalDescription(description).then(function() {
                      this.channel.publish("system:video_offer", {
                        'from' : this.channel.uuid,
                        'to' : signal.from,
                        'sdp': this.participants[signal.from].rtc.localDescription
                      });						
                  }.bind(this)).catch(this.errorHandler);

                }).catch(this.errorHandler);
            }else{
              console.log("Got an asnwer from "+signal.from);		
            }
            
        }.bind(this)).catch(this.errorHandler);
    }

    /**
     * Callback to handle local stream
     * @param {*} stream 
     */
    getUserMediaSuccess(stream) {
        this.localStream = stream;
        this.channel.publish("system:video_request",{
            from: this.channel.uuid
        });

        if(typeof this.identity.onLocalVideo == "function"){
            this.identity.onLocalVideo(stream, this);
        }
    }

    
    errorHandler(e){
        console.error("Error",e);
    }

}