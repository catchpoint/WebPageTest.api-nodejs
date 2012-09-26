/**
 * Copyright (c) 2012, Twitter Inc. All rights reserved.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

var vows = require('vows'),
    assert = require('assert'),
    url = require('url');

var WebPageTest = require('../lib/webpagetest');

vows.describe('Dry Run').addBatch({
  'An Example WebPageTest Server': {
    topic: new WebPageTest('example.com'),
 
    'gets a test status requested': {
      topic: function (wpt) {
        wpt.getTestStatus('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/testStatus.php?test=120816_V2_2');
      }
    },
 
    'gets a test results requested': {
      topic: function (wpt) {
        wpt.getTestResults('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/xmlResult.php?test=120816_V2_2');
      }
    },
 
    'gets the locations list requested': {
      topic: function (wpt) {
        wpt.getLocations(this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getLocations.php');
      }
    },
 
    'gets a simple test requested': {
      topic: function (wpt) {
        wpt.runTest({url: 'http://foobar.com'}, this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/runtest.php?url=http%3A%2F%2Ffoobar.com&f=json');
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
        }, this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&label=test%20123&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&pngss=1&timeline=1&netlog=1&f=json');
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

        wpt.runTest({script:script}, this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&f=json');
      }
    },
 
    'gets page speed data requested': {
      topic: function (wpt) {
        wpt.getPageSpeedData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_pagespeed.txt');
      }
    },
 
    'gets HAR data requested': {
      topic: function (wpt) {
        wpt.getHARData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/export.php?test=120816_V2_2');
      }
    },
 
    'gets utilization data requested': {
      topic: function (wpt) {
        wpt.getUtilizationData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_progress.csv');
      }
    },
 
    'gets request data requested': {
      topic: function (wpt) {
        wpt.getRequestData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_IEWTR.txt');
      }
    },
 
    'gets timeline data requested': {
      topic: function (wpt) {
        wpt.getTimelineData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_timeline.json');
      }
    },
 
    'gets net log data requested': {
      topic: function (wpt) {
        wpt.getNetLogData('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_netlog.txt');
      }
    },
 
    'gets a waterfall image requested': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data, mimeType) {
        assert.equal(data.url, 'http://example.com/waterfall.php?test=120816_V2_2&run=1&cached=0');
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a waterfall thumbnail requested': {
      topic: function (wpt) {
        wpt.getWaterfallImage('120816_V2_2', this.callback, {
          thumbnail: true,
          dryRun: true
        });
      },
      'returns the API url': function (err, data, mimeType) {
        assert.equal(data.url, 'http://example.com/thumbnail.php?test=120816_V2_2&run=1&cached=0&file=1_waterfall.png');
        assert.equal(mimeType, 'image/png');
      }
    },
 
    'gets a screenshot requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', this.callback, {dryRun: true});
      },
      'returns the API url': function (err, data, mimeType) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_screen.jpg');
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot thumbnail requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', this.callback, {
          thumbnail: true,
          dryRun: true
        });
      },
      'returns the API url': function (err, data, mimeType) {
        assert.equal(data.url, 'http://example.com/thumbnail.php?test=120816_V2_2&file=1_screen.jpg&run=1&cached=0');
        assert.equal(mimeType, 'image/jpeg');
      }
    },
 
    'gets a screenshot in full resolution requested': {
      topic: function (wpt) {
        wpt.getScreenshotImage('120816_V2_2', this.callback, {
          fullResolution: true,
          dryRun: true
        });
      },
      'returns the API url': function (err, data, mimeType) {
        assert.equal(data.url, 'http://example.com/getgzip.php?test=120816_V2_2&file=1_screen.png');
        assert.equal(mimeType, 'image/png');
      }
    }

  }
}).export(module);
