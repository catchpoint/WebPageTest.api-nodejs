/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2014, Google Inc.
 * Copyright (c) 2014, Marcel Duran and other contributors
 * Released under the MIT License
 */

(function () {
  'use strict';
  var
    options = {
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
        'label': {
          name: 'label',
          key: 'L',
          api: 'label',
          param: 'label',
          info: 'label for the test'
        },
        'private': {
          name: 'private',
          key: 'p',
          api: 'private',
          bool: true,
          info: 'keep the test hidden from the test log'
        },
        'video': {
          name: 'video',
          key: 'v',
          api: 'video',
          bool: true,
          info: 'capture video'
        },
        'connectivity': {
          name: 'connectivity',
          key: 'y',
          api: 'connectivity',
          param: 'profile',
          info: 'connectivity profile (DSL|FIOS|Dial|custom) [DSL]'
        },
        'dom': {
          name: 'domElement',
          key: 'm',
          api: 'domelement',
          param: 'element',
          info: 'DOM element to record for sub-measurement'
        },
        'connections': {
          name: 'connections',
          key: 'c',
          api: 'connections',
          param: 'number',
          info: 'override the number of concurrent connections'
        },
        'onload': {
          name: 'stopAtDocumentComplete',
          key: 'i',
          api: 'web10',
          bool: true,
          info: 'force the test to stop at window.onload'
        },
        'sensitive': {
          name: 'sensitive',
          key: 't',
          api: 'sensitive',
          bool: true,
          info: 'discard script and http headers in the result'
        },
        'block': {
          name: 'block',
          key: 'b',
          api: 'block',
          param: 'urls',
          array: true,
          info: 'space-delimited list of urls to block (substring match)'
        },
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
        'tcpdump': {
          name: 'tcpDump',
          key: 'u',
          api: 'tcpdump',
          bool: true,
          info: 'enable tcpdump capture'
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
        'noheaders': {
          name: 'disableHTTPHeaders',
          key: 'H',
          api: 'noheaders',
          bool: true,
          info: 'disable saving of the http headers (as well as browser status messages and CPU utilization)'
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
        'noscript': {
          name: 'disableJavaScript',
          key: 'S',
          api: 'noscript',
          bool: true,
          info: 'disable javascript (IE, Chrome, Firefox)'
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
        'duration': {
          name: 'minimumDuration',
          key: 'N',
          api: 'time',
          param: 'seconds',
          info: 'minimum test duration in seconds'
        },
        'noads': {
          name: 'blockAds',
          key: 'A',
          api: 'blockads',
          bool: true,
          info: 'block ads defined by adblockrules.org'
        },
        'aft': {
          name: 'aftRenderingTime',
          key: 'E',
          api: 'aft',
          bool: true,
          info: '(experimental) measure above-the-fold rendering time'
        },
        'spof': {
          name: 'spof',
          key: 'Z',
          api: 'spof',
          param: 'domains',
          array: true,
          info: 'space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests'
        },
        'mobile': {
          name: 'emulateMobile',
          key: 'W',
          api: 'mobile',
          bool: true,
          info: '(experimental) emulate mobile browser: Chrome mobile user agent, 640x960 screen, 2x scaling and fixed viewport (Chrome only)'
        },
        'timeline': {
          name: 'timeline',
          key: 'M',
          api: 'timeline',
          bool: true,
          info: 'capture Developer Tools Timeline (Chrome only)'
        },
        'netlog': {
          name: 'netLog',
          key: 'G',
          api: 'netlog',
          bool: true,
          info: 'capture Network Log (Chrome only)'
        },
        'spdy3': {
          name: 'forceSpdy3',
          key: 'C',
          api: 'spdy3',
          bool: true,
          info: 'force SPDY version 3 (Chrome only)'
        },
        'swrender': {
          name: 'forceSoftwareRendering',
          key: 'J',
          api: 'swrender',
          bool: true,
          info: 'force software rendering, disable GPU acceleration (Chrome only)'
        },
        'noparser': {
          name: 'disableThreadedParser',
          key: 'Q',
          api: 'disableThreadedParser',
          bool: true,
          info: 'disable threaded HTML parser (Chrome only)'
        },
        'spdynossl': {
          name: 'spdyNoSSL',
          key: 'q',
          api: 'spdyNoSSL',
          bool: true,
          info: 'use SPDY without SSL (Chrome only)'
        },
        'cmdline': {
          name: 'commandLine',
          api: 'cmdline',
          param: 'switches',
          info: 'use a list of custom command line switches (Chrome only)'
        },
        'htmlbody': {
          name: 'htmlBody',
          api: 'htmlbody',
          bool: true,
          info: 'save the content of only the base HTML response'
        },
        'continuous': {
          name: 'continuousVideoCapture',
          api: 'continuousVideo',
          bool: true,
          info: 'capture video continuously (unstable/experimental, may cause tests to fail)'
        },
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
      }
    },
    commands = {
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
        info: 'get the HTTPS Archive (HAR) from test'
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
      }
    },
    hostname = 'http://webpagetest.aws.af.cm';

  function getOptions() {
    var opts = {};

    $('.options.active input:text[value!=""]').each(function (i, e) {
      var opt = $(e);
      
      if (!opt.val()) {
        return;
      }

      opts[opt.attr('data-key')] = opt.val();
    });

    $('.options.active input:checked').each(function (i, e) {
      opts[$(e).val()] = true;
    });

    if (Object.keys(opts).length > 0) {
      return opts;
    }
  }

  function run(command, param, options, callback) {
    var url = [
      hostname,
      '/',
      command,
      param !== undefined ? '/' + param : '',
      '?callback=?',
      options ? '&' + $.param(options) : ''
    ].join(''),
        isImage = ['waterfall', 'screenshot'].indexOf(command) > -1;

    options = options || {};
    isImage = isImage && !options.uri;
    if (!options.dryrun && isImage) {
      callback(true, url);
    } else {
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: callback.bind(null, false)
      });
    }
  }

  function buildModule() {
    var opts, modOpts,
        stmt = [
          'var WebPageTest = require(\'webpagetest\');',
          '',
          'var wpt = new WebPageTest(\'www.webpagetest.org\', \'your_API_key\');',
          '',
          'wpt.{method}({param}{options}function callback(err, data{info}) {',
          '  console.log(err || data);',
          '});'].join('\n'),
        command = commands[$('#commands').val()];

    if (!command) {
      return;
    }

    // transform options into module options
    opts = getOptions();
    if (opts) {
      modOpts = {};
      Object.keys(opts).forEach(function eachKey(opt) {
        ['common'].concat(command.options).forEach(function eachType(type) {
          if (type && options[type][opt]) {
            modOpts[options[type][opt].name] = opts[opt];
          }
        });
      });
    }

    stmt = stmt
      .replace('{method}', command.name)
      .replace('{param}', command.param ? '\'' + $('#param').val() + '\', ' : '')
      .replace('{options}', modOpts ? JSON.stringify(modOpts) + ', ' : '')
      .replace('{info}', command.name.indexOf('Image') > -1 ? ', info' : '');

    $('#module').text(stmt);
  }

  function buildCommandLine() {
    var opts,
        clOpts = [],
        stmt = '$ webpagetest {command}{param}{options}',
        name = $('#commands').val(),
        command = commands[name];

    if (!command) {
      return;
    }

    // transform options into command line options
    opts = getOptions();
    if (opts) {
      Object.keys(opts).forEach(function eachOpt(opt) {
        clOpts.push('--' + opt);
        if (typeof opts[opt] !== 'boolean') {
          clOpts.push(opts[opt]);
        }
      });
    }

    stmt = stmt
      .replace('{command}', name)
      .replace('{param}', command.param ? ' ' + $('#param').val() : '')
      .replace('{options}', opts ? ' ' + clOpts.join(' ') : '');

    $('#command-line').text(stmt);
  }

  function buildURL() {
    var param, options,
        name = $('#commands').val(),
        command = commands[name];

    if (!command) {
      return;
    }

    if (command.param) {
      param = $('#param').val() || command.param;
    }

    options = getOptions() || {};
    options.dryrun = true;
    run(name, param, options, function (image, data) {
      $('#url').text(data.url);
    });
  }

  function buildProxy() {
    var param, url, opts,
        name = $('#commands').val(),
        command = commands[name];

    if (!command) {
      return;
    }

    if (command.param) {
      param = $('#param').val() || command.param;
      if (name === 'test') {
        param = encodeURIComponent(param);
      }
    }

    opts = getOptions();

    url = [
      hostname,
      '/',
      name,
      param !== undefined ? '/' + param : '',
      opts ? '?' + $.param(opts) : ''
    ].join('');

    $('#proxy').text(url);
  }

  function build() {
    buildModule();
    buildCommandLine();
    buildURL();
    buildProxy();
  }

  // fill options
  Object.keys(options).forEach(function eachType(type) {
    var frag = document.createDocumentFragment(),
        opts = options[type];

    // bool first, then alphabetically
    function sort(a, b) {
      return opts[a].bool && !opts[b].bool ? -1 : a < b ? -1 : 1;
    }

    Object.keys(opts).sort(sort).forEach(function eachOpt(name) {
      var opt = opts[name];

      if (opt.bool) {
        $(frag).append(
          $('<label class="checkbox inline span1 opt">')
            .attr('title', opt.info)
            .html('<input type="checkbox" value="' + name + '">' + name)
        );
      } else {
        $(frag).append(
          $('<div class="input-prepend inline opt"/>')
            .attr('title', opt.info)
            .append($('<span class="add-on"/>').text(name))
            .append($('<input type="text" class="span2">')
              .attr('data-key', name)
            )
        );
      }
    });

    $('#opt-' + type).append($(frag));
  });
  $('#tab-options .opt').tooltip({delay: {show: 500, hide: 100}});

  $('#commands').on('change', function (e) {
    var command = commands[$(e.target).val()];

    if (!command) {
      $('#param').hide();
      $('#command-info').text('Select a command above');
      return;
    }

    if (command.param) {
      $('#param').attr('placeholder', command.param).show();
    } else {
      $('#param').hide();
    }

    $('.options.active').removeClass('active');
    ['common'].concat(command.options).forEach(function (name) {
      if (name) {
        $('#opt-' + name).addClass('active');
      }
    });

    $('#command-info').text(command.info);

    build();
  });

  $('#param').on('input', function (e) {
    build();
  });

  $('#tab-options').on('change', function (e) {
    build();
  });

  $('#form').on('submit', function (e) {
    var param,
        name = $('#commands').val(),
        command = commands[name];

    if (!command) {
      return;
    }

    e.preventDefault();

    if (command.param) {
      param = $('#param').val() || command.param;
    }

    $('#output').text('running...');
    $('.nav-tabs a[href="#tab-output"]').click();

    run(name, param, getOptions(), function (image, data) {
      if (image) {
        $('#image').attr('src', data).show();
        $('#output').hide();
      } else {
        data = (data && JSON.stringify(data, null, 2)) || '';
        $('#image').hide();
        $('#output').text(data).show();
      }
    });
  });
}());
