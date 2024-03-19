let peerConnection = {};
try {
  peerConnection = RTCPeerConnection;
} catch (e) {}
export default peerConnection;
