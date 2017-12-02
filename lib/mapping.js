/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var reBool = /^0|false|no|off$/i;

var options = {
  common: {
    'server': {
      name: 'server',
      key: 's',
      param: 'server',
      info: 'the WPT server URL [%s]'
    },
    'dryrun': {
      name: 'dryRun',
      key: 'd',
      bool: true,
      info: 'just return the RESTful API URL'
    }
  },
  test: {
    'location': {
      name: 'location',
      key: 'l',
      api: 'location',
      param: 'location',
      info: 'location to test from'
    },

    // Test Setting tab
    'connectivity': {
      name: 'connectivity',
      key: 'y',
      api: 'connectivity',
      param: 'profile',
      info: 'connectivity profile (Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom) [Cable]'
    },
    'runs': {
      name: 'runs',
      key: 'r',
      api: 'runs',
      param: 'number',
      info: 'number of test runs [1]'
    },
    'first': {
      name: 'firstViewOnly',
      key: 'f',
      api: 'fvonly',
      bool: true,
      info: 'skip the Repeat View test'
    },
    'video': {
      name: 'video',
      key: 'v',
      api: 'video',
      bool: true,
      info: 'capture video'
    },
    'private': {
      name: 'private',
      key: 'p',
      api: 'private',
      bool: true,
      info: 'keep the test hidden from the test log'
    },
    'label': {
      name: 'label',
      key: 'L',
      api: 'label',
      param: 'label',
      info: 'label for the test'
    },

    // Advanced tab
    'onload': {
      name: 'stopAtDocumentComplete',
      key: 'i',
      api: 'web10',
      bool: true,
      info: 'stop test at document complete. typically, tests run until all activity stops'
    },
    'noscript': {
      name: 'disableJavaScript',
      key: 'S',
      api: 'noscript',
      bool: true,
      info: 'disable JavaScript (IE, Chrome, Firefox)'
    },
    'clearcerts': {
      name: 'clearCerts',
      key: 'C',
      api: 'clearcerts',
      bool: true,
      info: 'clear SSL certificate caches'
    },
    'ignoressl': {
      name: 'ignoreSSL',
      key: 'R',
      api: 'ignoreSSL',
      bool: true,
      info: 'ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc'
    },
    'standards': {
      name: 'disableCompatibilityView',
      key: 'T',
      api: 'standards',
      bool: true,
      info: 'forces all pages to load in standards mode (IE only)'
    },
    'tcpdump': {
      name: 'tcpDump',
      key: 'u',
      api: 'tcpdump',
      bool: true,
      info: 'capture network packet trace (tcpdump)'
    },
    'bodies': {
      name: 'saveResponseBodies',
      key: 'O',
      api: 'bodies',
      bool: true,
      info: 'save response bodies for text resources'
    },
    'keepua': {
      name: 'keepOriginalUserAgent',
      key: 'K',
      api: 'keepua',
      bool: true,
      info: 'do not add PTST to the original browser User Agent string'
    },
    'dom': {
      name: 'domElement',
      key: 'm',
      api: 'domelement',
      param: 'element',
      info: 'DOM element to record for sub-measurement'
    },
    'duration': {
      name: 'minimumDuration',
      key: 'N',
      api: 'time',
      param: 'seconds',
      info: 'minimum test duration in seconds'
    },
    'tester': {
      name: 'tester',
      key: 'E',
      api: 'tester',
      param: 'name',
      info: 'run the test on a specific PC (name must match exactly or the test will not run)'
    },

    // Chrome tab
    'mobile': {
      name: 'emulateMobile',
      key: 'W',
      api: 'mobile',
      bool: true,
      info: '(experimental) emulate mobile browser: Chrome mobile user agent, 640x960 screen, 2x scaling and fixed viewport (Chrome only)'
    },
    'device': {
      name: 'device',
      api: 'mobileDevice',
      param: 'string',
      info: 'device name from mobile_devices.ini to use for mobile emulation (only when mobile=1 is specified to enable emulation and only for Chrome)'
    },
    'timeline': {
      name: 'timeline',
      key: 'M',
      api: 'timeline',
      bool: true,
      info: 'capture Developer Tools Timeline (Chrome only)'
    },
    'callstack': {
      name: 'timelineCallStack',
      key: 'J',
      api: 'timelineStack',
      bool: true,
      info: 'set between 1-5 to include the JS call stack. must be used in conjunction with timeline (increases overhead) (Chrome only)',
      valid: /[1-5]/
    },
    'chrometrace': {
      name: 'chromeTrace',
      key: 'q',
      api: 'trace',
      bool: true,
      info: 'capture chrome trace (about://tracing) (Chrome only)'
    },
    'tracecategories': {
      name: 'traceCategories',
      api: 'traceCategories',
      param: 'categories',
      info: 'trace categories (when chrometrace enabled) (Chrome only)'
    },
    'netlog': {
      name: 'netLog',
      key: 'G',
      api: 'netlog',
      bool: true,
      info: 'capture Network Log (Chrome only)'
    },
    'datareduction': {
      name: 'dataReduction',
      key: 'Q',
      api: 'dataReduction',
      bool: true,
      info: 'enable data reduction on Chrome 34+ Android (Chrome only)'
    },
    'useragent': {
      name: 'userAgent',
      key: 'x',
      api: 'uastring',
      param: 'string',
      info: 'custom user agent string (Chrome only)'
    },
    'cmdline': {
      name: 'commandLine',
      key: 'X',
      api: 'cmdline',
      param: 'switches',
      info: 'use a list of custom command line switches (Chrome only)'
    },
    'lighthouse': {
      name: 'lighthouse',
      api: 'lighthouse',
      bool: true,
      info: 'perform lighthouse test (Chrome only, Linux agent only)'
    },

    // Auth tab
    'login': {
      name: 'login',
      key: 'g',
      api: 'login',
      param: 'username',
      info: 'username for authenticating tests (http authentication)'
    },
    'password': {
      name: 'password',
      key: 'w',
      api: 'password',
      param: 'password',
      info: 'password for authenticating tests (http authentication)'
    },

    // Script tab
    'sensitive': {
      name: 'sensitive',
      key: 't',
      api: 'sensitive',
      bool: true,
      info: 'discard script and http headers in the result'
    },
    'noheaders': {
      name: 'disableHTTPHeaders',
      key: 'H',
      api: 'noheaders',
      bool: true,
      info: 'disable saving of the http headers (as well as browser status messages and CPU utilization)'
    },

    // Block tab
    'block': {
      name: 'block',
      key: 'b',
      api: 'block',
      param: 'urls',
      array: true,
      info: 'space-delimited list of urls to block (substring match)'
    },

    // SPOF tab
    'spof': {
      name: 'spof',
      key: 'Z',
      api: 'spof',
      param: 'domains',
      array: true,
      info: 'space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests'
    },

    // Custom tab
    'custom': {
      name: 'customMetrics',
      key: 'c',
      api: 'custom',
      param: 'script',
      info: 'execute arbitrary JavaScript at the end of a test to collect custom metrics'
    },

    // API only settings
    'authtype': {
      name: 'authenticationType',
      key: 'a',
      api: 'authType',
      param: 'type',
      info: 'type of authentication: 0 = Basic, 1 = SNS [0]'
    },
    'notify': {
      name: 'notifyEmail',
      key: 'n',
      api: 'notify',
      param: 'e-mail',
      info: 'e-mail address to notify with the test results'
    },
    'pingback': {
      name: 'pingback',
      key: 'B',
      api: 'pingback',
      param: 'url',
      info: 'URL to ping when the test is complete (the test ID will be passed as an "id" parameter)'
    },
    'bwdown': {
      name: 'bandwidthDown',
      key: 'D',
      api: 'bwDown',
      param: 'bandwidth',
      info: 'download bandwidth in Kbps (used when specifying a custom connectivity profile)'
    },
    'bwup': {
      name: 'bandwidthUp',
      key: 'U',
      api: 'bwUp',
      param: 'bandwidth',
      info: 'upload bandwidth in Kbps (used when specifying a custom connectivity profile)'
    },
    'latency': {
      name: 'latency',
      key: 'Y',
      api: 'latency',
      param: 'time',
      info: 'first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)'
    },
    'plr': {
      name: 'packetLossRate',
      key: 'P',
      api: 'plr',
      param: 'percentage',
      info: 'packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)'
    },
    'noopt': {
      name: 'disableOptimization',
      key: 'z',
      api: 'noopt',
      bool: true,
      info: 'disable optimization checks (for faster testing)'
    },
    'noimages': {
      name: 'disableScreenshot',
      key: 'I',
      api: 'noimages',
      bool: true,
      info: 'disable screen shot capturing'
    },
    'full': {
      name: 'fullResolutionScreenshot',
      key: 'F',
      api: 'pngss',
      bool: true,
      info: 'save a full-resolution version of the fully loaded screen shot as a PNG'
    },
    'jpeg': {
      name: 'jpegQuality',
      key: 'j',
      api: 'iq',
      param: 'level',
      info: 'jpeg compression level (30-100) for the screen shots and video capture'
    },
    'medianvideo': {
      name: 'medianVideo',
      key: 'A',
      api: 'mv',
      bool: true,
      info: 'store the video from the median run when capturing video is enabled'
    },
    'htmlbody': {
      name: 'htmlBody',
      api: 'htmlbody',
      bool: true,
      info: 'save the content of only the base HTML response'
    },
    'tsview': {
      name: 'tsView',
      api: 'tsview_id',
      param: 'id',
      info: 'test name to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)'
    },
    'tsviewconfigs': {
      name: 'tsViewConfigs',
      api: 'tsview_configs',
      param: 'string',
      info: 'configs to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)'
    },
    'affinity': {
      name: 'affinity',
      api: 'affinity',
      param: 'string',
      info: 'string to hash test to a specific test agent. tester will be picked by index among available testers'
    },
    'priority': {
      name: 'priority',
      api: 'priority',
      param: 'number',
      info: 'change test priority (0-9) [enforced by API key, otherwise 5]',
      valid: /^\d$/
    },
    // Undocumented/experimental/transitent/deprecated
    'noads': {
      name: 'blockAds',
      api: 'blockads',
      bool: true,
      info: 'block ads defined by adblockrules.org'
    },
    'continuous': {
      name: 'continuousVideoCapture',
      api: 'continuousVideo',
      bool: true,
      info: 'capture video continuously (unstable/experimental, may cause tests to fail)'
    },
    'spdy3': {
      name: 'forceSpdy3',
      api: 'spdy3',
      bool: true,
      info: 'force SPDY version 3 (Chrome only)'
    },
    'swrender': {
      name: 'forceSoftwareRendering',
      api: 'swrender',
      bool: true,
      info: 'force software rendering, disable GPU acceleration (Chrome only)'
    },

    // Synchonous tests + results
    'poll': {
      name: 'pollResults',
      param: 'interval',
      optional: true,
      info: 'poll for results after test is scheduled at every <interval> seconds [5]'
    },
    'wait': {
      name: 'waitResults',
      param: 'hostname:port',
      optional: true,
      info: 'wait for test results informed by agent once complete listening on <hostname>:<port> [hostname:first port available above 8000]'
    },
    'timeout': {
      name: 'timeout',
      param: 'seconds',
      info: 'timeout for polling and waiting results [no timeout]'
    }
  },
  request: {
    'request': {
      name: 'requestId',
      key: 'e',
      api: 'r',
      param: 'id',
      info: 'echo request ID, useful to track asynchronous requests'
    }
  },
  run: {
    'run': {
      name: 'run',
      key: 'r',
      param: 'number',
      info: 'which run number on a multiple runs test [1]'
    },
    'cached': {
      name: 'repeatView',
      key: 'c',
      bool: true,
      info: 'get the Repeat View (cached view) instead of default First View (primed cache)'
    }
  },
  image: {
    'thumbnail': {
      name: 'thumbnail',
      key: 't',
      bool: true,
      info: 'get the thumbnail of actual image'
    },
    'uri': {
      name: 'dataURI',
      key: 'u',
      bool: true,
      info: 'return the base64 string representation (inline) of actual image'
    }
  },
  screenshot: {
    'full': {
      name: 'fullResolution',
      key: 'f',
      bool: true,
      info: 'get full resolution screenshot in PNG format if available'
    },
    'render': {
      name: 'startRender',
      key: 'n',
      bool: true,
      info: 'get the page screenshot at the Start Render point (i.e.: when something was first displayed on screen)'
    },
    'complete': {
      name: 'documentComplete',
      key: 'p',
      bool: true,
      info: 'get the page screenshot at the Document Complete point (i.e.: when window.onload was fired)'
    }
  },
  results: {
    'breakdown': {
      name: 'breakDown',
      key: 'b',
      api: 'breakdown',
      bool: true,
      info: 'include the breakdown of requests and bytes by mime type'
    },
    'domains': {
      name: 'domains',
      key: 'D',
      api: 'domains',
      bool: true,
      info: 'include the breakdown of requests and bytes by domain'
    },
    'pagespeed': {
      name: 'pageSpeed',
      key: 'p',
      api: 'pagespeed',
      bool: true,
      info: 'include the PageSpeed score in the response (may be slower)'
    },
    'requests': {
      name: 'requests',
      key: 'R',
      api: 'requests',
      bool: true,
      info: 'include the request data in the response (slower and results in much larger responses)'
    },
    'median': {
      name: 'medianMetric',
      key: 'm',
      api: 'medianMetric',
      param: 'metric',
      info: 'set the metric used to calculate median for multiple runs tests [loadTime]'
    },
    'medianrun': {
      name: 'medianRun',
      api: 'medianRun',
      param: 'metric',
      info: 'set the run used for median for multiple runs tests [median]'
    },
    'specs': {
      name: 'specs',
      key: 'S',
      param: 'json_or_file',
      info: 'set the specs for performance test suite'
    },
    'reporter': {
      name: 'reporter',
      key: 'r',
      param: 'name',
      info: 'set performance test suite reporter output: [dot]|spec|tap|xunit|list|progress|min|nyan|landing|json|doc|markdown|teamcity',
      valid: /^(?:dot|spec|tap|xunit|list|progress|min|nyan|landing|json|doc|markdown|teamcity)$/
    }
  },
  waterfall: {
    'type': {
      name: 'chartType',
      api: 'type',
      key: 'T',
      param: 'chart',
      info: 'set the chart type: waterfall or connection [waterfall]'
    },
    'mime': {
      name: 'colorByMime',
      api: 'mime',
      key: 'M',
      bool: true,
      info: 'set chart coloring by MIME type [false]'
    },
    'width': {
      name: 'chartWidth',
      api: 'width',
      key: 'w',
      param: 'px',
      info: 'chart image width in px (300-2000) [930]'
    },
    'max': {
      name: 'maxTime',
      api: 'max',
      key: 'm',
      param: 'seconds',
      info: 'set maximum time in seconds [automatic]'
    },
    'requests': {
      name: 'requests',
      api: 'requests',
      key: 'R',
      param: 'items',
      info: 'filter requests (e.g.:1,2,3,4-9,8) [all]'
    },
    'nocpu': {
      name: 'noCPU',
      api: 'cpu',
      key: 'C',
      bool: true,
      invert: true,
      info: 'hide CPU utilization [false]'
    },
    'nobandwidth': {
      name: 'noBandwidth',
      api: 'bw',
      key: 'b',
      bool: true,
      invert: true,
      info: 'hide bandwidth utilization [false]'
    },
    'noellipsis': {
      name: 'noEllipsis',
      api: 'dots',
      key: 'i',
      bool: true,
      invert: true,
      info: 'hide ellipsis (...) for missing items [false]'
    },
    'nolabels': {
      name: 'noLabels',
      api: 'labels',
      key: 'l',
      bool: true,
      invert: true,
      info: 'hide labels for requests (URL) [false]'
    }
  },
  'apikey': {
    'key': {
      name: 'key',
      key: 'k',
      api: 'k',
      param: 'api_key',
      info: 'API key (if assigned). Contact the WebPageTest server administrator for a key if required'
    }
  },
  'video': {
    'end': {
      name: 'comparisonEndPoint',
      key: 'e',
      api: 'end',
      param: 'end_point',
      info: 'frame comparison end point: [visual]=visually complete | all=last change | doc=document complete | full=fully loaded',
      valid: /^(?:visual|all|doc|full)$/
    }
  },
  'response': {
    'request': {
      name: 'request',
      api: 'request',
      key: 'R',
      param: 'number',
      info: 'the request number [1]'
    }
  },
  'listen': {
    'key': {
      name: 'key',
      key: 'k',
      param: 'file',
      info: 'private key file to use for SSL'
    },
    'cert': {
      name: 'cert',
      key: 'c',
      param: 'file',
      info: 'public x509 certificate file to use for SSL'
    }
  }
};

