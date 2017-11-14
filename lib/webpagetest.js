/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var http    = require('http'),
    https   = require('https'),
    url     = require('url'),
    path    = require('path'),
    zlib    = require('zlib'),
    specs   = require('./specs'),
    helper  = require('./helper'),
    server  = require('./server'),
    mapping = require('./mapping');

var reSpace = /\s/,
    reConnectivity = /^(?:Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom)$/,
    reHTMLOutput = /<h\d[^<]*>([^<]+)<\/h\d>/; // for H3 on cancelTest.php

var paths = {
  testStatus: 'testStatus.php',
  testResults: 'jsonResult.php',
  locations: 'getLocations.php',
  testers: 'getTesters.php',
  test: 'runtest.php',
  gzip: 'getgzip.php',
  har: 'export.php',
  waterfall: 'waterfall.php',
  thumbnail: 'thumbnail.php',
  cancel: 'cancelTest.php',
  history: 'testlog.php',
  videoCreation: 'video/create.php',
  videoView: 'video/view.php',
  googleCsi: 'google/google_csi.php',
  responseBody: 'response_body.php',
  timeline: 'getTimeline.php'
};

var filenames = {
  pageSpeed: 'pagespeed.txt',
  utilization: 'progress.csv',
  request: 'IEWTR.txt',
  netLog: 'netlog.txt',
  chromeTrace: 'trace.json',
  consoleLog: 'console_log.json',
  testInfo: 'testinfo.json',
  history: 'history.csv',
  waterfall: 'waterfall.png',
  screenshot: 'screen.jpg',
  screenshotStartRender: 'screen_render.jpg',
  screenshotDocumentComplete: 'screen_doc.jpg',
  screenshotFullResolution: 'screen.png',
  cached: '_Cached'
};

