/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var assert = require('assert'),
    http   = require('http');

var WebPageTest = require('../lib/webpagetest'),
    NockServer = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

describe('Example WebPageTest', function() {
  describe('Hits a Nock Server', function() {

    var wptNockServer, wpt,
        count = 0;

    beforeEach(function() {
      var server = 'http://foobar' + count + '.com';
      wptNockServer = new NockServer(server);
      wpt = new WebPageTest(server);
      count++;
    });

    it('gets a sync test with results request then polls test results object', function(done) {
      wpt.runTest('http://twitter.com/marcelduran', {
        pollResults: 1
      }, function(err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResults);
        done();
      });
    });

    it('gets a sync test with results request then waits for test results object', function(done) {
      var server = wpt.runTest('http://twitter.com/marcelduran', {
        waitResults: '127.0.0.1:8000'
      }, function(err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testResults);
        done();
      });
      setTimeout(function() {
        http.get('http://' + server.hostname + ':' + server.port +
          '/testdone?id=120816_V2_2');
      }, 500);
    });

  });
});
