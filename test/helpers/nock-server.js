/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var path = require('path'),
    nock = require('nock');

var PATH_RESPONSES = path.join(__dirname, '../fixtures/responses');

var reqResMap = {
  '/testStatus.php?test=120816_V2_2': 'testStatus.json'
};

var typeMap = {
  'json': 'application/json',
  'xml': 'text/xml'
};


function WebPageTestMockServer(host) {
  var server;

  if (!(this instanceof WebPageTestMockServer)) {
    return new WebPageTestMockServer(host);
  }

  server = nock(host || 'http://www.webpagetest.org');

  // request/response mapping
  Object.keys(reqResMap).forEach(function (source) {
    var pathname = path.join(PATH_RESPONSES, reqResMap[source]),
        ext = (path.extname(pathname) || '').slice(1),
        type = typeMap[ext];

    server
      .get(source)
      .replyWithFile(200, pathname, {'Content-Type': type});
  });
}

module.exports = WebPageTestMockServer;
