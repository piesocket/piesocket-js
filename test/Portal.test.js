import '@babel/polyfill';
import PieSocket from '../src/PieSocket';
import Portal from '../src/Portal';
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

describe('Portal', function () {

    let piesocket;
    let channel;
    let portal;
    let uuidLocal;
    let uuidRemote;

    beforeAll(() => {
        const roomOptions = {
            video: true
        };

        uuidLocal = "local-tester-uuid";
        uuidRemote = "remote-tester-uuid";

        piesocket = new PieSocket({
            consoleLogs: false
        });
        channel = new Channel(piesocket.getEndpoint("test"), piesocket.options);
        channel.uuid = uuidLocal;
        portal = new Portal(channel, {
            ...piesocket.options,
            ...roomOptions,
            onLocalVideo: mockOnLocalVideo,
            onParticipantLeft: mockOnParticipantLeft
        });
    });

    it('#getUserMediaSuccess - Starts video call as caller, on system:video_request', () => {
        const videoStream = {
            getTracks: jest.fn().mockImplementation(() => {
                return [];
            })
        };
        portal.getUserMediaSuccess(videoStream);
        expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
            "event": "system:portal_broadcaster",
            "data": {
                "from": uuidLocal,
                "isBroadcasting": true
            },
        }));
        expect(mockOnLocalVideo).toHaveBeenCalledWith(videoStream, portal);
    });

    it('#shareVideo - Initialize video call as caller, on system:video_request or system:video_offer', () => {
        const shareVideo = portal.shareVideo({
            from: uuidRemote
        }, true);
        const remoteConnection = portal.participants[uuidRemote];
        expect(typeof remoteConnection.rtc).toEqual("object");
        expect(typeof remoteConnection.rtc.onicecandidate).toEqual("function");
        expect(typeof remoteConnection.rtc.ontrack).toEqual("function");
        expect(typeof remoteConnection.rtc.onsignalingstatechange).toEqual("function");
        expect(typeof remoteConnection.rtc.onnegotiationneeded).toEqual("function");
    });

    it('#addIceCandidate - Adds Ice Candidate', () => {
        portal.addIceCandidate({
            from: uuidRemote
        });
        expect(mockAddIceCandidate).toHaveBeenCalled();
    });

    it('#createAnswer - Answers an incoming video offer', done => {
        const remoteConnection = portal.participants[uuidRemote];
        portal.createAnswer({
            from: uuidRemote,
            sdp: {
                type: "offer"
            }
        }).then(() => {
            expect(mockSetRemoteDescription).toHaveBeenCalled();
            expect(mockCreateAnswer).toHaveBeenCalled();
            expect(mockSetLocalDescription).toHaveBeenCalled();

            expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
                "event": "system:video_answer",
                "data": {
                    "from": uuidLocal,
                    "to": uuidRemote
                }
            }));

            done();
        });
    });

    it('#removeParticipant - Removes portal participant', () => {
        portal.removeParticipant(uuidRemote);
        expect(portal.participants).not.toHaveProperty(uuidRemote);
        expect(portal.participants).toHaveLength(0);
        expect(mockOnParticipantLeft).toHaveBeenCalledWith(uuidRemote);
    });

});