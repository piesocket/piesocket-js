import '@babel/polyfill';
import PieSocket from '../src/PieSocket';
import Logger from '../src/Logger';
import DefaultOptions from '../src/misc/DefaultOptions';
import Socket from '../src/misc/WebSocket';

const currentVersion = "5.0.8";
const pieSocketProperties = ['options', 'connections', 'logger'];
const channelProperties = ['events', 'listeners', "members", "portal", "uuid", "onSocketConnected", "onSocketError", 'endpoint', 'identity', 'connection', 'shouldReconnect', 'logger'];

//Mocks
const mockAddIceCandidate = jest.fn();
const mockCreateAnswer = jest.fn().mockImplementation(()=> {
    return Promise.resolve();
});
const mockSetLocalDescription = jest.fn().mockImplementation(()=> {
    return Promise.resolve();
});
const mockSetRemoteDescription = jest.fn().mockImplementation(()=> {
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
jest.mock('../src/misc/WebSocket.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      close: mockWebSocketClose
    };
  });;
});

var assert = require('assert');

//Tests
describe('PieSocket', function () {

  describe('#constructor()', function () {

    it('PieSocket constructor returns ok', function () {
      const piesocket = new PieSocket();
      assert.deepEqual(piesocket.options, DefaultOptions);
      assert.deepEqual(piesocket.connections, {});
      assert.deepEqual(piesocket.logger, new Logger(piesocket.options));

      expect(Object.keys(piesocket)).toEqual(pieSocketProperties);
    });

    it('Option overrides work', function () {
      const piesocket = new PieSocket({
        clusterId: 'nyc1',
        apiKey: 'xxx'
      });
      assert.deepEqual(piesocket.options, { ...DefaultOptions, clusterId: 'nyc1', apiKey: 'xxx' });
    });

  });

  describe('Channel functions', function () {

    let piesocket;
    let channel;

    beforeAll(done => {
      piesocket = new PieSocket({
        clusterId: 'nyc1',
        apiKey: 'xxx'
      });

      function subscribeCallback(_channel) {
        channel = _channel;
        delete channel.identity['onSocketConnected'];
        delete channel.identity['onSocketError'];

        expect(Socket).toHaveBeenCalledWith(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&uuid=${channel.uuid}`);
        assert.deepEqual(channel.identity, { 
          ...piesocket.options, 
          channelId: 'test-channel' 
        });
        assert.deepEqual(channel.events, {});
        assert.deepEqual(channel.listeners, {});
        assert.equal(channel.shouldReconnect, false);
        assert.deepEqual(channel.logger, new Logger(channel.identity));
        expect(Object.keys(channel)).toEqual(channelProperties);
        done();
      }

      piesocket.subscribe('test-channel').then(subscribeCallback);
    });

    it('#subscribe - Creates channel connection', () => {
      expect(Object.keys(channel)).toEqual(channelProperties);
    });

    it('#subscribe - Creates another channel subscription', done => {
      piesocket.subscribe('test-channel-2').then(()=>{
        expect(Object.keys(piesocket.connections).length).toEqual(2);
        done();    
      });
    });

    it('#subscribe - Prevents duplicate channel connection', done => {
      piesocket.subscribe('test-channel').then(()=>{
        expect(Object.keys(piesocket.connections).length).toEqual(2);
        done();    
      });
    });

    it('#unsubscribe - Removes channel subscription', () => {
      const result = piesocket.unsubscribe("test-channel");
      expect(result).toEqual(true);
      expect(Object.keys(piesocket.connections).length).toEqual(1);
    });

    it('#unsubscribe - Removes non-existing channel subscription', () => {
      const result = piesocket.unsubscribe("test-channel-99");
      expect(result).toEqual(false);
      expect(Object.keys(piesocket.connections).length).toEqual(1);
    });

    it('#getConnections - Returns all connections', () => {
      const result = piesocket.getConnections();
      assert.deepEqual(result, piesocket.connections);
    });

    it('#isGuarded - Returns true for private- prefixed channels', () => {
      const result = piesocket.isGuarded('private-channel');
      expect(result).toEqual(true);
    });

    it('#isGuarded - Returns false for channels not prefixed with private-', () => {
      const result = piesocket.isGuarded('dummy-channel');
      expect(result).toEqual(false);
    });

    it('#isGuarded - Returns true for any channel when forceAuth is set', () => {
      piesocket.options.forceAuth = true;      
      const result = piesocket.isGuarded('dummy-channel');
      expect(result).toEqual(true);
    });

    it('#getEndpoint - Returns websocket endpoint', done => {
      piesocket.options.forceAuth = false;      
      piesocket.getEndpoint('test-channel', 'xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&uuid=xxxx`);
        done();
      });
    });

    it('#getEndpoint - Returns websocket endpoint with JWT', done => {
      piesocket.options.jwt = 'testcode';      
      piesocket.getEndpoint('test-channel', 'xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&jwt=testcode&uuid=xxxx`);
        done();
      });
    });

    it('#getEndpoint - Returns websocket endpoint with auto-generated JWT when forceAuth is set', done => {
      piesocket.options.jwt = null;      
      piesocket.options.forceAuth = true;
      piesocket.getAuthToken = jest.fn().mockImplementation(()=>{
        return  Promise.resolve({
          auth: 'test-token'
        });
      });

      piesocket.getEndpoint('test-channel', 'xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&jwt=test-token&uuid=xxxx`);
        done();
      });
    });

    it('#getEndpoint - Returns websocket endpoint without auto-generated JWT when auth endpoint call returns invalid data', done => {
      piesocket.options.jwt = null;      
      piesocket.options.forceAuth = true;
      piesocket.getAuthToken = jest.fn().mockImplementation(()=>{
        return  Promise.resolve("blabla");
      });

      piesocket.getEndpoint('test-channel','xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&uuid=xxxx`);
        done();
      });
    });

    it('#getEndpoint - Returns websocket endpoint with auto-generated JWT for private channels', done => {
      piesocket.options.jwt = null;      
      piesocket.options.forceAuth = false;
      piesocket.getAuthToken = jest.fn().mockImplementation(()=>{
        return  Promise.resolve({
          auth: 'test-token'
        });
      });

      piesocket.getEndpoint('private-channel','xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/private-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&jwt=test-token&uuid=xxxx`);
        done();
      });
    });


    it('#getEndpoint - Returns websocket endpoint with user identity', done => {
      piesocket.options.forceAuth = false;      
      piesocket.options.userId = 1;      
      piesocket.getEndpoint('test-channel', 'xxxx').then((result) => {
        expect(result).toEqual(`wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=${currentVersion}&presence=0&user=1&uuid=xxxx`);
        done();
      });
    });

  });
});