/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows = require('vows'),
    assert = require('assert');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

var wptNockServer = new NockServer('http://example.com');

vows.describe('Mock WPT Server').addBatch({
  'An Example WebPageTest Nock Server': {
    topic: new WebPageTest('example.com'),

    'gets a sync test with results request': {
      topic: function (wpt) {
        wpt.runTest('http://twitter.com/marcelduran', {
          pollResults: 1
        }, this.callback);
      },
      'returns the test results object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testResults);
      }
    }

  }
}).export(module);

