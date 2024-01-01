var iceCandidate = {};
try{ 
    iceCandidate = RTCIceCandidate;
}catch(e){}
export default iceCandidate;
