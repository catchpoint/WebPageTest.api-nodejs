/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var https   = require('https'),
    http    = require('http'),
    path    = require('path'),
    url     = require('url'),
    fs      = require('fs'),
    mapping = require('./mapping');

var help = {};

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

function buildHelp(defaultServer) {
  Object.keys(mapping.commands).forEach(function eachCommand(key) {
    var name,
        options = {},
        opts = [mapping.options.common],
        method = mapping.commands[key];

    if (key === 'listen') {
      return;
    }

    name = [
      key,
      method.param ? [
        '/',
        method.optional ? '[' : '<',
        method.param,
        method.optional ? ']' : '>'
      ].join('') : '',
      method.options ? '?[options]' : ''
    ].join('');

    if (method.options) {
      opts = opts.concat(method.options);
    }
    opts.forEach(function eachOptions(option) {
      var nokey = method.nokey && method.nokey.indexOf(option) > -1;

      Object.keys(option).forEach(function eachOption(optKey) {
        var opt = option[optKey];

        // ignore shorthands
        if (optKey === opt.key) {
          return;
        }

        options[[
          opt.key && !nokey ? opt.key + ', ' : '',
          optKey
        ].join('')] = optKey === 'server' ?
          opt.info.replace('%s', defaultServer) : opt.info;
      });
    });

    help[name] = {
      description: method.info,
      options: options
    };
  });

  help = {help: help};
}

function route(req, res) {
  var uri = normalizeRequest(req.url),
      method = (mapping.commands[uri.command] || {}).name,
      args = [],
      callback = uri.query.callback || uri.query.cb;

  if (method && method !== 'listen') {
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
  listen: function listen(local, options, callback) {
    var server;

    if (fs.existsSync(options.key) && fs.existsSync(options.cert)) {
      server = https.createServer({
        key: fs.readFileSync(path.resolve(process.cwd(), options.key)),
        cert: fs.readFileSync(path.resolve(process.cwd(), options.cert))
      }, route.bind(this));
    } else {
      server = http.createServer(route.bind(this));
    }

    server.on('error', function listenError(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    }).on('listening', function listenError() {
      if (typeof callback === 'function') {
        callback(undefined, {
          server: server,
          protocol: server instanceof https.Server ? 'https' : 'http',
          hostname: local.hostname,
          port: local.port,
          url: url.format({
            protocol: server instanceof https.Server ? 'https' : 'http',
            hostname: local.hostname,
            port: local.port
          })
        });
      }
    }).listen(local.port);

    buildHelp(url.format(this.config.hostname));

    return server;
  }
};
