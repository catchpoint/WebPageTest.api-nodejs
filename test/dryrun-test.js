/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows = require('vows'),
    assert = require('assert');

var WebPageTest = require('../lib/webpagetest');

vows.describe('Dry Run').addBatch({
  'An Example WebPageTest Server': {
    topic: new WebPageTest('example.com'),
 
    'gets a test status request': {
      topic: function (wpt) {
        wpt.getTestStatus('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/testStatus.php?test=120816_V2_2');
      }
    },
 
    'gets a test results request': {
      topic: function (wpt) {
        wpt.getTestResults('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/xmlResult.php?test=120816_V2_2');
      }
    },
 
    'gets the locations list request': {
      topic: function (wpt) {
        wpt.getLocations({dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getLocations.php');
      }
    },
 
    'gets a simple test request': {
      topic: function (wpt) {
        wpt.runTest('http://foobar.com', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/runtest.php?url=http%3A%2F%2Ffoobar.com&f=json');
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
          fullResolutionScreenshot: true,
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&label=test%20123&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&pngss=1&timeline=1&netlog=1&f=json');
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

        wpt.runTest(script, {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&f=json');
      }
    },
 
    'gets page speed data request': {
      topic: function (wpt) {
        wpt.getPageSpeedData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_pagespeed.txt');
      }
    },
 
    'gets HAR data request': {
      topic: function (wpt) {
        wpt.getHARData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/export.php?test=120816_V2_2');
      }
    },
 
    'gets utilization data request': {
      topic: function (wpt) {
        wpt.getUtilizationData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_progress.csv');
      }
    },
 
    'gets request data request': {
      topic: function (wpt) {
        wpt.getRequestData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_IEWTR.txt');
      }
    },
 
    'gets timeline data request': {
      topic: function (wpt) {
        wpt.getTimelineData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_timeline.json');
      }
    },
 
    'gets net log data request': {
      topic: function (wpt) {
        wpt.getNetLogData('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_netlog.txt');
      }
    },
 
    'gets a waterfall image request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/waterfall.php?test=120816_V2_2&run=1&cached=0');
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a waterfall thumbnail request': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', {
          thumbnail: true,
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/thumbnail.php?test=120816_V2_2&run=1&cached=0&file=1_waterfall.png');
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a screenshot request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {dryRun: true}, this.callback);
      },
      'then returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_screen.jpg');
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot thumbnail request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          thumbnail: true,
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/thumbnail.php?test=120816_V2_2&file=1_screen.jpg&run=1&cached=0');
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot in full resolution request': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', {
          fullResolution: true,
          dryRun: true
        }, this.callback);
      },
      'then returns the API url': function (err, data, mimeType) {
        if (err) throw err;
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_screen.png');
        assert.equal(mimeType, 'image/png');
      }
    }

  }
}).export(module);
