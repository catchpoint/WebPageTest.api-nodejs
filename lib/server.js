/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var http  = require('http'),
    path  = require('path'),
    url   = require('url'),
    os    = require('os');

var mapping = require('./mapping');

function normalizeRequest(uri) {
  var idx,
      parsed = url.parse(uri, true),
      pathname = path.join(parsed.pathname, '/');

  pathname = pathname.slice(1, pathname.length - 1);
  idx = pathname.lastIndexOf('/');
  idx = (idx < 0 ? pathname.length : idx);

  return {
    command: pathname.slice(0, idx).toLowerCase(),
    id: pathname.slice(idx + 1),
    query: parsed.query
  };
}

function output(callback, err, data, info) {
  var code = 200,
      type = 'application/json;charset=utf-8';

  if (err) {
    data = {error: err};
    code = err.code || code;
  } else if (info) {
    if (info.encoding === 'binary') {
      data = new Buffer(data, 'binary');
      type = info.type;
    } else {
      data = {type: info.type, data: data};
    }
  }

  if (!(data instanceof Buffer)) {
    try {
      data = JSON.stringify(data, null, 2);
    } catch (ex) {
      data = JSON.stringify({
        data: data.toString(),
        error: ex.message
      }, null, 2);
    }
    if (callback) {
      type = 'application/javascript;charset=utf-8';
      data = callback + '(' + data + ');';
    }
  }
  
  this.writeHead(code, {'Content-Type': type});
  this.end(data);
}

var help = {help: {}};

function route(req, res) {
  var uri = normalizeRequest(req.url),
      method = (mapping.commands[uri.command] || {}).name,
      args = [],
      callback = uri.query.callback || uri.query.cb;

  if (method) {
    // id, url or script
    if (uri.id) {
      args.push(decodeURIComponent(uri.id));
    }

    // options
    args.push(mapping.setOptions(uri.command, uri.query));

    // callback
    args.push(output.bind(res, callback));
    
    this[method].apply(this, args);
  } else {
    // help
    output.call(res, callback, null, help);
  }
}

module.exports = {
  listen: function listen(port, callback) {
    var httpServer = http.createServer(route.bind(this));

    httpServer.on('error', function listenError(err) {
        if (typeof callback === 'function') {
          callback(err);
        }
      }).on('listening', function listenError() {
        if (typeof callback === 'function') {
          callback(undefined, {
            server: httpServer,
            protocol: 'http',
            hostname: os.hostname(),
            port: port,
            url: url.format({
              protocol: 'http',
              hostname: os.hostname(),
              port: port
            })
          });
        }
      }).listen(port);

    return httpServer;
  }
};
