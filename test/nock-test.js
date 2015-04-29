/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert = require('assert');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

var wptNockServer = new NockServer('http://example.com'),
    wpt = new WebPageTest('example.com');

describe('Example WebPageTest', function() {
  describe('Hits a Nock Server', function() {

    it('gets a test status request then returns the test status object', function(done) {
      wpt.getTestStatus('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testStatus);
        done();
      });
    });

    it('gets a test results request then returns the test results object', function(done) {
      wpt.getTestResults('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResults);
        done();
      });
    });

    it('gets a test results for multi runs with default median metric request then returns the test results object', function(done) {
      wpt.getTestResults('141106_TM_ZFM', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResultsMultiRunsDefaultMedianMetric);
        done();
      });
    });

    it('gets a test results for multi runs with custom median metric request then returns the test results object', function(done) {
      wpt.getTestResults('141106_TM_ZFM', {medianMetric: 'TTFB'}, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResultsMultiRunsTTFBMedianMetric);
        done();
      });
    });

    it('gets a test results with extra data request then returns the test results object', function(done) {
      wpt.getTestResults('141106_8N_ZRC', {
        breakDown: true,
        domains: true,
        pageSpeed: true,
        requests: true
      }, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResultsExtraData);
        done();
      });
    });

    it('gets the locations list request then returns the locations list object', function(done) {
      wpt.getLocations(function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.locations);
        done();
      });
    });

    it('gets the testers list request then returns the testers list object', function(done) {
      wpt.getTesters(function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testers);
        done();
      });
    });

    it('gets a simple test request then returns the run test object', function(done) {
      wpt.runTest('http://twitter.com/marcelduran', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a custom test request then returns the run test object', function(done) {
      wpt.runTest('http://twitter.com/marcelduran', {
        'location': 'Local_Firefox_Chrome:Chrome',
        label: 'test 123',
        runs: 3,
        firstViewOnly: true,
        timeline: true,
        netLog: true,
        fullResolutionScreenshot: true
      }, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a script test request then returns the run test object', function(done) {
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

      wpt.runTest(script, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTest);
        done();
      });
    });

    it('gets a cancel test request then returns the test cancelled object', function(done) {
      wpt.cancelTest('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.cancel);
        done();
      });
    });

    it('gets page speed data request then returns the page speed object', function(done) {
      wpt.getPageSpeedData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.pageSpeed);
        done();
      });
    });

    it('gets HAR data request then returns the HAR object', function(done) {
      wpt.getHARData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.har);
        done();
      });
    });

    it('gets utilization data request then returns the utilization object', function(done) {
      wpt.getUtilizationData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.utilization);
        done();
      });
    });

    it('gets request data request then returns the request object', function(done) {
      wpt.getRequestData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.request);
        done();
      });
    });

    it('gets timeline data request then returns the timeline object', function(done) {
      wpt.getTimelineData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.timeline);
        done();
      });
    });

    it('gets net log data request then returns the net log object', function(done) {
      wpt.getNetLogData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.netLog);
        done();
      });
    });

    it('gets console log data request then returns the console log object', function(done) {
      wpt.getConsoleLogData('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.consoleLog);
        done();
      });
    });

    it('gets test info request then returns the test info object', function(done) {
      wpt.getTestInfo('120816_V2_2', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testInfo);
        done();
      });
    });

    it('gets history request then returns the history object', function(done) {
      wpt.getHistory(2, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.history);
        done();
      });
    });

    it('gets a waterfall image request then returns the waterfall data URI string', function(done) {
      wpt.getWaterfallImage('120816_V2_2', {dataURI: true}, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.waterfall);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        done();
      });
    });

    it('gets a waterfall thumbnail request then returns the waterfall thumbnail data URI string', function(done) {
      wpt.getWaterfallImage('120816_V2_2', {
        thumbnail: true,
        dataURI: true
      }, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.waterfallThumbnail);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        done();
      });
    });

    it('gets a screenshot request then returns the screenshot data URI string', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {dataURI: true}, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.screenshot);
        assert.deepEqual(info, {type: 'image/jpeg', encoding: 'utf8'});
        done();
      });
    });

    it('gets a screenshot thumbnail request then returns the screenshot thumbail data URI string', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {
        thumbnail: true,
        dataURI: true
      }, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.screenshotThumbnail);
        assert.deepEqual(info, {type: 'image/jpeg', encoding: 'utf8'});
        done();
      });
    });

    it('gets a screenshot in full resolution request then returns the screenshot in full resolution data URI string', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {
        fullResolution: true,
        dataURI: true
      }, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.screenshotFullResolution);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        done();
      });
    });

    it('creates a video', function (done) {
      wpt.createVideo('130416_YS_KD4-r:3-c:1,130416_W6_KEE-r:8-c:1', {}, function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.createVideo);
        done();
      });
    });

    it('gets the url of an embedded video', function (done) {
      wpt.getEmbedVideoPlayer('130416_36ed6e37013655a14b2b857cdccec99db72adcaa', {}, function (err, data) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.embeddedVideoPlayer + "\n");
        done();
      });
    });

    it('gets Google csi data', function(done) {
      wpt.getGoogleCsiData('140101_AB_12', function(err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.googleCsiData);
        done();
      });
    });

    it('gets Google csi data from run 2 only', function(done) {
      wpt.getGoogleCsiData('140101_AB_12', {run: 2}, function(err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.googleCsiDataRun2);
        done();
      });
    });

    it('gets response body', function(done) {
      wpt.getResponseBody('140101_AB_12', function(err, data) {
        if (err) throw err;
        assert.deepEqual(data.result.trim(), ResponseObjects.response.data.result);
        done();
      });
    });

    // not found / invalid

    it('gets an invalid test status request then returns a not found test status object', function(done) {
      wpt.getTestStatus('120816_V2_3', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testStatusNotFound);
        done();
      });
    });

    it('gets an invalid test results request then returns a not found test results object', function(done) {
      wpt.getTestResults('120816_V2_3', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResultsNotFound);
        done();
      });
    });

    it('gets an invalid test request then returns an invalid run test object', function(done) {
      wpt.runTest(undefined, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTestInvalid);
        done();
      });
    });

    it('gets an invalid file request then returns a 404 error', function(done) {
      wpt.getPageSpeedData('120816_V2_3', function (err, data) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
        done();
      });
    });

    it('gets an invalid HAR data request then returns an empty HAR object', function(done) {
      wpt.getHARData('120816_V2_3', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.harNotFound);
        done();
      });
    });

    it('gets an invalid waterfall image request then returns an empty waterfall data URI string', function(done) {
      wpt.getWaterfallImage('120816_V2_3', {dataURI: true}, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.waterfallNotFound);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        done();
      });
    });

    it('gets an invalid waterfall thumbnail request then returns an empty waterfall thumbnail data URI string', function(done) {
      wpt.getWaterfallImage('120816_V2_3', {
        thumbnail: true,
        dataURI: true
      }, function (err, data, info) {
        if (err) return done(err);
        assert.equal(data, ResponseObjects.waterfallThumbnailNotFound);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        done();
      });
    });

    it('gets an invalid screenshot thumbnail request then returns a 404 error', function(done) {
      wpt.getScreenshotImage('120816_V2_3', {
        thumbnail: true,
        dataURI: true
      }, function (err, data, info) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
        done();
      });
    });

    it('gets a cancel test of already cancelled test request then returns the test not cancelled object', function(done) {
      wpt.cancelTest('120816_V2_3', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.cancelNotCancelled);
        done();
      });
    });

    it('gets a cancel test of an invalid test request then returns a 404 error', function(done) {
      wpt.cancelTest('120816_V2_4', function (err, data) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
        done();
      });
    });

    it('gets a test request for an api key required server then returns the no api key response object', function(done) {
      wpt.runTest('http://apikey.com', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTestNoAPIKey);
        done();
      });
    });

    it('gets a test request for an api key required server with invalid key then returns the no api key response object', function(done) {
      wpt.runTest('http://apikey.com', {key: '12345'}, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.runTestInvalidAPIKey);
        done();
      });
    });

  });
});
