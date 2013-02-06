/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var http    = require('http'),
    https   = require('https'),
    url     = require('url'),
    path    = require('path'),
    zlib    = require('zlib'),
    helper  = require('./helper'),
    server  = require('./server'),
    mapping = require('./mapping');

var reSpace = /\s/,
    reConnectivity = /^(?:DSL|FIOS|Dial|custom)$/,
    reHTMLOtput = /<h\d[^<]*>([^<]+)<\/h\d>/; // for H3 on cancelTest.php

var paths = {
  testStatus: 'testStatus.php',
  testResults: 'xmlResult.php',
  locations: 'getLocations.php',
  test: 'runtest.php',
  gzip: 'getgzip.php',
  har: 'export.php',
  waterfall: 'waterfall.php',
  thumbnail: 'thumbnail.php',
  cancel: 'cancelTest.php'
};

var filenames = {
  pageSpeed: 'pagespeed.txt',
  utilization: 'progress.csv',
  request: 'IEWTR.txt',
  timeline: 'timeline.json',
  netLog: 'netlog.txt',
  consoleLog: 'console_log.json',
  waterfall: 'waterfall.png',
  screenshot: 'screen.jpg',
  screenshotStartRender: 'screen_render.jpg',
  screenshotDocumentComplete: 'screen_doc.jpg',
  screenshotFullResolution: 'screen.png',
  cached: '_Cached'
};

// GET helper function
function get(config, pathname, callback, encoding) {
  var protocol = (config.protocol === 'https:' ? https : http),
      options = {
        path: pathname,
        host: config.hostname,
        port: config.port
      };

  if (encoding !== 'binary') {
    options.headers = {'accept-encoding': 'gzip,deflate'};
  }

  protocol.get(options, function getResponse(res) {
    var data, length,
        statusCode = res.statusCode;

    if (statusCode !== 200) {
      callback(
        new helper.WPTAPIError(statusCode, http.STATUS_CODES[statusCode])
      );
    } else {
      data = [];
      length = 0;

      encoding = res.headers['content-encoding'] || encoding || 'uft8';

      res.on('data', function onData(chunk) {
        data.push(chunk);
        length += chunk.length;
      });

      res.on('end', function onEnd() {
        var i, len, pos,
            buffer = new Buffer(length),
            type = (res.headers['content-type'] || '').split(';')[0];

        for (i = 0, len = data.length, pos = 0; i < len; i += 1) {
          data[i].copy(buffer, pos);
          pos += data[i].length;
        }

        if (encoding === 'gzip' || encoding === 'deflate') {
          // compressed response (gzip,deflate)
          zlib.unzip(buffer, function unzip(err, buffer) {
            if (err) {
              callback(err);
            } else {
              callback(undefined, buffer.toString(), {
                type: type,
                encoding: encoding
              });
            }
          });
        } else {
          // uncompressed response
          callback(undefined, buffer, {
            type: type,
            encoding: encoding
          });
        }
      });
    }
  }).on('error', function onError(err) {
    callback(err);
  });
}

// WPT API call wrapper
function api(pathname, callback, query, options) {
  var config;

  options = options || {};

  // check server override
  if (options.server) {
    config = helper.normalizeServer(options.server);
  } else {
    config = this.config;
  }

  pathname = url.format({
    pathname: path.join(config.pathname, pathname),
    query: query
  });

  if (options.dryRun) {

    // dry run: return the API url (string) only
    if (typeof callback === 'function') {
      callback.apply(this,
        [undefined, helper.dryRun(config, pathname)]
      );
    }

  } else {

    // make the real API call
    get.call(this, config, pathname, function apiCallback(err, data, info) {
      if (!err) {
        try {
          if (options.parser) {
            data = options.parser(data);
          } else {
            if (!data) {
              data = {};
            } else if (info.type === 'application/json') {
              data = JSON.parse(data);
            } else if (info.type === 'text/xml') {
              data = helper.xmlToObj(data);
            } else if (info.type === 'text/html') {
              data = {result: (reHTMLOtput.exec(data) || [])[1]};
            }
          }
        } catch (ex) {
          err = ex;
        }
      }

      if (typeof callback === 'function') {
        callback.apply(this, [err, data].concat(options.args));
      }
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
  var query = {test: id};

  callback = callback || options;
  options = options === callback ? {} : options;

  if (options.requestId) {
    query.r = options.requestId;
  }

  return api.call(this, paths.testResults, callback, query, options);
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
  Object.keys(mapping.options.test).forEach(function testParamsEach(key) {
    var param = mapping.options.test[key],
        name = param.name,
        value = options[name];

    if (value !== undefined) {
      if (param.array) {
        value = [].concat(value).join(' ');
      }
      query[param.api] = param.bool ? (value ? 1 : 0) : value;
    }
  });

  // connectivity
  if (reConnectivity.test(options.connectivity) && query.location) {
    query.location += ('.' + options.connectivity);
  }

  // json output format
  query.f = 'json';

  // API key
  if (!query.k && this.config.key) {
    query.k = this.config.key;
  }

  return api.call(this, paths.test, callback, query, options);
}

function cancelTest(id, options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  return api.call(this, paths.cancel, callback, {test: id}, options);
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

  return api.call(this, paths.gzip, callback, {
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

function getConsoleLogData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || JSON.parse;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.consoleLog, options)
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
  options.args = options.args || {
    type: 'image/png',
    encoding: options.dataURI ? 'utf8' : options.encoding
  };

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
  options.args = options.args || {
    type: 'image/' + type,
    encoding: options.dataURI ? 'utf8' : options.encoding
  };

  params.file = setFilename(filename, options);

  if (options.thumbnail) {
    pathname = paths.thumbnail;
    params = setFilename(params, options);
  }

  return api.call(this, pathname, callback, params, options);
}

// WPT constructor
function WebPageTest(server, key) {
  if (!(this instanceof WebPageTest)) {
    return new WebPageTest(server, key);
  }

  this.config = helper.normalizeServer(server || WebPageTest.defaultServer);
  this.config.key = key;
}

// Allow global config override
WebPageTest.paths = paths;
WebPageTest.filenames = filenames;
WebPageTest.defaultServer = 'http://www.webpagetest.org';
WebPageTest.defaultListenPort = 7791;

// Version
Object.defineProperty(WebPageTest, 'version', {value: '0.0.1'});

// Exposed methods
WebPageTest.scriptToString = helper.scriptToString;
WebPageTest.prototype = {
  constructor: WebPageTest,
  version: WebPageTest.version,
  getTestStatus: getTestStatus,
  getTestResults: getTestResults,
  getLocations: getLocations,
  runTest: runTest,
  cancelTest: cancelTest,
  getPageSpeedData: getPageSpeedData,
  getHARData: getHARData,
  getUtilizationData: getUtilizationData,
  getRequestData: getRequestData,
  getTimelineData: getTimelineData,
  getNetLogData: getNetLogData,
  getConsoleLogData: getConsoleLogData,
  getWaterfallImage: getWaterfallImage,
  getScreenshotImage: getScreenshotImage,
  scriptToString: WebPageTest.scriptToString,
  listen: function listen(port, callback) {
    return server.listen.call(this,
      port || WebPageTest.defaultListenPort, callback);
  }
};

module.exports = WebPageTest;
