## WebPageTest API Wrapper for NodeJS

[![Build Status](https://secure.travis-ci.org/marcelduran/webpagetest-api.svg?branch=master)](https://travis-ci.org/marcelduran/webpagetest-api)
[![NPM Version](https://img.shields.io/npm/v/webpagetest.svg?style=flat)](https://www.npmjs.org/package/webpagetest)
[![NPM Downloads](https://img.shields.io/npm/dm/webpagetest.svg?style=flat)](https://www.npmjs.org/package/webpagetest)
[![Dependencies Status](https://david-dm.org/marcelduran/webpagetest-api.svg)](https://david-dm.org/marcelduran/webpagetest-api)

[WebPageTest API Wrapper](https://marcelduran.com/webpagetest-api) is a [NPM](https://npmjs.org) package that wraps [WebPageTest](https://github.com/WPO-Foundation/webpagetest) API for [NodeJS](https://nodejs.org) as a module and a command-line tool.

## Getting started

```bash
$ npm install webpagetest -g
```

## Basics

### Command line
```bash
$ webpagetest test https://twitter.com/marcelduran
```

### Docker
#### Build
```bash
$ docker build -t webpagetest-api .
```
#### Run
```bash
$ docker run -it --rm webpagetest-api -k YOURAPIKEY test https://twitter.com/marcelduran
```

### Module
```javascript
const WebPageTest = require('webpagetest');
const wpt = new WebPageTest('www.webpagetest.org');

wpt.runTest('https://twitter.com/marcelduran', (err, data) => {
  console.log(err || data);
});
```

## API Console Demo

[marcelduran.com/webpagetest-api](http://marcelduran.com/webpagetest-api/console/)

## Command Line

### Help
```bash
$ webpagetest --help
```

### Commands
* **status** _[options] \<id\>_: check test status
* **results** _[options] \<id\>_: get test results
* **locations** _[options]_: list locations and the number of pending tests
* **testers** _[options]_: list testers status and details
* **test** _[options] \<url_or_script\>_: run test, _\<url_or_script\>_ can also be a path to a script file
* **cancel** _\<id\>_: cancel running/pending test
* **har** _\<id\>_: get the HTTP Archive (HAR) from test
* **pagespeed** _[options] \<id\>_: get the Google Page Speed results (if available) from test
* **utilization** _[options] \<id\>_: get the CPU, bandwidth and memory utilization data from test
* **request** _[options] <\id\>_: get the request data from test
* **timeline** _[options] \<id\>_: get the Chrome Developer Tools Timeline data (if available) from test
* **netlog** _[options] \<id\>_: get the Chrome Developer Tools Net log data (if available) from test
* **chrometrace** _[options] \<id\>_: get the Chrome Trace data (if available) from test
* **console** _[options] \<id\>_: get the browser console log data (if available) from test
* **testinfo** _\<id\>_: get test request info/details
* **history** _[days]_: get history of previously run tests
* **googlecsi** _[options] \<id\>_: get Google CSI data (Client Side Instrumentation)
* **response** _[options] \<id\>_: get response body for text resources
* **waterfall** _[options] \<id\>_: get the waterfall PNG image
* **screenshot** _[options] \<id\>_: get the fully loaded page screenshot in JPG format (PNG if in full resolution)
* **video** _[options] \<tests\>_: create a video from _\<tests\>_ (comma separated test ids)
* **player** _\<id\>_: get a html5 player for a video _\<id\>_
* **listen** _[options]_ _[port]_: start webpagetest-api server on port _[7791_]
* **batch** _\<file\>_: run commands in batch, i.e. one command per line from _\<file\>_ in parallel

### Options

#### Common (works for all commands)
* **-s, --server** _\<server\>_: the WPT server URL [https://www.webpagetest.org]
* **-d, --dryrun**: just return the RESTful API URL
* **-o, --out** _\<file\>_: place the output into \<file\>. Defaults to stdout

_The default WPT server can also be specified via environment variable `WEBPAGETEST_SERVER`_

#### Test (works for **test** command only)
* **-l, --location** _\<location\>_: location to test from
* **-y, --connectivity** _\<profile\>_: connectivity profile -- requires location to be specified -- (Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom) [Cable]
* **-r, --runs** _\<number\>_: number of test runs [1]
* **-f, --first**: skip the Repeat View test
* **-v, --video**: capture video
* **-p, --private**: keep the test hidden from the test log
* **-L, --label** _\<label\>_: label for the test
* **-i, --onload**: stop test at document complete. typically, tests run until all activity stops
* **-S, --noscript**: disable javascript (IE, Chrome, Firefox)
* **-C, --clearcerts**: clear SSL certificate caches
* **-R, --ignoressl**: ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc
* **-T, --standards**: forces all pages to load in standards mode (IE only)
* **-u, --tcpdump**: capture network packet trace (tcpdump)
* **-O, --bodies**: save response bodies for text resources
* **-K, --keepua**: do not add PTST to the original browser User Agent string
* **-m, --dom** _\<element\>_: DOM element to record for sub-measurement
* **-N, --duration** _\<seconds\>_: minimum test duration in seconds
* **-E, --tester** _\<name\>_: run the test on a specific PC (name must match exactly or the test will not run)
* **-W, --mobile**: (experimental) emulate mobile browser: Chrome mobile user agent, 640x960 screen, 2x scaling and fixed viewport (Chrome only)
* **--device** _\<string\>_: device name from mobile_devices.ini to use for mobile emulation (only when mobile=1 is specified to enable emulation and only for Chrome)
* **-M, --timeline**: capture Developer Tools Timeline (Chrome only)
* **-J, --callstack**: set between 1-5 to include the JS call stack. must be used in conjunction with timeline (increases overhead) (Chrome only)
* **-q, --chrometrace**: capture chrome trace (about://tracing) (Chrome only)
* **--tracecategories** _\<categories>\>_:  trace categories (when chrometrace enabled) (Chrome only)
* **-G, --netlog**: capture Network Log (Chrome only)
* **-Q, --datareduction**: enable data reduction on Chrome 34+ Android (Chrome only)
* **-x, --useragent** _\<string\>_: custom user agent string (Chrome only)
* **-X, --cmdline** _\<switches\>_: use a list of custom command line switches (Chrome only)
* **-g, --login** _\<username\>_: username for authenticating tests (http authentication)
* **-w, --password** _\<password\>_: password for authenticating tests (http authentication)
* **-t, --sensitive**: discard script and http headers in the result
* **-H, --noheaders**: disable saving of the http headers (as well as browser status messages and CPU utilization)
* **-b, --block** _\<urls\>_: space-delimited list of urls to block (substring match)
* **-Z, --spof** _\<domains\>_: space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests
* **-c, --custom** _\<script\>_: execute arbitrary javascript at the end of a test to collect custom metrics
* **-a, --authtype** _\<type\>_: type of authentication: 0 = Basic, 1 = SNS [0]
* **-n, --notify** _\<e-mail\>_: e-mail address to notify with the test results
* **-B, --pingback** _\<url\>_: URL to ping when the test is complete (the test ID will be passed as an "id" parameter)
* **-D, --bwdown** _\<bandwidth\>_: download bandwidth in Kbps (used when specifying a custom connectivity profile)
* **-U, --bwup** _\<bandwidth\>_: upload bandwidth in Kbps (used when specifying a custom connectivity profile)
* **-Y, --latency** _\<time\>_: first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)
* **-P, --plr** _\<percentage\>_: packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)
* **-z, --noopt**: disable optimization checks (for faster testing)
* **-I, --noimages**: disable screen shot capturing
* **-F, --full**: save a full-resolution version of the fully loaded screen shot as a PNG
* **-j, --jpeg** _\<level\>_: jpeg compression level (30-100) for the screen shots and video capture
* **-A, --medianvideo**: store the video from the median run when capturing video is enabled
* **--htmlbody**: save the content of only the base HTML response
* **--tsview** _\<id\>_: test name to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
* **--tsviewconfigs** _\<string\>_: configs to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
* **--affinity** _\<string\>_: string to hash test to a specific test agent. tester will be picked by index among available testers
* **--priority** _\<number\>_: change test priority (0-9) [enforced by API key, otherwise 5]
* **--continuous**: capture video continuously (unstable/experimental, may cause tests to fail)
* **--spdy3**: force SPDY version 3 (Chrome only)
* **--swrender**: force software rendering, disable GPU acceleration (Chrome only)
* **--poll** _\<interval\>_: poll for results after test is scheduled at every <interval> seconds [5]
* **--wait** _\<hostname:port\>_: wait for test results informed by agent once complete listening on <hostname>:<port> [hostname:first port available above 8000]
* **--timeout** _\<seconds\>_: timeout for polling and waiting results [no timeout]
* **--lighthouse**: perform lighthouse test (Chrome only, Linux agent only)

#### API Key (works for **test** and **cancel** commands)
* **-k, --key** _\<api_key\>_:API key (if assigned). Contact the WebPageTest server administrator for a key if required or request an API key for limited testing at [webpagetest.org/getkey.php](https://www.webpagetest.org/getkey.php)

#### Request (works for **status**, **results**, **locations**, **testers** and **test** commands)
* **-e, --request** _\<id\>_: echo request ID, useful to track asynchronous requests

#### Results (works for **results** and **test** commands)
* **-b, --breakdown**: include the breakdown of requests and bytes by mime type
* **-D, --domains**: include the breakdown of requests and bytes by domain
* **-p, --pagespeed**: include the PageSpeed score in the response (may be slower)
* **-R, --requests**: include the request data in the response (slower and results in much larger responses)
* **-m, --median** _\<metric\>_: set the metric used to calculate median for multiple runs tests [loadTime]
* **--medianrun** _\<metric>_: set the run used for median for multiple runs tests [median]
* **-S, --specs** _\<json_or_file\>_: set the specs for performance test suite
* **-r, --reporter** _\<name\>_: set performance test suite reporter output: [dot]|spec|tap|xunit|list|progress|min|nyan|landing|json|doc|markdown|teamcity

#### Run (works for **pagespeed**, **utilization**, **request**, **timeline**, **netlog**, **chrometrace**, **console**, **googlecsi**, **response**, **waterfall** and **screenshot** commands)
* **-r, --run** _\<number\>_: which run number on a multiple runs test [1]
* **-c, --cached**: get the Repeat View (cached view) instead of default First View (primed cache)

#### Image (works for **waterfall** and **screenshot** commands)
* **-t, --thumbnail**: get the thumbnail of actual image
* **-u, --uri**: return the base64 string representation (inline) of actual image

#### Screenshot (works for **screenshot** command only)
* **-f, --full**: get full resolution screenshot in PNG format if available
* **-n, --render**: get the page screenshot at the Start Render point (i.e.: when something was first displayed on screen)
* **-p, --complete**: get the page screenshot at the Document Complete point (i.e.: when window.onload was fired)

#### Waterfall (works for **waterfall** command only)
* **-T, --type** _\<chart\>_: set the chart type: waterfall or connection [waterfall]
* **-M, --mime**: set chart coloring by MIME type [false]
* **-w, --width** _\<px\>_: chart image width in px (300-2000) [930]
* **-m, --max** _\<seconds\>_: set maximum time in seconds [automatic]
* **-R, --requests** _\<items\>_: filter requests (e.g.:1,2,3,4-9,8) [all]
* **-C, --nocpu**: hide CPU utilization [false]
* **-b, --nobandwidth**: hide bandwidth utilization [false]
* **-e, --noellipsis**: hide ellipsis (...) for missing items [false]
* **-l, --nolabels**: hide labels for requests (URL) [false]

#### Video (works for **video** command only)
* **-e, --end** _\<end_point\>_: frame comparison end point: [visual]=visually complete | all=last change | doc=document complete | full=fully loaded

#### Response (works for **response** command only)
* **-R, --request** _\<number\>_: the request number [1]

#### Listen (works for **listen** command only)
* **-k, --key** _\<file\>_: private key file to use for SSL
* **-c, --cert** _\<file\>_: public x509 certificate file to use for SSL


### Examples
#### 1. Get available locations
```bash
$ webpagetest locations
```
```javascript
{
  "response": {
    "statusCode": 200, "statusText": "Ok",
    "data": {
      "location": [
        ...
        {
          "id": "SanJose_IE9",
          "Label": "San Jose, CA USA (IE 9,Chrome,Firefox)",
          "location": "SanJose_IE9",
          "Browser": "IE 9",
          "PendingTests": {
            "p1": 0, "p2": 0, "p3": 0, "p4": 0, "p5": 2, "p6": 2, "p7": 0,
            "p8": 0, "p9": 0, "Total": 7, "HighPriority": 2, "LowPriority": 4,
            "Testing": 1, "Idle": 0
          }
        },
        ...
      ]
    }
  }
}
```

#### 2. Run test on https://twitter.com/marcelduran from San Jose on IE9
```bash
$ webpagetest test https://twitter.com/marcelduran --key 1F2A3K4E5 --location SanJose_IE9
```
```javascript
{
  "statusCode": 200,
  "statusText": "Ok",
  "data": {
    "testId": "121025_PT_N8K",
    "ownerKey": "868cb2813a0f376a977dd1a24ab041b4f12361b3",
    "jsonUrl": "https://www.webpagetest.org/results.php?test=121025_PT_N8K&f=json",
    "xmlUrl": "https://www.webpagetest.org/xmlResult.php?test=121025_PT_N8K",
    "userUrl": "https://www.webpagetest.org/results.php?test=121025_PT_N8K",
    "summaryCSV": "https://www.webpagetest.org/csv.php?test=121025_PT_N8K",
    "detailCSV": "https://www.webpagetest.org/csv.php?test=121025_PT_N8K&amp;requests=1"
  }
}
```

#### 3. Check current test status
```bash
$ webpagetest status 121025_PT_N8K
```
```javascript
{
  "statusCode": 101,
  "statusText": "Test Pending",
  "data": {
    "statusCode": 101,
    "statusText": "Test Pending",
    "testId": "121025_PT_N8K",
    "runs": 1,
    "fvonly": 0,
    "location": "SanJose_IE9"
  }
}
```

#### 4. Get test results
```bash
$ webpagetest results 121025_PT_N8K
```
```javascript
{
  "response": {
    "statusCode": 200, "statusText": "Ok",
    "data": {
      "testId": "121025_PT_N8K",
      "summary": "https://www.webpagetest.org/result/121025_PT_N8K/",
      "testUrl": "https://twitter.com/marcelduran",
      "location": "SanJose_IE9",
      "connectivity": "DSL",
      "bwDown": 1500, "bwUp": 384, "latency": 50, "plr": 0,
      "completed": "Thu, 25 Oct 2012 23:42:11 +0000",
      "runs": 1, "successfulFVRuns": 1,
      "average": {
        "firstView": {
          "loadTime": 3942, "TTFB": 1518,
          "bytesIn": 963405, "bytesInDoc": 431612,
          "requests": 32, "requestsDoc": 19,
          "render": 2509, "fullyLoaded": 7765,
          "docTime": 3942, "domTime": 0,
          "titleTime": 1641, "avgRun": 1
        }
      },
      ...
    }
  }
}
```

#### 5. Get test waterfall thumbnail from repeat view as data URI
```bash
$ webpagetest waterfall 121025_PT_N8K --thumbnail --cached --uri
```
```javascript
{
  "type": "image/png",
  "data": "iVBORw0KGgoAAAANSUhEUgA...RK5CYII="
}
```

#### Run test on https://twitter.com/marcelduran and poll results every 5 seconds timing out in 60 seconds
```bash
$ webpagetest test https://twitter.com/marcelduran --poll 5 --timeout 60
```
#### Or run test on https://twitter.com/marcelduran and wait for results listening on localhost\* port 8000\**
```bash
$ webpagetest test https://twitter.com/marcelduran --wait 8000
```
```javascript
{
  "response": {
    "statusCode": 200, "statusText": "Ok",
    "data": {
      "testId": "121025_PT_N8K",
      "testUrl": "https://twitter.com/marcelduran",
      ...
      "median": {
        "firstView": {
          "loadTime": 3942, "TTFB": 1518,
          "render": 2509, "fullyLoaded": 7765,
          ...
        }
      },
      ...
    }
  }
}
```
_\* hostname and port are optional, defaults to \<system hostname\>:\<8000\>_
_\** localhost and port must be reacheable from WebPageTest server_

## Module
Methods and options (including the one letter shorthands) are the same when using as a Node module, however a more verbose version of both commands (methods) and options (parameters) are available and encouraged to use for code clarity.

### Methods
* `getTestStatus(id, options, callback)`
* `getTestResults(id, options, callback)`
* `getLocations(options, callback)`
* `getTesters(options, callback)`
* `runTest(url_or_script, options, callback)`
* `cancelTest(id, options, callback)`
* `getHARData(id, options, callback)`
* `getPageSpeedData(id, options, callback)`
* `getUtilizationData(id, options, callback)`
* `getRequestData(id, options, callback)`
* `getTimelineData(id, options, callback)`
* `getNetLogData(id, options, callback)`
* `getChromeTraceData(id, options, callback)`
* `getConsoleLogData(id, options, callback)`
* `getTestInfo(id, options, callback)`
* `getHistory(days, options, callback)`
* `getGoogleCsiData(id, options, callback)`
* `getResponseBody(id, options, callback)`
* `getWaterfallImage(id, options, callback)`
* `getScreenshotImage(id, options, callback)`
* `createVideo(tests, options, callback)`
* `getEmbedVideoPlayer(id, options, callback)`
* `listen(port, options, callback)`
* `scriptToString(script)`

### Parameters
* **id**: test ID string _required_
* **options**: parameters object _optional_, see below
* **callback**: the callback `(error, data)` _optional=> _
* **url_or_script**: decoded url or script string _required_
* **port**: port number _optional_ \[default: 7791\]
* **script**: script array in the format:

```javascript
[
  {command1: 'value1'},
  {command2: 123},
  {command3: ['value1', 'value2', ... , 'valueN']},
  ...
  'commandN'}
]
```

#### Notes

* `getWaterfallImage` and `getScreenshotImage` callback function has a third parameter `info` which is an object with `{type: 'image/jpeg or png', encoding: 'utf8 or binary'}`
* `scriptToString` script array values 1-N are optional. e.g:

```javascript
const script = wpt.scriptToString([
  {logData: 0},
  {navigate: 'http://foo.com/login'},
  {logData: 1},
  {setValue: ['name=username', 'johndoe']},
  {setValue: ['name=password', '12345']},
  {submitForm: 'action=http://foo.com/main'},
  'waitForComplete'
]);

wpt.runTest(script, (err, data) => {
  console.log(err || data);
});
```

### Options
#### Common (works for all methods with `options` parameter)
* **dryRun**: _Boolean_, if `true`, method does not make an actual request to the API Server but rather returns an object with `url` which contains the actual URL to make the GET request to WebPageTest API Server
* **server**: _String_, if specified, overrides the WebPageTest server informed in the constructor only for that method call

#### Test (works for `runTest` method only)
* **location**: _String_, location to test from
* **connectivity**: _String_, connectivity profile -- requires location to be specified -- (Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom) [Cable]
* **runs**: _Number_, number of test runs [1]
* **firstViewOnly**: _Boolean_, skip the Repeat View test
* **video**: _Boolean_, capture video
* **private**: _Boolean_, keep the test hidden from the test log
* **label**: _String_, label for the test
* **stopAtDocumentComplete**: _Boolean_, stop test at document complete. typically, tests run until all activity stops
* **disableJavaScript**: _Boolean_, disable JavaScript (IE, Chrome, Firefox)
* **clearCerts**: _Boolean_, clear SSL certificate caches
* **ignoreSSL**: _Boolean_, ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc
* **disableCompatibilityView**: _Boolean_, forces all pages to load in standards mode (IE only)
* **tcpDump**: _Boolean_, capture network packet trace (tcpdump)
* **saveResponseBodies**: _Boolean_, save response bodies for text resources
* **keepOriginalUserAgent**: _Boolean_, do not add PTST to the original browser User Agent string
* **domElement**: _String_, DOM element to record for sub-measurement
* **minimumDuration**: _Number_, minimum test duration in seconds
* **tester**: _String_, run the test on a specific PC (name must match exactly or the test will not run)
* **emulateMobile**: _Boolean_, (experimental) emulate mobile browser: Chrome mobile user agent, 640x960 screen, 2x scaling and fixed viewport (Chrome only)
* **timeline**: _Boolean_, capture Developer Tools Timeline (Chrome only)
* **timelineCallStack**: _Boolean_, set between 1-5 to include the JS call stack. must be used in conjunction with timeline (increases overhead) (Chrome only)
* **chromeTrace**: _Boolean_, capture chrome trace (about://tracing) (Chrome only)
* **netLog**: _Boolean_, capture Network Log (Chrome only)
* **dataReduction**: _Boolean_, enable data reduction on Chrome 34+ Android (Chrome only)
* **userAgent**: _String_, custom user agent string (Chrome only)
* **commandLine**: _String_, use a list of custom command line switches (Chrome only)
* **login**: _String_, username for authenticating tests (http authentication)
* **password**: _String_, password for authenticating tests (http authentication)
* **sensitive**: _Boolean_, discard script and http headers in the result
* **disableHTTPHeaders**: _Boolean_, disable saving of the http headers (as well as browser status messages and CPU utilization)
* **block**: _String_, space-delimited list of urls to block (substring match)
* **spof**: _String_, space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests
* **customMetrics**: _String_, execute arbitrary JavaScript at the end of a test to collect custom metrics
* **authenticationType**: _Number_, type of authentication: 0 = Basic, 1 = SNS [0]
* **notifyEmail**: _String_, e-mail address to notify with the test results
* **pingback**: _String_, URL to ping when the test is complete (the test ID will be passed as an "id" parameter)
* **bandwidthDown**: _String_, download bandwidth in Kbps (used when specifying a custom connectivity profile)
* **bandwidthUp**: _String_, upload bandwidth in Kbps (used when specifying a custom connectivity profile)
* **latency**: _String_, first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)
* **packetLossRate**: _Number_, packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)
* **disableOptimization**: _Boolean_, disable optimization checks (for faster testing)
* **disableScreenshot**: _Boolean_, disable screen shot capturing
* **fullResolutionScreenshot**: _Boolean_, save a full-resolution version of the fully loaded screen shot as a PNG
* **jpegQuality**: _Number_, jpeg compression level (30-100) for the screen shots and video capture
* **medianVideo**: _Boolean_, store the video from the median run when capturing video is enabled
* **htmlBody**: _Boolean_, save the content of only the base HTML response
* **tsView**: _String_, test name to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
* **tsViewConfigs**: _String_, configs to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
* **affinity**: _String_, string to hash test to a specific test agent. tester will be picked by index among available testers
* **priority**: _Number_, change test priority (0-9) [enforced by API key, otherwise 5]
* **blockAds**: _Boolean_, block ads defined by http://adblockplus.org
* **continuousVideoCapture**: _Boolean_, capture video continuously (unstable/experimental, may cause tests to fail)
* **forceSpdy3**: _Boolean_, force SPDY version 3 (Chrome only)
* **forceSoftwareRendering**: _Boolean_, force software rendering, disable GPU acceleration (Chrome only)
* **pollResults**: _Number_, poll for results after test is scheduled at every <interval> seconds [5]
* **waitResults**: _String_, wait for test results informed by agent once complete listening on <hostname>:<port> [hostname:first port available above 8000]
* **timeout**: _String_, timeout for polling and waiting results [no timeout]
* **lighthouse**: _Boolean_, perform lighthouse test (Chrome only, Linux agent only)

#### API Key (works for `runTest` and `cancelTest` methods)
* **key**: _String_, API key (if assigned). Contact the WebPageTest server administrator for a key if required

#### Request (works for `getTestStatus` `getResults` `getLocations` `getTesters` and `runTest` methods)
* **requestId**: _String_, echo request ID, useful to track asynchronous requests

#### Results (works for `getResults` and `runTest` methods)
* **breakDown**: _Boolean_, include the breakdown of requests and bytes by mime type
* **domains**: _Boolean_, include the breakdown of requests and bytes by domain
* **pageSpeed**: _Boolean_, include the PageSpeed score in the response (may be slower)
* **requests**: _Boolean_, include the request data in the response (slower and results in much larger responses)
* **medianMetric**: _String_, set the metric used to calculate median for multiple runs tests (default: loadTime)
* **specs**: _String_, set the specs for performance test suite
* **reporter**: _String_, set performance test suite reporter output: [dot]|spec|tap|xunit|list|progress|min|nyan|landing|json|doc|markdown|teamcity

#### Run (works for `getPageSpeedData`, `getUtilizationData`, `getRequestData`, `getTimelineData`, `getNetLogData`, `getChromeTraceData`, `getConsoleLogData`, `getGoogleCsiData`, `getResponseBody`, `getWaterfallImage` and `getScreenshotImage` methods)
* **run**: _Number_, the test run number for multiple runs tests (default: 1, first test)
* **repeatView**: _Boolean_, if `true` returns the repeat view (cached) data

#### Image (works for `getWaterfallImage` and `getScreenshotImage` methods)
* **thumbnail**: _Boolean_, returns the thumbnail of actual image
* **dataURI**: _Boolean_, returns the base64 string representation (inline) of actual image

#### Screenshot (works for `getScreenshotImage` method only)
* **fullResolution**: _Boolean_, returns the full resolution screenshot in PNG format if available
* **startRender**: _Boolean_, returns the page screenshot at the Start Render point (i.e.: when something was first displayed on screen)
* **documentComplete**: _Boolean_, returns the page screenshot at the Document Complete point (i.e.: when `window.onload` was fired)

#### Waterfall (works for `getWaterfallImage` method only)
* **chartType**: _String_, set the chart type: waterfall or connection [waterfall]
* **colorByMime**: _Boolean_, set chart coloring by MIME type [false]
* **chartWidth** _Number_: chart image width in px (300-2000) [930]
* **maxTime** _Number_: set maximum time in seconds [automatic]
* **requests** _String_: filter requests (e.g.:1,2,3,4-9,8) [all]
* **noCPU**: _Boolean_, hide CPU utilization [false]
* **noBandwidth**: _Boolean_, hide bandwidth utilization [false]
* **noEllipsis**: _Boolean_, hide ellipsis (...) for missing items [false]
* **noLabels**: _Boolean_, hide labels for requests (URL) [false]

#### Video (works for `createVideo` method only)
* **comparisonEndPoint** _String_: frame comparison end point: [visual]=visually complete | all=last change | doc=document complete | full=fully loaded

#### Response (works for `getResponseBody` method only)
* **request** _Number_: the request number [1]

#### Listen (works for `listen` method only)
* **key** _String_: private key file path to use for SSL
* **cert** _String_: public x509 certificate file path to use for SSL

### Examples

#### 1. Instantiating
```javascript
const WebPageTest = require('webpagetest');

const wpt = new WebPageTest('my-wpt.foo.com'); // default: www.webpagetest.org
const wptPublic = new WebPageTest('www.webpagetest.org', 'MY_API_KEY');
```

#### 2. Get available locations
```javascript
wpt.getLocations((err, data) => {
  console.log(err || data);
});
```

#### 3. Run test on https://twitter.com/marcelduran from San Jose on IE9
```javascript
wpt.runTest('https://twitter.com/marcelduran', {location: 'SanJose_IE9'}, (err, data) => {
  console.log(err || data);
});
```

#### 4. Check current test status
```javascript
wpt.getTestStatus('121025_PT_N8K', (err, data) => {
  console.log(err || data);
});
```

#### 5. Get test results
```javascript
wpt.getTestResults('121025_PT_N8K', (err, data) => {
  console.log(err || data);
});
```

#### 6. Get test waterfall thumbnail from repeat view as data URI
```javascript
wpt.getWaterfallImage('121025_PT_N8K', {
  thumbnail: true,
  repeatView: true,
  dataURI: true
}, (err, data, info) => {
  console.log(err || data, info);
});
```

#### Run test on https://twitter.com/marcelduran and poll results every 5 seconds timing out in 60 seconds
```javascript
wpt.runTest('https://twitter.com/marcelduran', {pollResults: 5, timeout: 60}, (err, data) => {
  console.log(err || data);
});
```

#### Or run test on https://twitter.com/marcelduran and wait results listening on localhost\* port 8000\*\*
```javascript
wpt.runTest('https://twitter.com/marcelduran', {waitResults: 'localhost:8000'}, (err, data) => {
  console.log(err || data);
});
```
_\* hostname and port are optional, defaults to \<system hostname\>:\<8000\>_

_\** localhost:8000 must be reacheable from WebPageTest server_

## Server mode
WebPageTest API Wrapper comes with a handy RESTful API proxy

### Command Line
```bash
$ webpagetest listen 8080 --server wpt.foo.com
```
```bash
server listening on port 8080
http://localhost:8080
```
```bash
$ curl http://localhost:8080/help
$ curl http://localhost:8080/test/twitter.com/?location=SanJose_IE9
```
```bash
$ webpagetest listen 8443 --key key.pem --cert cert.pem --server wpt.foo.com
```
```bash
server listening on port 8443
https://localhost:8443
```

#### Notes
* port _8080_ is optional, default port is _7791_
* `wpt.foo.com` is overriding the default `www.webpagetest.org` server but can still be overridden with `server` option
* when _--key_ and _--cert_ are provided, HTTPS is used instead of default HTTP server

### Module
```javascript
const server = wpt.listen(8080, (err, data) => {
  if (err) throw err;
  console.log('listening on ' + data.url);
}); // listen on port 8080 (optional), default port is 7791

setTimeout(() => {
  server.close(() => {
    console.log('server closed');
  });
}, 10000); // wait for 10s before stop listening
```

## Batch
Batch command is available as command line only and loads a batch file containing one WebPageTest CLI command with options per line. It runs all commands in parallel, but returns an array of results in order as they appear in the batch file once all results are ready. The exit status code is the sum of all individual commands' exit status code.

By running
```bash
$ webpagetest batch commands.txt
```
where `commands.txt` contains:
```
test twitter.com/marcelduran --first --location foo
test twitter.com/marcelduran --first --location bar
```
It schedules the 2 tests above returning an array of size 2 in the same order as in `commands.txt` file:
```javascript
[
  {
    "statusCode": 200, "statusText": "Ok",
    "data": {
      "testId": "130715_AB_C1D",
      ...
    }
  },
  {
    "statusCode": 200, "statusText": "Ok",
    "data": {
      "testId": "130715_CD_E2F",
      ...
    }
  }
]
```
With exit status 0 in case none of commands returns an error:
```bash
$ echo $?
0
````

By running multiple sync tests, i.e. with either `--poll` or `--wait`, all tests are scheduled and results are polled or wait in parallel; meaning, if tests are set to run in different locations or same location with multiple agents, the final result might come together, but the result array will only return once *all* tests are done. e.g.:

`commands.txt`:
```
test twitter.com/marcelduran --first --location foo --poll --timeout 60
test twitter.com/marcelduran --first --location bar --poll --timeout 60
```

## Test Specs (Continuous Integration)

WebPageTest API Wrapper provides a simple seamless way to integrate WebPageTest with Continuous Integration tools.

[See dedicated page](https://github.com/marcelduran/webpagetest-api/wiki/Test-Specs)

## Tests
```bash
$ npm test
```

## Issues

Have a bug/feature request? Please create an issue here on GitHub!

https://github.com/marcelduran/webpagetest-api/issues

## Author

**Marcel Duran**

+ https://github.com/marcelduran

## License

Copyright 2013 Twitter Inc.
Copyright 2017 Google Inc.
Copyright 2017 Marcel Duran and other contributors

Licensed under the [MIT License](https://github.com/marcelduran/webpagetest-api/raw/master/LICENSE)
