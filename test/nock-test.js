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
  'An Example WebPageTest Server': {
    topic: new WebPageTest('example.com'),
 
    'gets a test status requested': {
      topic: function (wpt) {
        wpt.getTestStatus('120816_V2_2', this.callback);
      },
      'returns the test status object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testStatus);
      }
    },
 
    'gets a test results requested': {
      topic: function (wpt) {
        wpt.getTestResults('120816_V2_2', this.callback);
      },
      'returns the test results object': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.testResults);
      }
    },
 
    'gets the locations list requested': {
      topic: function (wpt) {
        wpt.getLocations(this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.locations);
      }
    },
 
    'gets a simple test requested': {
      topic: function (wpt) {
        wpt.runTest({url: 'http://foobar.com'}, this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTestSimple);
      }
    },
 
    'gets a custom test requested': {
      topic: function (wpt) {
        wpt.runTest({
          url: 'http://twitter.com/marcelduran',
          'location': 'Local_Firefox_Chrome:Chrome',
          label: 'test 123',
          runs: 3,
          firstViewOnly: true,
          timeline: true,
          netLog: true,
          fullResolutionScreenshot: true
        }, this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTestCustom);
      }
    },
 
    'gets a script test requested': {
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

        wpt.runTest({script:script}, this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.runTestScript);
      }
    },
 
    'gets page speed data requested': {
      topic: function (wpt) {
        wpt.getPageSpeedData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.pageSpeed);
      }
    },
 
    'gets HAR data requested': {
      topic: function (wpt) {
        wpt.getHARData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.har);
      }
    },
 
    'gets utilization data requested': {
      topic: function (wpt) {
        wpt.getUtilizationData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.utilization);
      }
    },
 
    'gets request data requested': {
      topic: function (wpt) {
        wpt.getRequestData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.request);
      }
    },
 
    'gets timeline data requested': {
      topic: function (wpt) {
        wpt.getTimelineData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.timeline);
      }
    },
 
    'gets net log data requested': {
      topic: function (wpt) {
        wpt.getNetLogData('120816_V2_2', this.callback);
      },
      'returns the API url': function (err, data) {
        if (err) throw err;
        assert.deepEqual(data, ResponseObjects.netLog);
      }
    },
 
    'gets a waterfall image requested': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {dataURI: true}, this.callback);
      },
      'returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.waterfall);
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a waterfall thumbnail requested': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.waterfallThumnail);
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a screenshot requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {dataURI: true}, this.callback);
      },
      'returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.screenshot);
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot thumbnail requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          thumbnail: true,
          dataURI: true
        }, this.callback);
      },
      'returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.screenshotThumbnail);
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot in full resolution requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          fullResolution: true,
          dataURI: true
        }, this.callback);
      },
      'returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data, ResponseObjects.screenshotFullResolution);
        assert.equal(mimeType, 'image/png');
      }
    }

  }
}).export(module);
