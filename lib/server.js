/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var http = require('http'),
    path = require('path'),
    url  = require('url');

// parameters mapping: req parameters to wpt node module options
var paramsMap = {
  common: {
    server: 'server',
    dryrun: 'dryRun'
  },
  test: {
    key: 'key',
    label: 'label',
    'location': 'location',
    runs: 'runs',
    first: 'firstViewOnly',
    connectivity: 'connectivity',
    dom: 'domElement',
    'private': 'private',
    connections: 'connections',
    onload: 'stopAtDocumentComplete',
    sensitive: 'sensitive',
    block: 'block',
    login: 'login',
    authtype: 'authenticationType',
    video: 'video',
    request: 'requestId',
    notify: 'notifyEmail',
    pingback: 'pingback',
    bwdown: 'bandwidthDown',
    bwup: 'bandwidthUp',
    latency: 'latency',
    plr: 'packetLossRate',
    tcpdump: 'tcpDump',
    noopt: 'disableOptimization',
    noimages: 'disableScreenshot',
    noheaders: 'disableHTTPHeaders',
    full: 'fullResolutionScreenshot',
    jpeg: 'jpegCompressionLevel',
    noscript: 'disableJavaScript',
    ignoressl: 'ignoreSSL',
    standards: 'disableCompatibilityView',
    bodies: 'saveResponseBodies',
    keepua: 'keepOriginalUserAgent',
    duration: 'minimumDuration',
    blockads: 'blockAds',
    aft: 'aftRenderingTime',
    timeline: 'timeline',
    netlog: 'netLog',
    spof: 'spof'
  },
  run: {
    run: 'run',
    cached: 'repeatView'
  },
  image: {
    thumbnail: 'thumbnail',
    uri: 'dataURI',
    full: 'fullResolution',
    render: 'startRender',
    complete: 'documentComplete'
  }
};

var shortParamsMap = {
  common: {
    s: 'server',
    d: 'dryrun'
  },
  test: {
    k: 'key',
    L: 'label',
    l: 'location',
    r: 'runs',
    f: 'first',
    y: 'connectivity',
    m: 'dom',
    p: 'private',
    c: 'connections',
    v: 'onload',
    t: 'sensitive',
    b: 'block',
    g: 'login',
    a: 'authtype',
    i: 'video',
    e: 'request',
    n: 'notify',
    B: 'pingback',
    D: 'bwdown',
    U: 'bwup',
    Y: 'latency',
    P: 'plr',
    u: 'tcpdump',
    z: 'noopt',
    I: 'noimages',
    H: 'noheaders',
    F: 'full',
    j: 'jpeg',
    S: 'noscript',
    R: 'ignoressl',
    T: 'standards',
    O: 'bodies',
    K: 'keepua',
    N: 'duration',
    A: 'blockads',
    E: 'aft',
    M: 'timeline',
    G: 'netlog',
    Z: 'spof'
  },
  run: {
    r: 'run',
    c: 'cached'
  },
  image: {
    t: 'thumbnail',
    u: 'uri',
    f: 'full',
    r: 'render',
    c: 'complete'
  }
};

var commands = {
  version: function version() {return {version: this.version};},
  help: help,
  'status': {method: 'getTestStatus'},
  results: {method: 'getTestResults'},
  locations: {method: 'getLocations'},
  test: {method: 'runTest', type: 'test'},
  har: {method: 'getHARData', type: 'run'},
  pagespeed: {method: 'getPageSpeedData', type: 'run'},
  utilization: {method: 'getUtilizationData', type: 'run'},
  request: {method: 'getRequestData', type: 'run'},
  timeline: {method: 'getTimelineData', type: 'run'},
  netlog: {method: 'getNetLogData', type: 'run'},
  waterfall: {method: 'getWaterfallImage', type: ['run', 'image']},
  screenshot: {method: 'getScreenshotImage', type: ['run', 'image']}
};

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
  var type = 'application/json';

  if (err) {
    data = {error: err};
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
      type = 'application/javascript';
      data = callback + '(' + data + ');';
    }
  }
  
  this.writeHead(200, {'Content-Type': type});
  this.end(data);
}

function help(command) {
  return {help: {}};
}

function setOptions(types, query) {
  var options = {};

  Object.keys(query).forEach(function eachQueryKey(key) {
    types.some(function someType(type) {
      var param = paramsMap[type][key] ||
        paramsMap[type][shortParamsMap[type][key]];

      if (param) {
        options[param] = query[key];
        return true;
      }
    });
  });

  return options;
}

function route(req, res) {
  var uri = normalizeRequest(req.url),
      command = commands[uri.command],
      types = ['common'],
      args = [],
      callback = uri.query.callback || uri.query.cb;

  if (command) {
    if (command.method) {
      // id, url or script
      if (uri.id) {
        args.push(uri.id);
      }

      // options
      if (command.type) {
        types = types.concat(command.type);
      }
      args.push(setOptions(types, uri.query));

      // callback
      args.push(output.bind(res, callback));
      
      this[command.method].apply(this, args);
    } else {
      // help or version
      output.call(res, callback, null, command.call(this, uri.id));
    }
  } else {
    output.call(res, callback, null, uri);
  }
}

module.exports = {
  listen: function listen(port) {
    var wpt = this;

    http.createServer(route.bind(wpt)).listen(port);
  }
};
