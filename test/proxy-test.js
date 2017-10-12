/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var assert          = require('assert'),
    http            = require('http'),
    https            = require('https'),
    url             = require('url'),
    WebPageTest     = require('../lib/webpagetest'),
    NockServer      = require('./helpers/nock-server'),
    ResponseObjects = require('./helpers/response-objects');

var wptNockServer = new NockServer('https://wpt.com'),
    wpt = new WebPageTest('https://wpt.com');

// proxy for test on 9001 port
http.createServer(function(req, res) {
  var requestUrl = url.parse(req.url);
  var body = [];

  req.on('data', function(data) {
    body.push(data);
  });
  req.on('end', function() {
    var orgreq = https.request({
      host:    req.headers.host,
      port:    requestUrl.port || 80,
      path:    requestUrl.path,
      method:  req.method,
      headers: req.headers
    },
    function (orgres) {
      res.writeHead(orgres.statusCode, orgres.headers);
      orgres.on('data', function(chunk) {
        res.write(chunk);
      });
      orgres.on('end', function() {
        res.end();
      });
    });
    if (body.length > 0) {
      orgreq.write(body.join(''));
    }
    orgreq.end();
  });
}).listen(9001);

describe('Run via proxy', function() {
  describe('An Example WebPageTest Server', function() {

    it('gets a test status request', function(done) {
      wpt.getTestStatus('120816_V2_2', {
        proxy: 'http://127.0.0.1:9001'
      }, function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, ResponseObjects.testStatus);
        done();
      });
    });
  });
});
