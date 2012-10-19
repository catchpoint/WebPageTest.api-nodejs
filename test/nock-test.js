/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows = require('vows'),
    assert = require('assert');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

var wptNockServer = new NockServer('http://example.com');

vows.describe('Dry Run').addBatch({
  'An Example WebPageTest Nock Server': {
    topic: new WebPageTest('example.com'),
 
    'gets a test status request': {
      topic: function (wpt) {
        wpt.getTestStatus('120816_V2_2', this.callback);
      },
      'returns the test status object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testStatus);
      }
    },
 
    'gets a test results request': {
      topic: function (wpt) {
        wpt.getTestResults('120816_V2_2', this.callback);
      },
      'returns the test results object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testResults);
      }
    },
 
    'gets the locations list request': {
      topic: function (wpt) {
        wpt.getLocations(this.callback);
      },
      'returns the location list object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.locations);
      }
    },
 
    'gets a simple test request': {
      topic: function (wpt) {
        wpt.runTest('http://twitter.com/marcelduran', this.callback);
      },
      'returns the run test object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'gets a custom test request': {
      topic: function (wpt) {
        wpt.runTest('http://twitter.com/marcelduran', {
          'location': 'Local_Firefox_Chrome:Chrome',
          label: 'test 123',
          runs: 3,
          firstViewOnly: true,
          timeline: true,
          netLog: true,
          fullResolutionScreenshot: true
        }, this.callback);
      },
      'returns the run test object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'gets a script test request': {
      topic: function (wpt) {
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

        wpt.runTest(script, this.callback);
      },
      'returns the run test object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTest);
      }
    },
 
    'gets a cancel test request': {
      topic: function (wpt) {
        wpt.cancelTest('120816_V2_2', this.callback);
      },
      'returns the test cancelled object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.cancel);
      }
    },
 
    'gets page speed data request': {
      topic: function (wpt) {
        wpt.getPageSpeedData('120816_V2_2', this.callback);
      },
      'returns the page speed object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.pageSpeed);
      }
    },
 
    'gets HAR data request': {
      topic: function (wpt) {
        wpt.getHARData('120816_V2_2', this.callback);
      },
      'returns the HAR object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.har);
      }
    },
 
    'gets utilization data request': {
      topic: function (wpt) {
        wpt.getUtilizationData('120816_V2_2', this.callback);
      },
      'returns the utilization object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.utilization);
      }
    },
 
    'gets request data request': {
      topic: function (wpt) {
        wpt.getRequestData('120816_V2_2', this.callback);
      },
      'returns the request object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.request);
      }
    },
 
    'gets timeline data request': {
      topic: function (wpt) {
        wpt.getTimelineData('120816_V2_2', this.callback);
      },
      'returns the timeline object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.timeline);
      }
    },
 
    'gets net log data request': {
      topic: function (wpt) {
        wpt.getNetLogData('120816_V2_2', this.callback);
      },
      'returns the net log object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.netLog);
      }
    },
 
    'gets console log data request': {
      topic: function (wpt) {
        wpt.getConsoleLogData('120816_V2_2', this.callback);
      },
      'returns the console log object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.consoleLog);
      }
    },
 
    'gets a waterfall image request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {dataURI: true}, this.callback);
      },
      'returns the waterfall data URI string': function (err, data, info) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.waterfall);
        assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
      }
    },
 
    'gets a waterfall thumbnail request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns the waterfall thumbnail data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.waterfallThumbnail);
          assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        }
    },
 
    'gets a screenshot request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {dataURI: true}, this.callback);
      },
      'returns the screenshot data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.screenshot);
          assert.deepEqual(info, {type: 'image/jpeg', encoding: 'utf8'});
        }
    },
 
    'gets a screenshot thumbnail request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns the screenshot thumbail data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.screenshotThumbnail);
          assert.deepEqual(info, {type: 'image/jpeg', encoding: 'utf8'});
        }
    },
 
    'gets a screenshot in full resolution request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          fullResolution: true,
          dataURI: true
        }, this.callback);
      },
      'returns the screenshot in full resolution data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.screenshotFullResolution);
          assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        }
    },

    // not found / invalid

    'gets an invalid test status request': {
      topic: function (wpt) {
        wpt.getTestStatus('120816_V2_3', this.callback);
      },
      'returns a not found test status object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testStatusNotFound);
      }
    },
 
    'gets an invalid test results request': {
      topic: function (wpt) {
        wpt.getTestResults('120816_V2_3', this.callback);
      },
      'returns a not found test results object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testResultsNotFound);
      }
    },
 
    'gets an invalid test request': {
      topic: function (wpt) {
        wpt.runTest(undefined, this.callback);
      },
      'returns an invalid run test object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTestInvalid);
      }
    },
 
    'gets an invalid file request': {
      topic: function (wpt) {
        wpt.getPageSpeedData('120816_V2_3', this.callback);
      },
      'returns a 404 error': function (err, data) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
      }
    },
 
    'gets an invalid HAR data request': {
      topic: function (wpt) {
        wpt.getHARData('120816_V2_3', this.callback);
      },
      'returns an empty HAR object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.harNotFound);
      }
    },
 
    'gets an invalid waterfall image request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_3', {dataURI: true}, this.callback);
      },
      'returns an empty waterfall data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.waterfallNotFound);
          assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        }
    },
 
    'gets an invalid waterfall thumbnail request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_3', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns an empty waterfall thumbnail data URI string':
        function (err, data, info) {
          if (err) throw err;
          assert.equal(data, ResponseObjects.waterfallThumbnailNotFound);
          assert.deepEqual(info, {type: 'image/png', encoding: 'utf8'});
        }
    },
 
    'gets an invalid screenshot thumbnail request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_3', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns a 404 error': function (err, data, info) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
      }
    },
 
    'gets a cancel test of already cancelled test request': {
      topic: function (wpt) {
        wpt.cancelTest('120816_V2_3', this.callback);
      },
      'returns the test not cancelled object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.cancelNotCancelled);
      }
    },

    'gets a cancel test of an invalid test request': {
      topic: function (wpt) {
        wpt.cancelTest('120816_V2_4', this.callback);
      },
      'returns a 404 error': function (err, data) {
        assert.equal(err.code, 404);
        assert.equal(err.message, 'Not Found');
        assert.equal(data, undefined);
      }
    }

  }
}).export(module);
