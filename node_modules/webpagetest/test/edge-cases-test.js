/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows        = require('vows'),
    assert      = require('assert'),
    WebPageTest = require('../lib/webpagetest');

var wptServer = 'https://www.example.com:1234/foo/bar/';

vows.describe('Edge Cases').addBatch({
  'An HTTPS WebPageTest Server with API key': {
    topic: new WebPageTest(wptServer, '1234567890'),

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
    topic: new WebPageTest(wptServer, '1234567890'),

    'gets a simple test request with another HTTPS server and API key': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
            server: 'https://wpt.com:4321/baz/',
          key: '0987654321',
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'https://wpt.com:4321/baz/runtest.php?url=http%3A%2F%2Ffoobar.com&k=0987654321&f=json');
      }
    }

  },

  'An Example WebPageTest Server': {
    topic: new WebPageTest(wptServer),

    'gets a test with blocking urls and spof array request': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
          dryRun: true,
          block: ['foo.com', 'bar.com'],
          spof: ['baz.com', 'qux.com']
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&block=foo.com%20bar.com&spof=baz.com%20qux.com&f=json');
      }
    },

    'gets a test with blocking urls and spof strings request': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
          dryRun: true,
          block: 'foo.com bar.com',
          spof: ['baz.com qux.com']
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&block=foo.com%20bar.com&spof=baz.com%20qux.com&f=json');
      }
    },

    'gets a test with dial up connectivity and location': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {
          dryRun: true,
          connectivity: 'Dial',
          location: 'somelocation'
        }, this.callback);
      },
      'then returns the API url with connectivity appended to location': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&location=somelocation.Dial&connectivity=Dial&f=json');
      }
    }

  }
}).export(module);
