/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows        = require('vows'),
    assert      = require('assert'),
    os          = require('os'),
    WebPageTest = require('../lib/webpagetest'),
    helper      = require('../lib/helper'),
    packageJson = require('../package.json');

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
    },

    'get current version': {
      topic: function (wpt) {
        return wpt.version;
      },
      'then compares to package.json version': function (version) {
        assert.equal(version, packageJson.version);
      }
    }

  },

  'WebPageTest localhost helper': {
    topic: helper,

    'when getting a valid hostname with port': {
      topic: function(helper) {
        return helper.localhost('localhost:8000', 3000);
      },
      'returns a localhost object with hostname and port': function(localhost) {
        assert.equal(localhost.hostname, 'localhost');
        assert.equal(localhost.port, 8000);
      }
    },

    'when getting a valid hostname only': {
      topic: function(helper) {
        return helper.localhost('localhost', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, 'localhost');
        assert.equal(localhost.port, 3000);
      }
    },

    'when getting a valid port only': {
      topic: function(helper) {
        return helper.localhost('8000', 3000);
      },
      'returns a localhost object with default hostname': function(localhost) {
        assert.equal(localhost.hostname, os.hostname());
        assert.equal(localhost.port, 8000);
      }
    },

    'when getting an ip only': {
      topic: function(helper) {
        return helper.localhost('127.0.0.1', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, '127.0.0.1');
        assert.equal(localhost.port, 3000);
      }
    },

    'when getting a valid hostname with invalid port ': {
      topic: function(helper) {
        return helper.localhost('localhost:foo', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, 'localhost');
        assert.equal(localhost.port, 3000);
      }
    },

    'when getting an invalid hostname with valid port ': {
      topic: function(helper) {
        return helper.localhost('123:8000', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, os.hostname());
        assert.equal(localhost.port, 8000);
      }
    },

    'when getting a valid hostname with no port ': {
      topic: function(helper) {
        return helper.localhost('localhost:', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, 'localhost');
        assert.equal(localhost.port, 3000);
      }
    },

    'when getting no hostname with valid port ': {
      topic: function(helper) {
        return helper.localhost(':8000', 3000);
      },
      'returns a localhost object with hostname and default port': function(localhost) {
        assert.equal(localhost.hostname, os.hostname());
        assert.equal(localhost.port, 8000);
      }
    }
  },

  'WebPageTest normalizeServer helper': {
    topic: helper,

    'when getting a valid standard server uri': {
      topic: function(helper) {
        return helper.normalizeServer('example.com');
      },
      'returns server info object': function(server) {
        assert.deepEqual(server, {
          protocol: 'http:',
          hostname: 'example.com',
          pathname: '/',
          port: 80
        });
      }
    },

    'when getting a valid full server uri': {
      topic: function(helper) {
        return helper.normalizeServer('http://example.com:8000/foo');
      },
      'returns server info object': function(server) {
        assert.deepEqual(server, {
          protocol: 'http:',
          hostname: 'example.com',
          pathname: '/foo',
          port: 8000
        });
      }
    },

    'when getting a https server uri': {
      topic: function(helper) {
        return helper.normalizeServer('https://example.com');
      },
      'returns server info object': function(server) {
        assert.deepEqual(server, {
          protocol: 'https:',
          hostname: 'example.com',
          pathname: '/',
          port: 443
        });
      }
    },

  }
}).export(module);
