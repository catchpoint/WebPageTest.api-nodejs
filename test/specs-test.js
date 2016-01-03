/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert = require('assert'),
    path   = require('path'),
    http   = require('http');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

describe('Example WebPageTest for Specs', function() {
  describe('Hits a Nock Server', function() {

    var wptNockServer, wpt,
        count = 10;

    beforeEach(function() {
      var server = 'http://foobar' + count + '.com';
      wptNockServer = new NockServer(server);
      wpt = new WebPageTest(server);
      count++;
    });

    it('gets a sync test with results with perf test specs request then waits for test results object', function(done) {
      var server = wpt.runTest('http://twitter.com/marcelduran', {
        firstViewOnly: true,
        runs: 3,
        waitResults: '127.0.0.1:8000',
        medianMetric: 'TTFB',
        specs: '{"defaults":{"suiteName":"WPT test of test (not really an error)"},"median":{"firstView":{"render":300,"TTFB":100,"loadTime":4000}}}',
        reporter: 'min'
      }, function(err) {
        assert.equal(err, 2);
        done();
      });
      setTimeout(function() {
        http.get('http://' + server.hostname + ':' + server.port +
          '/testdone?id=141106_TM_ZFM');
      }, 100);
    });

    it('gets a test results with perf test specs request then test results object', function(done) {
      var server = wpt.getTestResults('120816_V2_2', {
        specs: path.join(__dirname, './fixtures/specs.json'),
        reporter: 'spec'
      }, function(err) {
        assert.equal(err, 1);
        done();
      });
    });

  });
});
