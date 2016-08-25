/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
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

    it('gets a test status request with requestId', function(done) {
      wpt.getTestStatus('120816_V2_2', {
        request: '12345',
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'testStatus.php?test=120816_V2_2&r=12345');
        done();
      });
    });

    it('gets a test results request', function(done) {
      wpt.getTestResults('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'jsonResult.php?test=120816_V2_2');
        done();
      });
    });

    it('gets a test results request with requestId', function(done) {
      wpt.getTestResults('120816_V2_2', {
        request: '12345',
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'jsonResult.php?test=120816_V2_2&r=12345');
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
          'jsonResult.php?test=120816_V2_2&medianMetric=TTFB');
        done();
      });
    });

    it('gets a test results with extra data request', function(done) {
      wpt.getTestResults('141106_8N_ZRC', {
        breakDown: true,
        domains: true,
        pageSpeed: true,
        requests: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer +
          'jsonResult.php?test=141106_8N_ZRC&breakdown=1&domains=1&pagespeed=1&requests=1');
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

    it('gets the locations list request with requestId', function(done) {
      wpt.getLocations({dryRun: true, request: '12345'}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getLocations.php?r=12345');
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

    it('gets the testers list request with requestId', function(done) {
      wpt.getTesters({dryRun: true, request: '12345'}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getTesters.php?r=12345');
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
          request: '12345',
          dryRun: true
        }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&label=test%20123&timeline=1&netlog=1&pngss=1&r=12345&f=json');
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
        assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&url=https%3A%2F%2Fwww.webpagetest.org&f=json');
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

    it('gets a cancel test with api key request', function(done) {
      wpt.cancelTest('120816_V2_2', {key: '12345', dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'cancelTest.php?test=120816_V2_2&k=12345');
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

    it('gets default timeline data request', function(done) {
      wpt.getTimelineData('120816_V2_2', {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getTimeline.php?test=120816_V2_2');
        done();
      });
    });

    it('gets custom timeline data request', function(done) {
      wpt.getTimelineData('120816_V2_2', {
        run: 2,
        cached: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'getTimeline.php?test=120816_V2_2&run=2&cached=1');
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

    it('gets history request', function(done) {
      wpt.getHistory(2, {dryRun: true}, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'testlog.php?all=on&f=csv&days=2');
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

    // alias

    it('gets a custom test request using aliases', function(done) {
      wpt.test('http://twitter.com/marcelduran', {
          l: 'Local_Firefox_Chrome:Chrome',
          L: 'test 123',
          r: 3,
          first: true,
          M: true,
          netlog: true,
          full: true,
          e: '12345',
          dryRun: true
        }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&fvonly=1&netlog=1&pngss=1&location=Local_Firefox_Chrome%3AChrome&runs=3&label=test%20123&timeline=1&r=12345&f=json');
        done();
      });
    });

    it('gets a customized waterfall image request with aliases', function(done) {
      wpt.waterfall('120816_V2_2', {
        type: 'connection',
        mime: true,
        width: 640,
        max: 9,
        R: '1,2,4,6-8',
        C: true,
        b: true,
        noellipsis: true,
        l: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0&type=connection&mime=1&width=640&max=9&dots=0&requests=1%2C2%2C4%2C6-8&cpu=0&bw=0&labels=0');
        done();
      });
    });

    it('gets a screenshot thumbnail request with aliases', function(done) {
      wpt.screenshot('120816_V2_2', {
        cached: true,
        r: 2,
        t: true,
        complete: true,
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&file=2_Cached_screen_doc.jpg&run=2&cached=1');
        done();
      });
    });

    it('create a video', function (done) {
      wpt.createVideo('130416_YS_KD4-r:3-c:1,130416_W6_KEE-r:8-c:1', {dryRun: true}, function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'video/create.php?tests=130416_YS_KD4-r%3A3-c%3A1%2C130416_W6_KEE-r%3A8-c%3A1&f=json&end=visual');
        done();
      });
    });

    it('create a video with document complete comparison end point', function (done) {
      wpt.createVideo('130416_YS_KD4-r:3-c:1,130416_W6_KEE-r:8-c:1', {dryRun: true, comparisonEndPoint: 'doc'}, function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'video/create.php?tests=130416_YS_KD4-r%3A3-c%3A1%2C130416_W6_KEE-r%3A8-c%3A1&f=json&end=doc');
        done();
      });
    });

    it('get the url of an embedded video', function (done) {
      wpt.getEmbedVideoPlayer('130416_36ed6e37013655a14b2b857cdccec99db72adcaa', {dryRun: true}, function (err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'video/view.php?embed=1&id=130416_36ed6e37013655a14b2b857cdccec99db72adcaa');
        done();
      });
    });

    it('get google csi', function(done) {
      wpt.getGoogleCsiData('140101_AB_12', {dryRun: true}, function(err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'google/google_csi.php?test=140101_AB_12');
        done();
      });
    });

    it('get google csi run 3 cached', function(done) {
      wpt.getGoogleCsiData('140101_AB_12', {
        dryRun: true,
        repeatView: true,
        run: 3
      }, function(err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'google/google_csi.php?test=140101_AB_12&run=3&cached=1');
        done();
      });
    });

    it('get response body for first run first request', function(done) {
      wpt.getResponseBody('140101_AB_12', {dryRun: true}, function(err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'response_body.php?test=140101_AB_12&run=1&cached=0&request=1');
        done();
      });
    });

    it('get response body for cached 3rd run 5th request', function(done) {
      wpt.getResponseBody('140101_AB_12', {
        dryRun: true,
        repeatView: true,
        run: 3,
        request: 5
      }, function(err, data) {
        if (err) throw err;
        assert.equal(data.url, wptServer + 'response_body.php?test=140101_AB_12&run=3&cached=1&request=5');
        done();
      });
    });

  });
});
