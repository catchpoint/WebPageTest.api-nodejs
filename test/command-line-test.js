/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert      = require('assert'),
    path        = require('path'),
    fs          = require('fs'),
    exec        = require('child_process').exec,
    WebPageTest = require('../lib/webpagetest');

var wptServer = 'https://www.example.com:1234/foo/bar/',
    nodeCmd = process.argv[0],
    executable = path.join(__dirname, '../bin/webpagetest');

function mock(command) {
  return nodeCmd + ' ' + executable + ' -s ' + wptServer +  ' -d ' + command;
}

function getHelp(command) {
  command = command ? '-' + command : '';

  return fs.readFileSync(path.join(__dirname, './fixtures/command-line/help' +
    command + '.txt'), 'utf8');
}

describe('WebPageTest Command Line', function() {

  it('gets a test status input returns the API url', function(done) {
    exec(mock('status 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'testStatus.php?test=120816_V2_2');
      done();
    });
  });

  it('gets a test results input returns the API url', function(done) {
    exec(mock('results 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'jsonResult.php?test=120816_V2_2');
      done();
    });
  });

  it('gets a test results for multi runs with custom median metric input returns the API url', function(done) {
    exec(mock('results 120816_V2_2 -m TTFB'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer +
        'jsonResult.php?test=120816_V2_2&medianMetric=TTFB');
      done();
    });
  });

  it('gets a test results with extra data input returns the API url', function(done) {
    exec(mock('results 141106_8N_ZRC -bDpR'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
        assert.equal(data.url, wptServer +
          'jsonResult.php?test=141106_8N_ZRC&breakdown=1&domains=1&pagespeed=1&requests=1');
      done();
    });
  });

  it('gets the locations list input returns the API url', function(done) {
    exec(mock('locations'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getLocations.php');
      done();
    });
  });

  it('gets the testers list input returns the API url', function(done) {
    exec(mock('testers'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getTesters.php');
      done();
    });
  });

  it('gets a simple test input returns the API url', function(done) {
    exec(mock('test http://foobar.com'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&f=json');
      done();
    });
  });

  it('gets a custom test input returns the API url', function(done) {
    exec(mock(
        'test http://twitter.com/marcelduran ' +
        '--location Local_Firefox_Chrome:Chrome ' +
        '--label "test 123" ' +
        '--runs 3 ' +
        '--first ' +
        '--timeline ' +
        '--netlog ' +
        '--full'
      ), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&label=test%20123&timeline=1&netlog=1&pngss=1&f=json');
      done();
    });
  });

  it('gets a script test input returns the API url', function(done) {
      var script = WebPageTest.scriptToString([
        {logData:    0                           },
        {navigate:   'http://foo.com/login'      },
        '// log some data',
        {logData:    1                           },
        {setValue:   ['name=username', 'johndoe']},
        {setValue:   ['name=password', '12345']  },
        {submitForm: 'action=http://foo.com/main'},
        'waitForComplete'
      ]);

    exec(mock('test ' + encodeURIComponent(script)), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&url=https%3A%2F%2Fwww.webpagetest.org&f=json');
      done();
    });
  });

  it('gets a script file test input returns the API url', function(done) {
      var filename = path.join(__dirname, './fixtures/script.txt');

    exec(mock('test ' + filename), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete%0A&url=https%3A%2F%2Fwww.webpagetest.org&f=json');
      done();
    });
  });

  it('gets a cancel test input returns the API url', function(done) {
    exec(mock('cancel 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'cancelTest.php?test=120816_V2_2');
      done();
    });
  });

  it('gets a cancel test with api key input returns the API url', function(done) {
    exec(mock('cancel -k 12345 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'cancelTest.php?test=120816_V2_2&k=12345');
      done();
    });
  });

  it('gets a page speed data input returns the API url', function(done) {
    exec(mock('pagespeed 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_pagespeed.txt');
      done();
    });
  });

  it('gets a HAR data input returns the API url', function(done) {
    exec(mock('har 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'export.php?test=120816_V2_2');
      done();
    });
  });

  it('gets a utilization data input returns the API url', function(done) {
    exec(mock('utilization 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_progress.csv');
      done();
    });
  });

  it('gets a request data input returns the API url', function(done) {
    exec(mock('request 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_IEWTR.txt');
      done();
    });
  });

  it('gets a timeline data input returns the default API url', function(done) {
    exec(mock('timeline 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getTimeline.php?test=120816_V2_2');
      done();
    });
  });

  it('gets a custom timeline data input returns the API url', function(done) {
    exec(mock('timeline 120816_V2_2 -r 2 --cached'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getTimeline.php?test=120816_V2_2&run=2&cached=1');
      done();
    });
  });

  it('gets a net log data input returns the API url', function(done) {
    exec(mock('netlog 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_netlog.txt');
      done();
    });
  });

  it('gets a console log data input returns the API url', function(done) {
    exec(mock('console 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_console_log.json');
      done();
    });
  });

  it('gets a test info input returns the API url', function(done) {
    exec(mock('testinfo 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=testinfo.json');
      done();
    });
  });

  it('gets a history input returns the API url', function(done) {
    exec(mock('history 2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'testlog.php?all=on&f=csv&days=2');
      done();
    });
  });

  it('gets a waterfall image input returns the API url', function(done) {
    exec(mock('waterfall 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0');
      done();
    });
  });

  it('gets a waterfall thumbnail input returns the API url', function(done) {
    exec(mock('waterfall 120816_V2_2 --thumbnail'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&run=1&cached=0&file=1_waterfall.png');
      done();
    });
  });

  it('gets a customized waterfall image input returns the API url', function(done) {
    exec(mock('waterfall 120816_V2_2 --type connection --mime --width 640 --max 9 --requests 1,2,4,6-8 --nocpu --nobandwidth --noellipsis --nolabels'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0&type=connection&mime=1&width=640&max=9&requests=1%2C2%2C4%2C6-8&cpu=0&bw=0&dots=0&labels=0');
      done();
    });
  });

  it('gets a screenshot input returns the API url', function(done) {
    exec(mock('screenshot 120816_V2_2'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.jpg');
      done();
    });
  });

  it('gets a screenshot thumbnail input returns the API url', function(done) {
    exec(mock('screenshot 120816_V2_2 --thumbnail'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&file=1_screen.jpg&run=1&cached=0');
      done();
    });
  });

  it('gets a screenshot in full resolution input returns the API url', function(done) {
    exec(mock('screenshot 120816_V2_2 --full'), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.png');
      done();
    });
  });

  // loop all commands help
  [
    '', 'status', 'results', 'locations', 'testers', 'test', 'cancel', 'har',
    'pagespeed', 'utilization', 'request', 'timeline', 'netlog', 'chrometrace',
    'console', 'testinfo', 'history', 'googlecsi', 'response', 'waterfall',
    'screenshot', 'video', 'player', 'listen', 'batch'
  ].forEach(function eachCmd(command) {
      it('gets a ' + command + ' help input and returns the help text', function(done) {
        exec(mock(command + ' --help'), function(err, data) {
          if (err) return done(err);
          data = data.replace(/[\r\n\s]/g, '');
          var output = getHelp(command);
          output = output.replace(/[\r\n\s]/g, '');
          assert.equal(data, output);
          done();
        });
      });
  });

  it('gets a batch input returns the batch commands output in order', function(done) {
    exec(mock('batch ' + path.join(__dirname, 'fixtures/batch.txt')), function(err, data) {
      if (err) return done(err);
      data = JSON.parse(data);
      assert.equal(data[0].url, wptServer + 'testStatus.php?test=120816_V2_2');
      assert.equal(data[1].url, wptServer + 'jsonResult.php?test=120816_V2_2');
      assert.equal(data[2].url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.jpg');
      done();
    });
  });

});
