/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var assert      = require('assert'),
    WebPageTest = require('../lib/webpagetest');

var wptServer = 'https://www.example.com:1234/foo/bar/',
    wpt = new WebPageTest(wptServer);

describe('Dry Run', function() {
  describe('An Example WebPageTest Server', function() {

    it('gets a test status request', function(done) {
      wpt.getTestStatus('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'testStatus.php?test=120816_V2_2');
        done();
      });
    });

    it('gets a test results request', function(done) {
      wpt.getTestResults('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'xmlResult.php?test=120816_V2_2');
        done();
      });
    });

    it('gets a test results for multi runs with custom median metric request', function(done) {
      wpt.getTestResults('120816_V2_2', {
          dryRun: true,
          medianMetric: 'TTFB'
        }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer +
          'xmlResult.php?test=120816_V2_2&medianMetric=TTFB');
        done();
      });
    });

    it('gets the locations list request', function(done) {
      wpt.getLocations({dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getLocations.php');
        done();
      });
    });

    it('gets the testers list request', function(done) {
      wpt.getTesters({dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getTesters.php');
        done();
      });
    });

    it('gets a simple test request', function(done) {
      wpt.runTest('http://foobar.com', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&f=json');
        done();
      });
    });

    it('gets a custom test request', function(done) {
      wpt.runTest('http://twitter.com/marcelduran', {
          'location': 'Local_Firefox_Chrome:Chrome',
          label: 'test 123',
          runs: 3,
          firstViewOnly: true,
          timeline: true,
          netLog: true,
          fullResolutionScreenshot: true,
          dryRun: true
        }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&label=test%20123&pngss=1&timeline=1&netlog=1&f=json');
        done();
      });
    });

    it('gets a script test request', function(done) {
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

        wpt.runTest(script, {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&f=json');
        done();
      });
    });

    it('gets a cancel test request', function(done) {
      wpt.cancelTest('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'cancelTest.php?test=120816_V2_2');
        done();
      });
    });

    it('gets page speed data request', function(done) {
      wpt.getPageSpeedData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_pagespeed.txt');
        done();
      });
    });

    it('gets HAR data request', function(done) {
      wpt.getHARData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'export.php?test=120816_V2_2');
        done();
      });
    });

    it('gets utilization data request', function(done) {
      wpt.getUtilizationData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_progress.csv');
        done();
      });
    });

    it('gets request data request', function(done) {
      wpt.getRequestData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_IEWTR.txt');
        done();
      });
    });

    it('gets timeline data request', function(done) {
      wpt.getTimelineData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_timeline.json');
        done();
      });
    });

    it('gets net log data request', function(done) {
      wpt.getNetLogData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_netlog.txt');
        done();
      });
    });

    it('gets console log data request', function(done) {
      wpt.getConsoleLogData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_console_log.json');
        done();
      });
    });

    it('gets test info request', function(done) {
      wpt.getTestInfo('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=testinfo.json');
        done();
      });
    });

    it('gets a waterfall image request', function(done) {
      wpt.getWaterfallImage('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0');
        done();
      });
    });

    it('gets a waterfall thumbnail request', function(done) {
      wpt.getWaterfallImage('120816_V2_2', {
        thumbnail: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&run=1&cached=0&file=1_waterfall.png');
        done();
      });
    });

    it('gets a customized waterfall image request', function(done) {
      wpt.getWaterfallImage('120816_V2_2', {
        chartType: 'connection',
        colorByMime: true,
        chartWidth: 640,
        maxTime: 9,
        requests: '1,2,4,6-8',
        noCPU: true,
        noBandwidth: true,
        noEllipsis: true,
        noLabels: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0&type=connection&mime=1&width=640&max=9&requests=1%2C2%2C4%2C6-8&cpu=0&bw=0&dots=0&labels=0');
        done();
      });
    });

    it('gets a screenshot request', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.jpg');
        done();
      });
    });

    it('gets a screenshot thumbnail request', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {
        thumbnail: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&file=1_screen.jpg&run=1&cached=0');
        done();
      });
    });

    it('gets a screenshot in full resolution request', function(done) {
      wpt.getScreenshotImage('120816_V2_2', {
        fullResolution: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.png');
        done();
      });
    });

  });
});