// GET helper function
function get(config, pathname, proxy, agent, callback, encoding) {
  var protocol,
      options;

  if (proxy) {
    var proxyUrl = url.parse(proxy);
    var pathForProxy = config.protocol + '//';

    if (config.auth) {
      pathForProxy += config.auth + '@';
    }

    pathForProxy += config.hostname + ':' + config.port + pathname;
    protocol = (proxyUrl.protocol === 'https:' ? https : http);

    options = {
      host: proxyUrl.hostname,
      port: proxyUrl.port,
      path: pathForProxy,
      headers: {
        Host: config.hostname
      }
    };
  } else {
    protocol = (config.protocol === 'https:' ? https : http);
    options = {
      path: pathname,
      host: config.hostname,
      auth: config.auth,
      port: config.port,
      headers: {}
    };
  }

  if (encoding !== 'binary') {
    options.headers['accept-encoding'] = 'gzip,deflate';
  }
    
  if (agent) {
    options.agent = agent;
  }

  return protocol.get(options, function getResponse(res) {
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

// execute callback properly normalizing optional args
function callbackYield(callback, err, data, options) {
  if (typeof callback === 'function') {
    callback.apply(callback, [err, data].concat(options.args));
  }
}

// helper for async parser callback
function asyncParserCallback(options, err, data) {
  callbackYield(this, err, data, options);
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
    pathname: url.resolve(config.pathname, pathname),
    query: query
  });

  if (options.dryRun) {

    // dry run: return the API url (string) only
    if (typeof callback === 'function') {
      callback.apply(callback,
        [undefined, helper.dryRun(config, pathname)]
      );
    }

  } else {

    // make the real API call
    get.call(this, config, pathname, options.proxy, options.agent, function apiCallback(err, data, info) {
      if (!err) {
        try {
          if (options.parser) {
            // async parser
            if (options.parser.async) {
              return options.parser(data,
                asyncParserCallback.bind(callback, options));
            } else {
              data = options.parser(data);
            }
          } else {
            if (!data) {
              data = {};
            } else if (info.type === 'application/json') {
              data = JSON.parse(data);
            } else if (info.type === 'text/xml') {
              return helper.xmlToObj(data,
                asyncParserCallback.bind(callback, options));
            } else if (info.type === 'text/html') {
              data = {result: (reHTMLOutput.exec(data) || [])[1]};
            } else if (info.type === 'text/plain') {
              data = {result: data.toString()};
            }
          }
        } catch (ex) {
          err = ex;
        }
      }

      callbackYield(callback, err, data, options);
    }.bind(this), options.encoding);

  }

  // chaining
  return this;
}

// Set the appropriate filename to be requested
function setFilename(input, options, doNotDefault) {
  var run, cached;

  options = options || {};

  // set run and cached with or without defaults
  run = parseInt(options.run || options.r, 10) ||
    (doNotDefault ? undefined : 1);
  cached = (options.repeatView || options.cached || options.c) ?
    filenames.cached : '';
  // when falsy, check set default accordingly
  if (doNotDefault && !cached) {
    cached = ['repeatView', 'cached', 'c'].some(function(key) {
      return key in options;
    }) ? '' : undefined;
  }

  if (typeof input === 'string') {
    return run + cached + '_' + input;
  } else {
    if (run !== undefined) {
      input.run = run;
    }
    if (cached !== undefined) {
      input.cached = cached ? 1 : 0;
    }
    return input;
  }
}

// Methods

function getTestStatus(id, options, callback) {
  var query = {test: id};

  callback = callback || options;
  options = options === callback ? undefined : options;
  helper.setQuery(mapping.commands.status, options, query);

  return api.call(this, paths.testStatus, callback, query, options);
}

function getTestResults(id, options, callback) {
  var query = {test: id};

  callback = callback || typeof options === 'function' && options;
  options = options === callback ? {} : options || {};
  helper.setQuery(mapping.commands.results, options, query);

  // specs
  if (options.specs && !options.dryRun) {
    return api.call(this, paths.testResults,
      specs.bind(this, options.specs, options.reporter, callback),
      query, options
    );
  }

  return api.call(this, paths.testResults, callback, query, options);
}

function getLocations(options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  var query = helper.setQuery(mapping.commands.locations, options);

  return api.call(this, paths.locations, callback, query, options);
}

function getTesters(options, callback) {
  callback = callback || options;
  options = options === callback ? undefined : options;

  var query = helper.setQuery(mapping.commands.testers, options);

  return api.call(this, paths.testers, callback, query, options);
}

function runTest(what, options, callback) {
  var query = {};

  callback = callback || options;
  options = options === callback ? {} : options;

  // testing url or script?
  query[reSpace.test(what) ? 'script' : 'url'] = what;
  // set dummy url when scripting, needed when webdriver script
  if (query.script) {
    query.url = 'https://www.webpagetest.org';
  }
  helper.setQuery(mapping.commands.test, options, query);

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

  // synchronous tests with results
  var testId, polling, server, listen, timerout,
      resultsOptions = {};

  function resultsCallback(err, data) {
    clearTimeout(timerout);
    if (options.exitOnResults) {
      process.exit(err);
    } else {
      callback(err, data);
    }
  }

  function poll(err, data) {
    // poll again when test started but not complete
    // and not when specs are done testing
    if (!err && (!data || data && data.data &&
        data.statusCode !== 200) &&
        !(typeof err === 'number' && data === undefined)) {
      polling = setTimeout(getTestResults.bind(this, testId,
        resultsOptions, poll.bind(this)), options.pollResults);
    } else {
      resultsCallback(err, data);
    }
  }

  function testCallback(cb, err, data) {
    if (err || !(data && data.data && data.data.testId)) {
      return callback(err || data);
    }

    testId = data.data.testId;

    if (options.timeout) {
      timerout = setTimeout(timeout, options.timeout);
    }

    if (cb) {
      cb.call(this);
    }
  }

  function timeout() {
    if (server) {
      server.close();
    }
    clearTimeout(polling);
    callback({
      error: {
        code: 'TIMEOUT',
        testId: testId,
        message: 'timeout'
      }
    });
  }

  function listener() {
    query.pingback = url.format({
      protocol: 'http',
      hostname: options.waitResults.hostname,
      port: options.waitResults.port,
      pathname: '/testdone'
    });

    api.call(this, paths.test, testCallback.bind(this, null), query, options);
  }

  function wait() {
    server.listen(options.waitResults.port, listen);
    return options.waitResults;
  }

  // poll|wait results timeout
  if (options.timeout) {
    options.timeout = (parseInt(options.timeout, 10) || 0) * 1000;
  }

  // poll|wait results options
  Object.keys(mapping.options.results).forEach(function resultsOpts(key) {
    var name = mapping.options.results[key].name,
        value = options[name] || options[key];

    if (value !== undefined) {
      resultsOptions[name] = value;
    }
  });

  // poll results
  if (options.pollResults && !options.dryRun) {
    options.pollResults = parseInt(options.pollResults * 1000, 10) || 5000;

    return api.call(this, paths.test, testCallback.bind(this, poll),
      query, options);
  }

  // wait results
  if (options.waitResults && !options.dryRun) {

    options.waitResults = helper.localhost(options.waitResults,
      WebPageTest.defaultWaitResultsPort);

    listen = listener.bind(this);

    server = http.createServer(function(req, res) {
      var uri = url.parse(req.url, true);

      res.statusCode = 204;
      res.end();

      if (uri.pathname === '/testdone' && uri.query.id === testId) {
        server.close(getTestResults.bind(this, uri.query.id,
          resultsOptions, resultsCallback));
      }
    }.bind(this));

    server.on('error', function(err) {
      if (['EACCES', 'EADDRINUSE'].indexOf(err.code) > -1) {
        // remove old unused listener and bump port for next attempt
        server.removeListener('listening', listen);
        options.waitResults.port++;
        wait.call(this);
      } else {
        callback(err);
      }
    }.bind(this));

    return wait.call(this);
  }

  return api.call(this, paths.test, callback, query, options);
}

function cancelTest(id, options, callback) {
  var query = {test: id};

  callback = callback || options;
  options = options === callback ? undefined : options;

  helper.setQuery(mapping.commands.cancel, options, query);

  return api.call(this, paths.cancel, callback, query, options);
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
  var query;

  callback = callback || options;
  options = options === callback ? undefined : options;
  query = setFilename({test: id}, options, true);

  return api.call(this, paths.timeline, callback, query, options);
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

function getChromeTraceData(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || helper.netLogParser;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: setFilename(filenames.chromeTrace, options)
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

function getTestInfo(id, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || JSON.parse;

  return api.call(this, paths.gzip, callback, {
    test: id,
    file: filenames.testInfo
  }, options);
}

function getHistory(days, options, callback) {
  var query;

  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || helper.csvParser;
  query = {
    all: 'on',
    f: 'csv',
    days: days ? parseInt(days, 10) : 1
  };

  return api.call(this, paths.history, callback, query, options);
}

function getGoogleCsiData(id, options, callback) {
  var query;

  callback = callback || options;
  options = options === callback ? {} : options;
  options.parser = options.parser || helper.csvParser;
  query = setFilename({test: id}, options, true);

  return api.call(this, paths.googleCsi, callback, query, options);
}

function getResponseBody(id, options, callback) {
  var query;

  callback = callback || options;
  options = options === callback ? {} : options;
  options.args = options.args || {
    type: 'text/plain'
  };
  query = setFilename({test: id}, options);
  query.request = options.request || 1;

  return api.call(this, paths.responseBody, callback, query, options);
}

function getWaterfallImage(id, options, callback) {
  var query,
      pathname = paths.waterfall;

  callback = callback || options;
  options = options === callback ? {} : options;
  query = setFilename({test: id}, options),
  options.encoding = options.encoding || 'binary';
  options.dataURI = options.dataURI || options.uri || options.u;
  options.parser = options.parser ||
    (options.dataURI ? helper.dataURI : undefined);
  options.args = options.args || {
    type: 'image/png',
    encoding: options.dataURI ? 'utf8' : options.encoding
  };

  if (options.thumbnail || options.t) {
    pathname = paths.thumbnail;
    query.file = setFilename(filenames.waterfall, options);
  }

  helper.setQuery(mapping.commands.waterfall, options, query);

  return api.call(this, pathname, callback, query, options);
}

function getScreenshotImage(id, options, callback) {
  var pathname = paths.gzip,
      filename = filenames.screenshot,
      params = {test: id},
      type = 'jpeg';

  callback = callback || options;
  options = options === callback ? {} : options;
  options.encoding = options.encoding || 'binary';
  options.dataURI = options.dataURI || options.uri || options.u;
  options.parser = options.parser ||
    (options.dataURI ? helper.dataURI : undefined);

  if (options.startRender || options.render || options.n) {
    filename = filenames.screenshotStartRender;
  } else if (options.documentComplete || options.complete || options.p) {
    filename = filenames.screenshotDocumentComplete;
  } else if (options.fullResolution || options.full || options.f) {
    filename = filenames.screenshotFullResolution;
    type = 'png';
  }
  options.args = options.args || {
    type: 'image/' + type,
    encoding: options.dataURI ? 'utf8' : options.encoding
  };

  params.file = setFilename(filename, options);

  if (options.thumbnail || options.t) {
    pathname = paths.thumbnail;
    params = setFilename(params, options);
  }

  return api.call(this, pathname, callback, params, options);
}

function listen(local, options, callback) {
  callback = callback || options;
  options = options === callback ? {} : options;
  local = helper.localhost(local, WebPageTest.defaultListenPort);

  return server.listen.call(this, local, options, callback);
}

function getEmbedVideoPlayer(id, options, callback) {
  var params = {
    embed: 1,
    id: id
  };

  options.args = options.args || {
    type: 'text/html',
    encoding: options.dataURI ? 'utf8' : options.encoding
  };

  options.parser = function (data) {
    return data.toString();
  };

  api.call(this, paths.videoView, callback, params, options);
}

function createVideo(tests, options, callback) {
  //prefer the json format because the xml format is buggy with wpt 2.11
  var params = {
    tests: tests,
    f: 'json',
    end: options.comparisonEndPoint || 'visual'
  };

  api.call(this, paths.videoCreation, callback, params, options);
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
WebPageTest.defaultServer = 'https://www.webpagetest.org';
WebPageTest.defaultListenPort = 7791;
WebPageTest.defaultWaitResultsPort = 8000;

// Version
Object.defineProperty(WebPageTest, 'version', {
  value: require('../package.json').version
});

// Exposed methods
WebPageTest.scriptToString = helper.scriptToString;
WebPageTest.prototype = {
  constructor: WebPageTest,
  version: WebPageTest.version,
  getTestStatus: getTestStatus,
  getTestResults: getTestResults,
  getLocations: getLocations,
  getTesters: getTesters,
  runTest: runTest,
  cancelTest: cancelTest,
  getPageSpeedData: getPageSpeedData,
  getHARData: getHARData,
  getUtilizationData: getUtilizationData,
  getRequestData: getRequestData,
  getTimelineData: getTimelineData,
  getNetLogData: getNetLogData,
  getChromeTraceData: getChromeTraceData,
  getConsoleLogData: getConsoleLogData,
  getTestInfo: getTestInfo,
  getHistory: getHistory,
  getWaterfallImage: getWaterfallImage,
  getScreenshotImage: getScreenshotImage,
  getGoogleCsiData: getGoogleCsiData,
  getResponseBody: getResponseBody,
  getEmbedVideoPlayer: getEmbedVideoPlayer,
  createVideo: createVideo,
  scriptToString: WebPageTest.scriptToString,
  listen: listen,

  // short aliases
  status: getTestStatus,
  results: getTestResults,
  locations: getLocations,
  testers: getTesters,
  test: runTest,
  cancel: cancelTest,
  pagespeed: getPageSpeedData,
  har: getHARData,
  utilization: getUtilizationData,
  request: getRequestData,
  timeline: getTimelineData,
  netlog: getNetLogData,
  chrometrace: getChromeTraceData,
  console: getConsoleLogData,
  testinfo: getTestInfo,
  history: getHistory,
  googlecsi: getGoogleCsiData,
  response: getResponseBody,
  player: getEmbedVideoPlayer,
  video: createVideo,
  waterfall: getWaterfallImage,
  screenshot: getScreenshotImage
};

module.exports = WebPageTest;
