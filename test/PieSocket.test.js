import '@babel/polyfill';
import PieSocket from '../src/PieSocket';
import Logger from '../src/Logger';
import DefaultOptions from '../src/misc/DefaultOptions';
import Socket from '../src/Socket';

const pieSocketProperties = ['options', 'connections', 'logger'];
const channelProperties = ['events', 'listeners', 'endpoint', 'identity', 'connection', 'shouldReconnect', 'logger'];

jest.mock('../src/Socket.js', () => {
  return jest.fn();
});

var assert = require('assert');

describe('PieSocket', function () {

  describe('#constructor()', function () {

    it('Test default options', function () {
      const piesocket = new PieSocket({});
      assert.deepEqual(piesocket.options, DefaultOptions);
      assert.deepEqual(piesocket.connections, {});
      assert.deepEqual(piesocket.logger, new Logger(piesocket.options));

      expect(Object.keys(piesocket)).toEqual(pieSocketProperties);

    });

    it('Test option override', function () {
      const piesocket = new PieSocket({
        clusterId: 'nyc1',
        apiKey: 'xxx'
      });
      assert.deepEqual(piesocket.options, { ...DefaultOptions, clusterId: 'nyc1', apiKey: 'xxx' });
    });

  });

  describe('#subscribe()', function () {

    it('Test channel subscription', done => {
      const piesocket = new PieSocket({
        clusterId: 'nyc1',
        apiKey: 'xxx'
      });

      function subscribeCallback(channel) {
        expect(Socket).toHaveBeenCalledWith('wss://nyc1.piesocket.com/v3/test-channel?api_key=xxx&notify_self=0&source=jssdk&v=1.4.0&presence=0');
        assert.deepEqual(channel.identity, { ...piesocket.options, channelId: 'test-channel' });
        assert.deepEqual(channel.events, {});
        assert.deepEqual(channel.listeners, {});
        assert.equal(channel.shouldReconnect, false);
        assert.deepEqual(channel.logger, new Logger(channel.identity));
        expect(Object.keys(channel)).toEqual(channelProperties);
        done();
      }


      piesocket.subscribe('test-channel').then(subscribeCallback);
    });

  });
});