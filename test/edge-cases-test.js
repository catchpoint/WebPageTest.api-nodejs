/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows   = require('vows'),
    assert = require('assert');

var WebPageTest = require('../lib/webpagetest');

vows.describe('Edge Cases').addBatch({
  'An HTTPS WebPageTest Server with API key': {
    topic: new WebPageTest('https://www.example.com:1234/foo/bar', '1234567890'),
 
    'gets a simple test request with another HTTP server and API key': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
          server: 'http://wpt.com',
          key: '0987654321',
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://wpt.com/runtest.php?url=http%3A%2F%2Ffoobar.com&k=0987654321&f=json');
      }
    }

  },

  'An HTTP WebPageTest Server with API key': {
    topic: new WebPageTest('http://www.example.com/foo/bar', '1234567890'),
 
    'gets a simple test request with another HTTPS server and API key': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
            server: 'https://wpt.com:1234/baz/',
          key: '0987654321',
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'https://wpt.com:1234/baz/runtest.php?url=http%3A%2F%2Ffoobar.com&k=0987654321&f=json');
      }
    }

  }
}).export(module);