var commands = {
  'status': {
    name: 'getTestStatus',
    param: 'id',
    options: [options.request],
    info: 'check test status'
  },
  'results': {
    name: 'getTestResults',
    param: 'id',
    options: [options.results, options.request],
    info: 'get test results'
  },
  'locations': {
    name: 'getLocations',
    options: [options.request],
    info: 'list locations and the number of pending tests'
  },
  'testers': {
    name: 'getTesters',
    options: [options.request],
    info: 'list testers status and details'
  },
  'test': {
    name: 'runTest',
    param: 'url_or_script',
    options: [options.apikey, options.test, options.request, options.results],
    info: 'run test',
    nokey: [options.results]
  },
  'cancel': {
    name: 'cancelTest',
    param: 'id',
    options: [options.apikey],
    info: 'cancel running/pending test'
  },
  'har': {
    name: 'getHARData',
    param: 'id',
    info: 'get the HTTP Archive (HAR) from test'
  },
  'pagespeed': {
    name: 'getPageSpeedData',
    param: 'id',
    options: [options.run],
    info: 'get the Google Page Speed results (if available) from test'
  },
  'utilization': {
    name: 'getUtilizationData',
    param: 'id',
    options: [options.run],
    info: 'get the CPU, bandwidth and memory utilization data from test'
  },
  'request': {
    name: 'getRequestData',
    param: 'id',
    options: [options.run],
    info: 'get the request data from test'
  },
  'timeline': {
    name: 'getTimelineData',
    param: 'id',
    options: [options.run],
    info: 'get the Chrome Developer Tools Timeline data (if available) from test'
  },
  'netlog': {
    name: 'getNetLogData',
    param: 'id',
    options: [options.run],
    info: 'get the Chrome Developer Tools Net log data (if available) from test'
  },
  'chrometrace': {
    name: 'getChromeTraceData',
    param: 'id',
    options: [options.run],
    info: 'get the Chrome Trace data (if available) from test'
  },
  'console': {
    name: 'getConsoleLogData',
    param: 'id',
    options: [options.run],
    info: 'get the browser console log data (if available) from test'
  },
  'testinfo': {
    name: 'getTestInfo',
    param: 'id',
    info: 'get test request info/details'
  },
  'history': {
    name: 'getHistory',
    param: 'days',
    optional: true,
    info: 'get history of previously run tests'
  },
  'googlecsi': {
    name: 'getGoogleCsiData',
    param: 'id',
    options: [options.run],
    info: 'get Google CSI data (Client Side Instrumentation)'
  },
  'response': {
    name: 'getResponseBody',
    param: 'id',
    options: [options.run, options.response],
    info: 'get response body for text resources'
  },
  'waterfall': {
    name: 'getWaterfallImage',
    param: 'id',
    options: [options.run, options.image, options.waterfall],
    info: 'get the waterfall PNG image'
  },
  'screenshot': {
    name: 'getScreenshotImage',
    param: 'id',
    options: [options.run, options.image, options.screenshot],
    info: 'get the fully loaded page screenshot in JPG format (PNG if in full resolution)'
  },
  'video': {
    name: 'createVideo',
    param: 'tests',
    options: [options.video],
    info: 'create a video from <tests> (comma separated test ids)'
  },
  'player': {
    name: 'getEmbedVideoPlayer',
    param: 'id',
    info: 'get a html5 player for a video <id>'
  },
  'listen': {
    name: 'listen',
    param: 'hostname:port',
    optional: true,
    options: [options.listen],
    info: 'start webpagetest-api proxy server on <hostname>:<port> [hostname:%s]'
  }
};

// add options shorthands by referrencing flag through key
Object.keys(options).forEach(function eachType(type) {
  Object.keys(options[type]).forEach(function eachOption(option) {
    var obj = options[type][option];
    if (obj.key) {
      options[type][obj.key] = obj;
    }
  });
});

// set valid options only per command
function setOptions(command, query) {
  var count, opts;

  command = commands[command];
  if (!command) {
    return;
  }

  opts = {};
  count = Object.keys(query).length;

  [options.common].concat(command.options).some(function someTypes(options) {
    if (!options) {
      return;
    }
    Object.keys(options).some(function someOptions(key) {
      var valid = options[key].valid;

      if (key in query) {
        if (options[key].bool) {
          opts[options[key].name] = !reBool.test(query[key]);
        } else if (!valid || (valid && valid.test(query[key]))) {
          opts[options[key].name] = decodeURIComponent(query[key]);
        }
        count -= 1;
      }

      return count === 0;
    });

    return count === 0;
  });

  return opts;
}

module.exports = {
  setOptions: setOptions,
  commands: commands,
  options: options
};
