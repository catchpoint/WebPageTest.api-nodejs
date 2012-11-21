/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var vows        = require('vows'),
    assert      = require('assert'),
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

vows.describe('Command Line').addBatch({
  'A WebPageTest Command Line': {

    'gets a test status input': {
      topic: function() {
        exec(mock('status 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'testStatus.php?test=120816_V2_2');
      }
    },

    'gets a test results input': {
      topic: function() {
        exec(mock('results 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'xmlResult.php?test=120816_V2_2');
      }
    },

    'gets the locations list input ': {
      topic: function() {
        exec(mock('locations'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getLocations.php');
      }
    },

    'gets a simple test input ': {
      topic: function() {
        exec(mock('test http://foobar.com'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&f=json');
      }
    },

    'gets a custom test input ': {
      topic: function() {
        exec(mock(
          'test http://twitter.com/marcelduran ' +
          '--location Local_Firefox_Chrome:Chrome ' +
          '--label "test 123" ' +
          '--runs 3 ' +
          '--first ' +
          '--timeline ' +
          '--netlog ' +
          '--full'
        ), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ftwitter.com%2Fmarcelduran&location=Local_Firefox_Chrome%3AChrome&runs=3&fvonly=1&label=test%20123&pngss=1&timeline=1&netlog=1&f=json');
      }
    },

    'gets a script test input ': {
      topic: function() {
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

        exec(mock('test ' + encodeURIComponent(script)), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete&f=json');
      }
    },

    'gets a script file test input ': {
      topic: function() {
        var filename = path.join(__dirname, './fixtures/script.txt');

        exec(mock('test ' + filename), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'runtest.php?script=logData%090%0Anavigate%09http%3A%2F%2Ffoo.com%2Flogin%0A%2F%2F%20log%20some%20data%0AlogData%091%0AsetValue%09name%3Dusername%09johndoe%0AsetValue%09name%3Dpassword%0912345%0AsubmitForm%09action%3Dhttp%3A%2F%2Ffoo.com%2Fmain%0AwaitForComplete%0A&f=json');
      }
    },

    'gets a cancel test input': {
      topic: function() {
        exec(mock('cancel 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'cancelTest.php?test=120816_V2_2');
      }
    },

    'gets page speed data input ': {
      topic: function() {
        exec(mock('pagespeed 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_pagespeed.txt');
      }
    },

    'gets HAR data input ': {
      topic: function() {
        exec(mock('har 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'export.php?test=120816_V2_2');
      }
    },

    'gets utilization data input ': {
      topic: function() {
        exec(mock('utilization 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_progress.csv');
      }
    },

    'gets request data input ': {
      topic: function() {
        exec(mock('request 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_IEWTR.txt');
      }
    },

    'gets timeline data input ': {
      topic: function() {
        exec(mock('timeline 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_timeline.json');
      }
    },

    'gets net log data input ': {
      topic: function() {
        exec(mock('netlog 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_netlog.txt');
      }
    },

    'gets console log data input ': {
      topic: function() {
        exec(mock('console 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_console_log.json');
      }
    },

    'gets a waterfall image input ': {
      topic: function() {
        exec(mock('waterfall 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'waterfall.php?test=120816_V2_2&run=1&cached=0');
      }
    },

    'gets a waterfall thumbnail input ': {
      topic: function() {
        exec(mock('waterfall 120816_V2_2 --thumbnail'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&run=1&cached=0&file=1_waterfall.png');
      }
    },

    'gets a screenshot input ': {
      topic: function() {
        exec(mock('screenshot 120816_V2_2'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.jpg');
      }
    },

    'gets a screenshot thumbnail input ': {
      topic: function() {
        exec(mock('screenshot 120816_V2_2 --thumbnail'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'thumbnail.php?test=120816_V2_2&file=1_screen.jpg&run=1&cached=0');
      }
    },

    'gets a screenshot in full resolution input ': {
      topic: function() {
        exec(mock('screenshot 120816_V2_2 --full'), this.callback);
      },
      'then returns the API url': function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        assert.equal(data.url, wptServer + 'getgzip.php?test=120816_V2_2&file=1_screen.png');
      }
    },

    'gets a help input ': {
      topic: function() {
        exec(mock('--help'), this.callback);
      },
      'then returns the help text': function(err, data) {
        if (err) throw err;
        var output = fs.readFileSync(
          path.join(__dirname, './fixtures/command-line-help.txt'), 'utf8');
        console.log(data.length, output.length);
        assert.equal(data, output);
      }
    }

  }
}).export(module);
