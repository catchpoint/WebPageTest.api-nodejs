/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows   = require('vows'),
    assert = require('assert'),
    http   = require('http'),
    url    = require('url'),
    os     = require('os');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects'),
    helper = require('../lib/helper');

var wptNockServer = new NockServer('http://example.com'),
    wpt = new WebPageTest('example.com');

// GET helper function
function get(pathname, server, callback) {
  var options = {
        path: pathname,
        host: server.hostname,
        port: server.port
      };

  http.get(options, function getResponse(res) {
    var data = '',
        type = (res.headers['content-type'] || '').split(';'),
        statusCode = res.statusCode;

    // get type and encoding returned from listener
    encoding = type[1];
    type = type[0];

    if (statusCode !== 200) {
      callback(new Error(statusCode));
    } else {
      res.on('data', function onData(chunk) {
        data += chunk;
      });

      res.on('end', function onEnd() {
        callback(undefined, data, {type: type, encoding: encoding});
      });
    }
  }).on('error', function onError(err) {
    callback(err);
  });
}

vows.describe('Dry Run').addBatch({
  'A Local WebPageTesti-API is listening to a Nock Server': {
    topic: function () {
      wpt.listen(undefined, this.callback);
    },

    'it provides an object with the local server info': function (err, data) {
      var hostname = os.hostname(),
          port = WebPageTest.defaultListenPort;

      assert.equal(data.protocol, 'http');
      assert.equal(data.hostname, hostname);
      assert.equal(data.port, port);
      assert.equal(data.url, 'http://' + hostname + ':' + port);

      return data.server;
    },

    'when gets a test status GET request': {
      topic: function (server) {
        get('/status/120816_V2_2', server, this.callback);
      },
      'returns the test status JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testStatus);
      }
    },
 
    'when gets a test results GET request': {
      topic: function (server) {
        get('/results/120816_V2_2', server, this.callback);
      },
      'returns the test results JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testResults);
      }
    },
 
    'when gets the locations list GET request': {
      topic: function (server) {
        get('/locations', server, this.callback);
      },
      'returns the location list JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.locations);
      }
    },
 
    'when gets a simple test GET request': {
      topic: function (server) {
        get('/test/' + encodeURIComponent('http://twitter.com/marcelduran'),
          server, this.callback);
      },
      'returns the run test JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'when gets a custom test GET request': {
      topic: function (server) {
        get(url.format({
          pathname: '/test/' +
            encodeURIComponent('http://twitter.com/marcelduran'),
          query: {
            'location': 'Local_Firefox_Chrome:Chrome',
            label: 'test 123',
            runs: 3,
            first: 1,
            timeline: 1,
            netlog: 1,
            full: 1
          }
        }), server, this.callback);
      },
      'returns the run test JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'when gets a script test GET request': {
      topic: function (server) {
        var script = wpt.scriptToString([
          {logData:    0                           },
          {navigate:   'http://foo.com/login'      },
          '// log some data',
          {logData:    1                           },
          {setValue:   ['name=username', 'johndoe']},
          {setValue:   ['name=password', '12345']  },
          {submitForm: 'action=http://foo.com/main'},
          'waitForComplete'
        ]);

        get('/test/' + encodeURIComponent(script), server, this.callback);
      },
      'returns the run test JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'when gets a cancel test GET request': {
      topic: function (server) {
        get('/cancel/120816_V2_2', server, this.callback);
      },
      'returns the test cancelled JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.cancel);
      }
    },
 
    'when gets page speed data GET request': {
      topic: function (server) {
        get('/pagespeed/120816_V2_2', server, this.callback);
      },
      'returns the page speed JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.pageSpeed);
      }
    },
 
    'when gets HAR data GET request': {
      topic: function (server) {
        get('/har/120816_V2_2', server, this.callback);
      },
      'returns the HAR JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.har);
      }
    },
 
    'when gets utilization data GET request': {
      topic: function (server) {
        get('/utilization/120816_V2_2', server, this.callback);
      },
      'returns the utilization JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.utilization);
      }
    },
 
    'when gets request data GET request': {
      topic: function (server) {
        get('/request/120816_V2_2', server, this.callback);
      },
      'returns the request JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.request);
      }
    },
 
    'when gets timeline data GET request': {
      topic: function (server) {
        get('/timeline/120816_V2_2', server, this.callback);
      },
      'returns the timeline JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.timeline);
      }
    },
 
    'when gets net log data GET request': {
      topic: function (server) {
        get('/netlog/120816_V2_2', server, this.callback);
      },
      'returns the net log JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.netLog);
      }
    },
 
    'when gets console log data GET request': {
      topic: function (server) {
        get('/console/120816_V2_2', server, this.callback);
      },
      'returns the console log JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.consoleLog);
      }
    },
 
    'when gets a waterfall image GET request': {
      topic: function (server) {
        get('/waterfall/120816_V2_2?uri=1', server, this.callback);
      },
      'returns the waterfall data URI string': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.waterfall);
        assert.equal(data.type, 'image/png');
      }
    },
 
    'when gets a waterfall thumbnail GET request': {
      topic: function (server) {
        get('/waterfall/120816_V2_2?uri=1&thumbnail=1', server, this.callback);
      },
      'returns the waterfall thumbnail data URI string':
        function (err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          assert.equal(data.data, ResponseObjects.waterfallThumbnail);
          assert.equal(data.type, 'image/png');
        }
    },
 
    'when gets a screenshot GET request': {
      topic: function (server) {
        get('/screenshot/120816_V2_2?uri=1', server, this.callback);
      },
      'returns the screenshot data URI string': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.screenshot);
        assert.equal(data.type, 'image/jpeg');
      }
    },
 
    'when gets a screenshot thumbnail GET request': {
      topic: function (server) {
        get('/screenshot/120816_V2_2?uri=1&thumbnail=1', server, this.callback);
      },
      'returns the screenshot thumbail data URI string':
        function (err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          assert.equal(data.data, ResponseObjects.screenshotThumbnail);
          assert.equal(data.type, 'image/jpeg');
        }
    },
 
    'when gets a screenshot in full resolution GET request': {
      topic: function (server) {
        get('/screenshot/120816_V2_2?uri=1&full=1', server, this.callback);
      },
      'returns the screenshot in full resolution data URI string':
        function (err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          assert.equal(data.data, ResponseObjects.screenshotFullResolution);
          assert.equal(data.type, 'image/png');
        }
    },

    // not found / invalid

    'when gets an invalid test status GET request': {
      topic: function (server) {
        get('/status/120816_V2_3', server, this.callback);
      },
      'returns a not found test status JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testStatusNotFound);
      }
    },
 
    'when gets an invalid test results GET request': {
      topic: function (server) {
        get('/results/120816_V2_3', server, this.callback);
      },
      'returns a not found test results JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testResultsNotFound);
      }
    },
 
    'when gets an invalid test GET request': {
      topic: function (server) {
        get('/test/', server, this.callback);
      },
      'returns an invalid run test JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTestInvalid);
      }
    },
 
    'when gets an invalid file GET request': {
      topic: function (server) {
        get('/pagespeed/120816_V2_3', server, this.callback);
      },
      'returns a 404 error': function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
      }
    },
 
    'when gets an invalid HAR data GET request': {
      topic: function (server) {
        get('/har/120816_V2_3', server, this.callback);
      },
      'returns an empty HAR JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.harNotFound);
      }
    },
 
    'when gets an invalid waterfall image GET request': {
      topic: function (server) {
        get('/waterfall/120816_V2_3?uri=1', server, this.callback);
      },
      'returns an empty waterfall data URI string':
        function (err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          assert.equal(data.data, ResponseObjects.waterfallNotFound);
          assert.equal(data.type, 'image/png');
        }
    },
 
    'when gets an invalid waterfall thumbnail GET request': {
      topic: function (server) {
        get('/waterfall/120816_V2_3?uri=1&thumbnail=1', server, this.callback);
      },
      'returns an empty waterfall thumbnail data URI string':
        function (err, data) {
          if (err) throw err;
          data = JSON.parse(data);
          assert.equal(data.data, ResponseObjects.waterfallThumbnailNotFound);
          assert.equal(data.type, 'image/png');
        }
    },
 
    'when gets an invalid screenshot thumbnail GET request': {
      topic: function (server) {
        get('/screenshot/120816_V2_3?uri=1&thumbnail=1', server, this.callback);
      },
      'returns a 404 error': function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
      }
    },

    'when gets an already cancelled test cancel test GET request': {
      topic: function (server) {
        get('/cancel/120816_V2_3', server, this.callback);
      },
      'returns the test not cancelled JSON': function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.cancelNotCancelled);
      }
    },
 
    'when gets a cancel test of an invalid test GET request': {
      topic: function (server) {
        get('/cancel/120816_V2_4', server, this.callback);
      },
      'returns a 404 error': function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
      }
    },

    teardown: function(listener) {
      listener.server.close();
    }
 
  }
}).export(module);
