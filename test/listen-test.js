/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert          = require('assert'),
    http            = require('http'),
    url             = require('url'),
    WebPageTest     = require('../lib/webpagetest'),
    NockServer      = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

var wptNockServer = new NockServer('http://wpt.com'),
    wpt = new WebPageTest('wpt.com');

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

describe('Local WebPageTest-API Proxy', function() {
  describe('Listens to a Nock Server', function() {
    var server;

    before(function (done) {
      wpt.listen('127.0.0.1', function(err, data) {
        if (err) return done(err);
        server = data;
      });
      done();
    });

    it('provides an object with the local server info', function() {
      var hostname = '127.0.0.1',
          port = WebPageTest.defaultListenPort;

      assert.equal(server.protocol, 'http');
      assert.equal(server.hostname, hostname);
      assert.equal(server.port, port);
      assert.equal(server.url, 'http://' + hostname + ':' + port);
    });

    it('gets a test status GET request then returns the test status JSON', function(done) {
      get('/status/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testStatus);
        done();
      });
    });

    it('gets a test results for multi runs with default median metric GET request then returns the test results JSON', function(done) {
      get('/results/141106_TM_ZFM', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testResultsMultiRunsDefaultMedianMetric);
        done();
      });
    });

    it('gets a test results for multi runs with custom median metric GET request then returns the test results JSON', function(done) {
      get('/results/141106_TM_ZFM?median=TTFB', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testResultsMultiRunsTTFBMedianMetric);
        done();
      });
    });

    it('gets the locations list GET request then returns the locations list JSON', function(done) {
      get('/locations', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.locations);
        done();
      });
    });

    it('gets the testers list GET request then returns the testers list JSON', function(done) {
      get('/testers', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testers);
        done();
      });
    });

    it('gets a simple test GET request then returns the run test JSON', function(done) {
      get('/test/' + encodeURIComponent('http://twitter.com/marcelduran'),
          server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a custom test GET request then returns the run test JSON', function(done) {
      get(url.format({
        pathname: '/test/' + encodeURIComponent('http://twitter.com/marcelduran'),
        query: {
          'location': 'Local_Firefox_Chrome:Chrome',
          label: 'test 123',
          runs: 3,
          first: 1,
          timeline: 1,
          netlog: 1,
          full: 1
        }
      }), server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a script test GET request then returns the run test JSON', function(done) {
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

      get('/test/' + encodeURIComponent(script), server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a cancel test GET request then returns the test cancelled JSON', function(done) {
      get('/cancel/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.cancel);
        done();
      });
    });

    it('gets page speed data GET request then returns the page speed JSON', function(done) {
      get('/pagespeed/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.pageSpeed);
        done();
      });
    });

    it('gets HAR data GET request then returns the HAR JSON', function(done) {
      get('/har/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.har);
        done();
      });
    });

    it('gets utilization data GET request then returns the utilization JSON', function(done) {
      get('/utilization/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.utilization);
        done();
      });
    });

    it('gets request data GET request then returns the request JSON', function(done) {
      get('/request/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.request);
        done();
      });
    });

    it('gets timeline data GET request then returns the timeline JSON', function(done) {
      get('/timeline/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.timeline);
        done();
      });
    });

    it('gets net log data GET request then returns the net log JSON', function(done) {
      get('/netlog/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.netLog);
        done();
      });
    });

    it('gets console log data GET request then returns the console log JSON', function(done) {
      get('/console/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.consoleLog);
        done();
      });
    });

    it('gets test info GET request then returns the test info JSON', function(done) {
      get('/testinfo/120816_V2_2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testInfo);
        done();
      });
    });

    it('gets history GET request then returns the history JSON', function(done) {
      get('/history/2', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.history);
        done();
      });
    });

    it('gets a waterfall image GET request then returns the waterfall data URI string', function(done) {
      get('/waterfall/120816_V2_2?uri=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.waterfall);
        assert.equal(data.type, 'image/png');
        done();
      });
    });

    it('gets a waterfall thumbnail GET request then returns the waterfall thumbnail data URI string', function(done) {
      get('/waterfall/120816_V2_2?uri=1&thumbnail=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.waterfallThumbnail);
        assert.equal(data.type, 'image/png');
        done();
      });
    });

    it('gets a screenshot GET request then returns the screenshot data URI string', function(done) {
      get('/screenshot/120816_V2_2?uri=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.screenshot);
        assert.equal(data.type, 'image/jpeg');
        done();
      });
    });

    it('gets a screenshot thumbnail GET request then returns the screenshot thumbail data URI string', function(done) {
      get('/screenshot/120816_V2_2?uri=1&thumbnail=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.screenshotThumbnail);
        assert.equal(data.type, 'image/jpeg');
        done();
      });
    });

    it('gets a screenshot in full resolution GET request then returns the screenshot in full resolution data URI string', function(done) {
      get('/screenshot/120816_V2_2?uri=1&full=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.screenshotFullResolution);
        assert.equal(data.type, 'image/png');
        done();
      });
    });

    // not found / invalid

    it('gets an invalid test status GET request then returns a not found test status JSON', function(done) {
      get('/status/120816_V2_3', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testStatusNotFound);
        done();
      });
    });

    it('gets an invalid test results GET request then returns a not found test results JSON', function(done) {
      get('/results/120816_V2_3', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.testResultsNotFound);
        done();
      });
    });

    it('gets an invalid test GET request then returns an invalid run test JSON', function(done) {
      get('/test/', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.runTestInvalid);
        done();
      });
    });

    it('gets an invalid file GET request then returns a 404 error', function(done) {
      get('/pagespeed/120816_V2_3', server, function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
        done();
      });
    });

    it('gets an invalid HAR data GET request then returns an empty HAR JSON', function(done) {
      get('/har/120816_V2_3', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.harNotFound);
        done();
      });
    });

    it('gets an invalid waterfall image GET request then returns an empty waterfall data URI string', function(done) {
      get('/waterfall/120816_V2_3?uri=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.waterfallNotFound);
        assert.equal(data.type, 'image/png');
        done();
      });
    });

    it('gets an invalid waterfall thumbnail GET request then returns an empty waterfall thumbnail data URI string', function(done) {
      get('/waterfall/120816_V2_3?uri=1&thumbnail=1', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.equal(data.data, ResponseObjects.waterfallThumbnailNotFound);
        assert.equal(data.type, 'image/png');
        done();
      });
    });

    it('gets an invalid screenshot thumbnail GET request then returns a 404 error', function(done) {
      get('/screenshot/120816_V2_3?uri=1&thumbnail=1', server, function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
        done();
      });
    });

    it('gets an already cancelled test cancel test GET request then returns the test not cancelled JSON', function(done) {
      get('/cancel/120816_V2_3', server, function (err, data) {
        if (err) return done(err);
        data = JSON.parse(data);
        assert.deepEqual(data, ResponseObjects.cancelNotCancelled);
        done();
      });
    });

    it('gets a cancel test of an invalid test GET request then returns a 404 error', function(done) {
      get('/cancel/120816_V2_4', server, function (err, data) {
        assert.equal(err.message, '404');
        assert.equal(data, undefined);
        done();
      });
    });

    after(function() {
      server.server.close();
    });

  });
});
