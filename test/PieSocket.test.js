import '@babel/polyfill';
import PieSocket from '../src/PieSocket';
import Logger from '../src/Logger';
import DefaultOptions from '../src/misc/DefaultOptions';

var assert = require('assert');

describe('PieSocket', function() {

  describe('#constructor()', function() {

    it('Test default options', function() {
      const piesocket = new PieSocket({});
      assert.deepEqual(piesocket.options, DefaultOptions);
      assert.deepEqual(piesocket.connections, {});
      assert.deepEqual(piesocket.logger, new Logger(piesocket.options));
    });

    it('Test option override', function() {
      const piesocket = new PieSocket({
        clusterId: 'nyc1',
        apiKey: 'xxx'
      });
      assert.deepEqual(piesocket.options, {...DefaultOptions, clusterId:'nyc1', apiKey: 'xxx'});
    });

  });
});