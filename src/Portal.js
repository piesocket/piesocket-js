import Logger from './Logger.js';
import IceCandidate from './misc/RTCIceCandidate.js';
import PeerConnection from './misc/RTCPeerConnection.js';
import SessionDescription from './misc/RTCSessionDescription.js';
const defaultPortalOptions = {
  shouldBroadcast: true,
  portal: true,
  video: false,
  audio: true
};

export default class Portal {
  /**
     * Creates a video room instance
     * @param {*} channel
     */
  constructor(channel, identity) {
    this.channel = channel;
    this.logger = new Logger(identity);
    this.identity = { ...defaultPortalOptions, ...identity };
    this.localStream = null;
    this.senders = [];
    this.cameraStream = null;
    this.sharingScreen = false;
    this.peerConnectionConfig = {
      'iceServers': [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' },
      ],
    };
    this.constraints = {
      video: identity.video,
      audio: identity.audio,
    };

    this.participants = [];
    this.isNegotiating = [];


    this.logger.log('Initializing video room');
    this.init();
  }

  /**
     * Initialize local video
     */
  init() {
    if (!this.constraints.video && !this.constraints.audio) {
      this.requestPeerVideo();
      return;
    }

    if (typeof navigator != 'undefined' && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler.bind(this));
      return true;
    } else {
      this.logger.error('Your browser does not support getUserMedia API');
      return false;
    }
  }

  shareVideo(signal, isCaller = true) {
    if (!this.identity.shouldBroadcast && isCaller && !signal.isBroadcasting) {
      console.log("Refusing to call, denied broadcast request");
      return;
    }

    console.log("peer connection", PeerConnection);
    const rtcConnection = new PeerConnection(this.peerConnectionConfig);

    rtcConnection.onicecandidate = (event) => {
      if (event.candidate != null) {
        this.channel.publish('system:portal_candidate', {
          'from': this.channel.uuid,
          'to': signal.from,
          'ice': event.candidate,
        });
      }
    };

    rtcConnection.ontrack = (event) => {
      if (event.track.kind != 'video') {
        return;
      }

      this.participants[signal.from].streams = event.streams;
      if (typeof this.identity.onParticipantJoined == 'function') {
        this.identity.onParticipantJoined(signal.from, event.streams[0]);
      }
    };

    rtcConnection.onsignalingstatechange = (e) => {
      // Workaround for Chrome: skip nested negotiations
      this.isNegotiating[signal.from] = (rtcConnection.signalingState != 'stable');
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.senders.push(rtcConnection.addTrack(track, this.localStream));
      });
    }

    this.isNegotiating[signal.from] = false;


    rtcConnection.onnegotiationneeded = async () => {
      await this.sendVideoOffer(signal, rtcConnection, isCaller);
    };

    this.participants[signal.from] = {
      rtc: rtcConnection,
    };
  }

  shareScreen() {
    if(!this.sharingScreen){
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(screenStream => {
          const screenTrack = screenStream.getTracks()[0];
          this.localStream = screenStream;

          if (typeof this.identity.onLocalVideo == 'function') {
            this.identity.onLocalVideo(screenStream, this);
          }
          this.sharingScreen = true;
          for (const sender of this.senders) {
            if (sender.track && sender.track.kind === 'video')
              sender.replaceTrack(screenTrack);
          }
          alert("Screen sharing started! To stop, click on Stop Sharing button at the bottom!")

          screenTrack.onended = () => {
            this.localStream = this.cameraStream;
            this.sharingScreen = false;
            if (typeof this.identity.onLocalVideo == 'function') {
              this.identity.onLocalVideo(this.cameraStream, this);
            }
            for (const sender of this.senders) {
              if (sender.track && sender.track.kind === 'video') {
                sender.replaceTrack(this.cameraStream.getTracks()[0]);
              }
            }
          }
        })
        .catch(error => {
          console.error('Error sharing screen:', error);
          if (error.name === 'NotAllowedError') {
            console.error('User denied permission for screen sharing.');
          } else if (error.name === 'NotFoundError') {
            console.error('Display media not found (possibly due to privacy settings).');
          } else {
            console.error('Unknown error during screen sharing:', error);
          }
        });
    }else{
      alert("You are already sharing screen!");
    }
  }

  async sendVideoOffer(signal, rtcConnection, isCaller) {

    if (!isCaller) {
      return;
    }


    if (this.isNegotiating[signal.from]) {
      console.log('SKIP nested negotiations');
      return;
    }

    this.isNegotiating[signal.from] = true;


    const description = await rtcConnection.createOffer();
    await rtcConnection.setLocalDescription(description);

    console.log('Making offer');
    // Send a call offer
    this.channel.publish('system:video_offer', {
      'from': this.channel.uuid,
      'to': signal.from,
      'sdp': rtcConnection.localDescription,
    });

  }

  removeParticipant(uuid) {
    delete this.participants[uuid];

    if (typeof this.identity.onParticipantLeft == 'function') {
      this.identity.onParticipantLeft(uuid);
    }
  }

  addIceCandidate(signal) {
    const rtcConnection = this.participants[signal.from].rtc;
    rtcConnection.addIceCandidate(new IceCandidate(signal.ice));
  }

  createAnswer(signal) {
    return new Promise(async (resolve, reject) => {
      if (!this.participants[signal.from] || !this.participants[signal.from].rtc) {
        console.log('Starting call in createAnswer');
        this.shareVideo(signal, false);
      }

      await this.participants[signal.from].rtc.setRemoteDescription(new SessionDescription(signal.sdp));
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        this.logger.log('Got an offer from ' + signal.from, signal);
        const description = await this.participants[signal.from].rtc.createAnswer();

        await this.participants[signal.from].rtc.setLocalDescription(description);
        this.channel.publish('system:video_answer', {
          'from': this.channel.uuid,
          'to': signal.from,
          'sdp': this.participants[signal.from].rtc.localDescription,
        });
        resolve();
      } else {
        this.logger.log('Got an asnwer from ' + signal.from);

        resolve();
      }
    });
  }

  handleAnswer(signal){
    this.participants[signal.from].rtc.setRemoteDescription(new SessionDescription(signal.sdp));
  }

  /**
     * Callback to handle local stream
     * @param {*} stream
     */
  getUserMediaSuccess(stream) {
    this.localStream = stream;
    this.cameraStream = stream;

    if (typeof this.identity.onLocalVideo == 'function') {
      this.identity.onLocalVideo(stream, this);
    }

    this.requestPeerVideo();
  }

  requestPeerVideo() {
    var eventName = 'system:portal_broadcaster';

    if(!this.identity.shouldBroadcast){
      eventName = 'system:portal_watcher';
    }

    this.channel.publish(eventName, {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast
    });
  }

  requestOfferFromPeer(){
    this.channel.publish("system:video_request", {
      from: this.channel.uuid,
      isBroadcasting: this.identity.shouldBroadcast
    });
  }

  errorHandler(e) {
    this.logger.error('Portal error', e);
  }
}
