/**
 * Copyright (c) 2012, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var http   = require('http'),
    url    = require('url'),
    path   = require('path'),
    helper = require('./helper');

var reSpace = /\s/;

var paths = {
  base: '/',
  testStatus: 'testStatus.php',
  testResults: 'xmlResult.php',
  locations: 'getLocations.php',
  test: 'runtest.php',
  gzip: 'getgzip.php',
  har: 'export.php',
  waterfall: 'waterfall.php',
  thumbnail: 'thumbnail.php'
};

var filenames = {
  pageSpeed: 'pagespeed.txt',
  utilization: 'progress.csv',
  request: 'IEWTR.txt',
  timeline: 'timeline.json',
  netLog: 'netlog.txt',
  waterfall: 'waterfall.png',
  screenshot: 'screen.jpg',
  screenshotStartRender: 'screen_render.jpg',
  screenshotDocumentComplete: 'screen_doc.jpg',
  screenshotFullResolution: 'screen.png',
  cached: '_Cached'
};

var testParams = {
  label: 'label',
  'location': 'location',
  runs: 'runs',
  firstViewOnly: {name: 'fvonly', bool: true},
  domElement: 'domelement',
  'private': {name: 'private', bool: true},
  connections: 'connections',
  stopAtDocumentComplete: {name: 'web10', bool: true},
  sensitive: {name: 'sensitive', bool: true},
  block: 'block',
  login: 'login',
  authenticationType: 'authType',
  video: {name: 'video', bool: true},
  notifyEmail: 'notify',
  pingback: 'pingback',
  bandwidthDown: 'bwDown',
  bandwidthUp: 'bwUp',
  latency: 'latency',
  packetLossRate: 'plr',
  tcpDump: {name: 'tcpdump', bool: true},
  disableOptimization: {name: 'noopt', bool: true},
  disableScreenshot: {name: 'noimages', bool: true},
  disableHTTPHeaders: {name: 'noheaders', bool: true},
  fullResolutionScreenshot: {name: 'pngss', bool: true},
  jpegCompressionLevel: 'iq',
  timeline: {name: 'timeline', bool: true},
  netLog: {name: 'netlog', bool: true}
};

// GET helper function
function get(pathname, callback, encoding) {
  var options = {
    path: pathname,
    host: this.config.host,
    port: this.config.port
  };
  http.get(options, function getResponse(res) {
    var data = '';

    if (res.statusCode !== 200) {
      callback(new Error('status code: ' + res.statusCode));
    } else {
      res.setEncoding(encoding || 'utf-8');

      res.on('data', function onData(chunk) {
        data += chunk;
      });

      res.on('end', function onEnd() {
        var type = (res.headers['content-type'] || '').split(';')[0];

        callback(undefined, data, type);
      });
    }
  }).on('error', function onError(err) {
    callback(err);
  });
}

// Build the RESTful API url call only
function dryRun(pathname) {
  return {
    url: url.format({
      protocol: 'http',
      hostname: this.config.host,
      port: (this.config.port !== 80 ? this.config.port : undefined),
      pathname: pathname
    })
  };
}

// WPT API call wrapper
function api(pathname, callback, query, options) {
  options = (typeof options !== 'string' && options) || {};
  pathname = url.format({
    pathname: path.join(paths.base, pathname),
    query: query
  });

  if (options.dryRun) {

    // dry run: return the API url (string) only
    callback.apply(this,
      [undefined, dryRun.call(this, pathname)].concat(options.args)
    );

  } else {

    // make the real API call
    get.call(this, pathname, function apiCallback(err, data, type) {
      if (!err) {
        try {
          if (options.parser) {
            data = options.parser(data);
          } else {
            if (!data) {
              data = {};
            } else if (type === 'application/json') {
              data = JSON.parse(data);
            } else if (type === 'text/xml') {
              data = helper.xmlToObj(data);
            }
          }
        } catch (ex) {
          err = ex;
        }
      }

      callback.apply(this, [err, data].concat(options.args));
    }, options.encoding);

  }

  // chaining
  return this;
}

// Set the appropriate filename to be requested
function setFilename(input, options) {
  var run, cached;

  options = options || {};

  run = parseInt(options.run, 10) || 1;
  cached = options.repeatView ? filenames.cached : '';

  if (typeof input === 'string') {
    return run + cached + '_' + input;
  } else {
    input.run = run;
    input.cached = cached ? 1 : 0;
    return input;
  }
}

// Methods

function getTestStatus(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.testStatus, callback, {test: id}, options);
}

function getTestResults(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.testResults, callback, {test: id}, options);
}

function getLocations(options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.locations, callback, undefined, options);
}

function runTest(what, options, callback) {
  var query = {};

  callback = callback || options;
  options = options === callback ? {} : options;

  // Testing url or script?
  query[reSpace.test(what) ? 'script' : 'url'] = what;

  // only valid parameters in query
  Object.keys(testParams).forEach(function testParamsEach(key) {
    var param = testParams[key],
        name = typeof param === 'object' ? param.name : param,
        value = options[key];

    if (value !== undefined) {
      query[name] = param.bool ? (value ? 1 : 0) : value;
      delete options[key];
    }
  });

  // json output format
  query.f = 'json';

  // API key
  if (this.config.key) {
    query.k = this.config.key;
  }

  return api.call(this, paths.test, callback, query, options);
}

function getPageSpeedData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.pageSpeed, options)
  }, options);
}

function getHARData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.har, callback, {test: id}, options);
}

function getUtilizationData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || helper.csvToObj;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.utilization, options)
  }, options);
}

function getRequestData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;

  options.parser = options.parser || helper.tsvToObj.bind(null, [
    '', '', '', 'ip_addr', 'method', 'host', 'url', 'responseCode', 'load_ms',
    'ttfb_ms', 'load_start', 'bytesOut', 'bytesIn', 'objectSize', '', '',
    'expires', 'cacheControl', 'contentType', 'contentEncoding', 'type',
    'socket', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'score_cache', 'score_cdn', 'score_gzip', 'score_cookies',
    'score_keep-alive', '', 'score_minify', 'score_combine', 'score_compress',
    'score_etags', '', 'is_secure', 'dns_ms', 'connect_ms', 'ssl_ms',
    'gzip_total', 'gzip_save', 'minify_total', 'minify_save', 'image_total',
    'image_save', 'cache_time', '', '', '', 'cdn_provider', 'dns_start',
    'dns_end', 'connect_start', 'connect_end', 'ssl_start', 'ssl_end',
    'initiator', 'initiator_line', 'initiator_column']);

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.request, options)
  }, options);
}

function getTimelineData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.timeline, options)
  }, options);
}

function getNetLogData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || helper.netLogParser;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.netLog, options)
  }, options);
}

function getWaterfallImage(id, options, callback) {
  var params,
      pathname = paths.waterfall;

  callback = callback || options;
  options = options === callback ? {} : options;
  params = setFilename({test: id}, options),
  options.encoding = options.encoding || 'binary';
  options.parser = options.parser ||
    (options.dataURI ? helper.dataURI : undefined);
  options.args = options.args || 'image/png';

  if (options.thumbnail) {
    pathname = paths.thumbnail;
    params.file = setFilename(filenames.waterfall, options);
  }

  return api.call(this, pathname, callback, params, options);
}

function getScreenshotImage(id, options, callback) {
  var pathname = paths.gzip,
      filename = filenames.screenshot,
      params = {test: id},
      type = 'jpeg';

  callback = callback || options;
  options = options === callback ? {} : options;
  options.encoding = options.encoding || 'binary';
  options.parser = options.parser ||
    (options.dataURI ? helper.dataURI : undefined);

  if (options.startRender) {
    filename = filenames.screenshotStartRender;
  } else if (options.documentComplete) {
    filename = filenames.screenshotDocumentComplete;
  } else if (options.fullResolution) {
    filename = filenames.screenshotFullResolution;
    type = 'png';
  }
  options.args = options.args || 'image/' + type;

  params.file = setFilename(filename, options);

  if (options.thumbnail) {
    pathname = paths.thumbnail;
    params = setFilename(params, options);
  }

  return api.call(this, pathname, callback, params, options);
}

// WPT constructor
function WebPageTest(host, key, port) {
  if (!(this instanceof WebPageTest)) {
    return new WebPageTest(host, key, port);
  }
  this.config = {
    host: host || 'localhost',
    key: key,
    port: port || 80
  };
}

// Config override
WebPageTest.config = function wptConfig(config) {
  config = config || {};
  Object.keys(config.paths || {}).forEach(function pathsEach(path) {
    paths[path] = config.paths[path];
  });
  Object.keys(config.filenames || {}).forEach(function filesEach(filename) {
    filenames[filename] = config.filenames[filename];
  });
  Object.keys(config.testParams || {}).forEach(function testParamsEach(param) {
    testParams[param] = config.testParams[param];
  });
};

// Exposed methods
WebPageTest.prototype = {
  constructor: WebPageTest,
  getTestStatus: getTestStatus,
  getTestResults: getTestResults,
  getLocations: getLocations,
  runTest: runTest,
  getPageSpeedData: getPageSpeedData,
  getHARData: getHARData,
  getUtilizationData: getUtilizationData,
  getRequestData: getRequestData,
  getTimelineData: getTimelineData,
  getNetLogData: getNetLogData,
  getWaterfallImage: getWaterfallImage,
  getScreenshotImage: getScreenshotImage,
  scriptToString: helper.scriptToString
};

module.exports = WebPageTest;
