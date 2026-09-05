import '@babel/polyfill';
import PieSocket from '../src/PieSocket';
import PieRTC from '../src/PieRTC';
import Channel from '../src/Channel';

//Mocks
const mockAddIceCandidate = jest.fn();
const mockCreateAnswer = jest.fn().mockImplementation(() => {
    return Promise.resolve();
});
const mockSetLocalDescription = jest.fn().mockImplementation(() => {
    return Promise.resolve();
});
const mockSetRemoteDescription = jest.fn().mockImplementation(() => {
    return Promise.resolve();
});
jest.mock('../src/misc/RTCPeerConnection.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            addIceCandidate: mockAddIceCandidate,
            setRemoteDescription: mockSetRemoteDescription,
            createAnswer: mockCreateAnswer,
            setLocalDescription: mockSetLocalDescription
        };
    });
});

jest.mock('../src/misc/RTCSessionDescription.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
        };
    });
});

jest.mock('../src/misc/RTCIceCandidate.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
        };
    });
});

const mockWebSocketClose = jest.fn();
const mockWebSocketSend = jest.fn();
jest.mock('../src/misc/WebSocket.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            close: mockWebSocketClose,
            send: mockWebSocketSend
        };
    });
});

const mockOnLocalVideo = jest.fn();
const mockOnParticipantLeft = jest.fn();

describe('PieRTC', function () {

    let piesocket;
    let channel;
    let pieRTC;
    let uuidLocal;
    let uuidRemote;

    beforeAll(() => {
        const roomOptions = {
            video: true
        };

        uuidLocal = "local-tester-uuid";
        uuidRemote = "remote-tester-uuid";

        piesocket = new PieSocket({
            version: 4,
            consoleLogs: false
        });
        channel = new Channel(piesocket.getEndpoint("test"), piesocket.options);
        channel.uuid = uuidLocal;
        pieRTC = new PieRTC(channel, {
            ...piesocket.options,
            ...roomOptions,
            onLocalVideo: mockOnLocalVideo,
            onParticipantLeft: mockOnParticipantLeft
        });
    });

    it('#getUserMediaSuccess - Starts video call as caller, on rtc::request', () => {
        const videoStream = {
            getTracks: jest.fn().mockImplementation(() => {
                return [];
            })
        };
        pieRTC.getUserMediaSuccess(videoStream);
        expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
            "event": "rtc::broadcaster",
            "data": {
                "from": uuidLocal,
                "isBroadcasting": true
            },
        }));
        expect(mockOnLocalVideo).toHaveBeenCalledWith(videoStream, pieRTC);
    });

    it('#shareVideo - Initialize video call as caller, on rtc::request or rtc::offer', () => {
        const shareVideo = pieRTC.shareVideo({
            from: uuidRemote
        }, true);
        const remoteConnection = pieRTC.participants[uuidRemote];
        expect(typeof remoteConnection.rtc).toEqual("object");
        expect(typeof remoteConnection.rtc.onicecandidate).toEqual("function");
        expect(typeof remoteConnection.rtc.ontrack).toEqual("function");
        expect(typeof remoteConnection.rtc.onsignalingstatechange).toEqual("function");
        expect(typeof remoteConnection.rtc.onnegotiationneeded).toEqual("function");
    });

    it('#addIceCandidate - Adds Ice Candidate', () => {
        pieRTC.addIceCandidate({
            from: uuidRemote
        });
        expect(mockAddIceCandidate).toHaveBeenCalled();
    });

    it('#createAnswer - Answers an incoming video offer', done => {
        const remoteConnection = pieRTC.participants[uuidRemote];
        pieRTC.createAnswer({
            from: uuidRemote,
            sdp: {
                type: "offer"
            }
        }).then(() => {
            expect(mockSetRemoteDescription).toHaveBeenCalled();
            expect(mockCreateAnswer).toHaveBeenCalled();
            expect(mockSetLocalDescription).toHaveBeenCalled();

            expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
                "event": "rtc::answer",
                "data": {
                    "from": uuidLocal,
                    "to": uuidRemote
                }
            }));

            done();
        });
    });

    it('#removeParticipant - Removes PieRTC participant', () => {
        pieRTC.removeParticipant(uuidRemote);
        expect(pieRTC.participants).not.toHaveProperty(uuidRemote);
        expect(pieRTC.participants).toHaveLength(0);
        expect(mockOnParticipantLeft).toHaveBeenCalledWith(uuidRemote);
    });

});
