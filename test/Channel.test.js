import '@babel/polyfill';
import Channel from '../src/Channel';
import PieSocket from '../src/PieSocket';
import Logger from '../src/Logger';
import Blockchain from '../src/Blockchain';

const assert = require('assert');

//Blockchain Mock
const mockBlockchainSend = jest.fn().mockImplementation((data) => {
    if(data.name == "Testfail"){
        return Promise.reject();
    }

    return Promise.resolve({
        hash: "0x000000000000000000"
    })
});
jest.mock('../src/Blockchain.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
        send: mockBlockchainSend
    };  
  });
});


//Socket Mock
const mockWebSocketClose = jest.fn();
const mockWebSocketSend = jest.fn();
jest.mock('../src/Socket.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      close: mockWebSocketClose,
      send: mockWebSocketSend
    };
  });
});

const channelProperties = ['events', 'listeners','endpoint', 'identity', 'connection', 'shouldReconnect', 'logger'];
const uninitializedChannelProperties = ['events', 'listeners'];

describe('Channel', function () {

  let piesocket;
  let channel;

  beforeAll(()=>{
    piesocket = new PieSocket();
    channel = new Channel(piesocket.getEndpoint("test"), piesocket.options);
  });

  it('#constructor() - Returns Channel Instance', function () {
    expect(Object.keys(channel)).toEqual(channelProperties);

    assert.deepEqual(channel.identity, { ...piesocket.options });
    assert.deepEqual(channel.events, {});
    assert.deepEqual(channel.listeners, {});
    assert.equal(channel.shouldReconnect, false);
    assert.deepEqual(channel.logger, new Logger(channel.identity));
  });

  it('#init() - Initializes Uninitialized Channel Instance', function () {
    const uninitializedChannel = new Channel(null, null, false);

    expect(Object.keys(uninitializedChannel)).toEqual(uninitializedChannelProperties);
    const connectSpy = jest.spyOn(uninitializedChannel, 'connect');
    uninitializedChannel.init(piesocket.getEndpoint("test"), piesocket.options);
    
    const propsAfterInit = Object.keys(uninitializedChannel);
    propsAfterInit.splice(2,1); //remove connect property added by spy
    expect(propsAfterInit).toEqual(channelProperties);

    expect(connectSpy).toHaveBeenCalled()

    assert.deepEqual(uninitializedChannel.identity, { ...piesocket.options });
    assert.deepEqual(uninitializedChannel.events, {});
    assert.deepEqual(uninitializedChannel.listeners, {});
    assert.equal(uninitializedChannel.shouldReconnect, false);
    assert.deepEqual(uninitializedChannel.logger, new Logger(channel.identity));
  });

  it('#on() - Registers event callbacks', function () {
    const callback = jest.fn();
    channel.on('open', callback);
    expect(channel.events['open']).toEqual(callback);
  })

  it('#listen() - Registers websocket onmessage event listeners', function () {
    const callback = jest.fn();
    channel.listen('testevent', callback);
    expect(channel.listeners['testevent']).toEqual(callback);
  })

  it('#send() - Sends message on websocket connection', function () {
    channel.send('testdata');
    expect(mockWebSocketSend).toHaveBeenCalledWith("testdata");
  })

  it('#publish() - Sends formatted event on websocket connection', function () {
    channel.publish('test-event', {
        "name": "John Doe"
    }, { "foo": "bar" });

    expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
        event: "test-event",
        data: {
            "name": "John Doe"
        },
        meta: { "foo": "bar" }
    }));
  });

  it('#sendOnBlockchain() -  Registers a event on blockchain and then broadcasts the payload to peers', done =>{
    const blockChainHashCallback = jest.fn();
    const blockChainErrorCallback = jest.fn().mockImplementation(()=> { return "ok"; });
    channel.on('blockchain-hash', blockChainHashCallback);
    channel.on('blockchain-error', blockChainErrorCallback);

    channel.sendOnBlockchain('blockchain-event', {
        "name": "Harry Doe"
    }, { "foo": "bar" }).then(()=>{

        expect(mockBlockchainSend).toHaveBeenCalledWith({
            "name": "Harry Doe"
        });
        expect(blockChainErrorCallback).not.toBeCalled();
        expect(blockChainHashCallback).toBeCalled();
        expect(mockWebSocketSend).toHaveBeenCalledWith(JSON.stringify({
            event: "blockchain-event",
            data: {
                "name": "Harry Doe"
            },
            meta: { "foo": "bar", "transaction_hash":"0x000000000000000000" }
        }));
        done();
    });


  });

  it('#sendOnBlockchain() -  Triggers blockchain-error when error occurs', done =>{
    const blockChainHashCallback = jest.fn();
    const blockChainErrorCallback = jest.fn().mockImplementation(()=> { return "ok"; });
    channel.on('blockchain-hash', blockChainHashCallback);
    channel.on('blockchain-error', blockChainErrorCallback);

    channel.sendOnBlockchain('blockchain-event', {
        "name": "Testfail"
    }, { "foo": "bar" }).then(()=>{
        expect(blockChainErrorCallback).toBeCalled();
        expect(blockChainHashCallback).not.toBeCalled();
        done();
    });
  });

});