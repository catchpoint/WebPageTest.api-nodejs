/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert      = require('assert'),
    os          = require('os'),
    WebPageTest = require('../lib/webpagetest'),
    helper      = require('../lib/helper'),
    packageJson = require('../package.json');

var wptServer = 'https://www.example.com:1234/foo/bar/';

describe('Edge Cases of', function() {
  describe('An HTTPS WebPageTest Server with API key', function() {
    var wpt = new WebPageTest(wptServer, '1234567890');

    it('gets a simple test request with another HTTP server and API key then returns API url', function(done) {
      wpt.runTest('http://foobar.com', {
        server: 'http://wpt.com',
        key: '0987654321',
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, 'http://wpt.com/runtest.php?url=http%3A%2F%2Ffoobar.com&k=0987654321&f=json');
        done();
      });
    });
  });

  describe('An HTTP WebPageTest Server with API key', function() {
    var wpt = new WebPageTest(wptServer, '1234567890');

    it('gets a simple test request with another HTTPS server and API key then returns API url', function(done) {
      wpt.runTest('http://foobar.com', {
        server: 'https://wpt.com:4321/baz/',
        key: '0987654321',
        dryRun: true
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, 'https://wpt.com:4321/baz/runtest.php?url=http%3A%2F%2Ffoobar.com&k=0987654321&f=json');
        done();
      });
    });
  });

  describe('An Example WebPageTest Server', function() {
    var wpt = new WebPageTest(wptServer);

    it('gets a test with blocking urls and spof array request then returns API url', function(done) {
      wpt.runTest('http://foobar.com', {
        dryRun: true,
        block: ['foo.com', 'bar.com'],
        spof: ['baz.com', 'qux.com']
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&block=foo.com%20bar.com&spof=baz.com%20qux.com&f=json');
        done();
      });
    });

    it('gets a test with blocking urls and spof strings request then returns API url', function(done) {
      wpt.runTest('http://foobar.com', {
        dryRun: true,
        block: 'foo.com bar.com',
        spof: ['baz.com qux.com']
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&block=foo.com%20bar.com&spof=baz.com%20qux.com&f=json');
        done();
      });
    });

    it('gets a test with dial up connectivity and location then returns API url with connectivity appended to location', function(done) {
      wpt.runTest('http://foobar.com', {
        dryRun: true,
        connectivity: 'Dial',
        location: 'somelocation'
      }, function (err, data) {
        if (err) return done(err);
        assert.equal(data.url, wptServer + 'runtest.php?url=http%3A%2F%2Ffoobar.com&location=somelocation.Dial&connectivity=Dial&f=json');
        done();
      });
    });

  });

  describe('WebPageTest localhost helper', function() {

    it('when getting a valid hostname with port returns a localhost object with hostname and port', function() {
      var localhost = helper.localhost('localhost:8000', 3000);
      assert.equal(localhost.hostname, 'localhost');
      assert.equal(localhost.port, 8000);
    });

    it('when getting a valid hostname only returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost('localhost', 3000);
      assert.equal(localhost.hostname, 'localhost');
      assert.equal(localhost.port, 3000);
    });

    it('when getting a valid port only returns a localhost object with default hostname', function() {
      var localhost = helper.localhost('8000', 3000);
      assert.equal(localhost.hostname, os.hostname());
      assert.equal(localhost.port, 8000);
    });

    it('when getting an ip only returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost('127.0.0.1', 3000);
      assert.equal(localhost.hostname, '127.0.0.1');
      assert.equal(localhost.port, 3000);
    });

    it('when getting a valid hostname with invalid port returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost('localhost:foo', 3000);
      assert.equal(localhost.hostname, 'localhost');
      assert.equal(localhost.port, 3000);
    });

    it('when getting an invalid hostname with valid port returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost('123:8000', 3000);
      assert.equal(localhost.hostname, os.hostname());
      assert.equal(localhost.port, 8000);
    });

    it('when getting a valid hostname with no port returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost('localhost:', 3000);
      assert.equal(localhost.hostname, 'localhost');
      assert.equal(localhost.port, 3000);
    });

    it('when getting no hostname with valid port returns a localhost object with hostname and default port', function() {
      var localhost = helper.localhost(':8000', 3000);
      assert.equal(localhost.hostname, os.hostname());
      assert.equal(localhost.port, 8000);
    });

  });

  describe('WebPageTest normalizeServer helper', function() {

    it('when getting a valid standard server uri returns server info object', function() {
      var server = helper.normalizeServer('example.com');
      assert.deepEqual(server, {
        auth: null,
        protocol: 'http:',
        hostname: 'example.com',
        pathname: '/',
        port: 80
      });
    });

    it('when getting a valid full server uri returns server info object', function() {
      var server = helper.normalizeServer('http://foo:bar@example.com:8000/foo');
      assert.deepEqual(server, {
        auth: 'foo:bar',
        protocol: 'http:',
        hostname: 'example.com',
        pathname: '/foo',
        port: 8000
      });
    });

    it('when getting a https server uri returns server info object', function() {
      var server = helper.normalizeServer('https://example.com');
      assert.deepEqual(server, {
        auth: null,
        protocol: 'https:',
        hostname: 'example.com',
        pathname: '/',
        port: 443
      });
    });

  });
});
