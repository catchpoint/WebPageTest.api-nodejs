## WebPageTest API Wrapper for NodeJS [![Build Status](https://secure.travis-ci.org/marcelduran/webpagetest-api.png?branch=master)](http://travis-ci.org/marcelduran/webpagetest-api)

[WebPageTest API Wrapper](http://github.com/marcelduran/webpagetest-api) is a [NPM](http://npmjs.org) package that wraps [WebPageTest](http://code.google.com/p/webpagetest/) API for [NodeJS](http://nodejs.org) as a module and a command-line tool.

## Getting started

```bash
$ npm install webpagetest -g
```

## Basics

### Command line
```bash
$ webpagetest test http://twitter.com/marcelduran
```

### Module
```javascript
var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org');

wpt.runTest('http://twitter.com/marcelduran', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

## Command Line

### Help
```bash
$ webpagetest --help
```

### Commands
* **status** _\<id\>_: check test status
* **results** _\<id\>_: get test results
* **locations**: list locations and the number of pending tests
* **test** _[options] \<url_or_script\>_: run test
* **cancel** _\<id\>_: cancel running/pending test
* **har** _\<id\>_: get the HTTPS Archive (HAR) from test
* **pagespeed** _[options] \<id\>_: get the Google Page Speed results (if available) from test
* **utilization** _[options] \<id\>_: get the CPU, bandwidth and memory utilization data from test
* **request** _[options] <\id\>_: get the request data from test
* **timeline** _[options] \<id\>_: get the Chrome Developer Tools Timeline data (if available) from test
* **netlog** _[options] \<id\>_: get the Chrome Developer Tools Net log data (if available) from test
* **console** _[options] \<id\>_: get the browser console log data (if available) from test
* **waterfall** _[options] \<id\>_: get the waterfall PNG image
* **screenshot** _[options] \<id\>_: get the fully loaded page screenshot in JPG format (PNG if in full resolution)
* **listen** _[port]_: start webpagetest-api server on port [7791]

### Options

#### Common (works for all commands)
* **-s, --server** _\<server\>_: the WPT server URL [http://www.webpagetest.org]
* **-d, --dryrun**: just return the RESTful API URL
* **-o, --out** _\<file\>_: place the output into \<file\>. Defaults to stdout

_The default WPT server can also be specified via environment variable `WEBPAGETEST_SERVER`_

#### Test (works for **test** command only)
* **-k, --key** _\<api_key\>_:API key (if assigned). Contact the WebPageTest server administrator for a key if required
* **-l, --location** _\<location\>_: location to test from
* **-r, --runs** _\<number\>_: number of test runs [1]
* **-f, --first**: skip the Repeat View test
* **-L, --label** _\<label\>_: label for the test
* **-p, --private**: keep the test hidden from the test log
* **-v, --video**: capture video
* **-y, --connectivity** _\<profile\>_: connectivity profile (DSL|FIOS|Dial|custom) [DSL]
* **-m, --dom** _\<element\>_: DOM element to record for sub-measurement
* **-c, --connections** _\<number\>_: override the number of concurrent connections
* **-i, --onload**: force the test to stop at window.onload
* **-t, --sensitive**: discard script and http headers in the result
* **-b, --block** _\<urls\>_: space-delimited list of urls to block (substring match)
* **-g, --login** _\<username\>_: username for authenticating tests (http authentication)
* **-w, --password** _\<password\>_: password for authenticating tests (http authentication)
* **-a, --authtype** _\<type\>_: type of authentication: 0 = Basic, 1 = SNS [0]
* **-e, --request** _\<id\>_: echo request ID, useful to track asynchronous requests
* **-n, --notify** _\<e-mail\>_: e-mail address to notify with the test results
* **-B, --pingback** _\<url\>_: URL to ping when the test is complete (the test ID will be passed as an "id" parameter)
* **-D, --bwdown** _\<bandwidth\>_: download bandwidth in Kbps (used when specifying a custom connectivity profile)
* **-U, --bwup** _\<bandwidth\>_: upload bandwidth in Kbps (used when specifying a custom connectivity profile)
* **-Y, --latency** _\<time\>_: first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)
* **-P, --plr** _\<percentage\>_: packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)
* **-u, --tcpdump**: enable tcpdump capture
* **-z, --noopt**: disable optimization checks (for faster testing)
* **-I, --noimages**: disable screen shot capturing
* **-H, --noheaders**: disable saving of the http headers (as well as browser status messages and CPU utilization)
* **-F, --full**: save a full-resolution version of the fully loaded screen shot as a PNG
* **-j, --jpeg** _\<level\>_: jpeg compression level (30-100) for the screen shots and video capture
* **-S, --noscript**: disable javascript (IE, Chrome, Firefox)
* **-R, --ignoressl**: ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc
* **-T, --standards**: forces all pages to load in standards mode (IE only)
* **-O, --bodies**: save response bodies for text resources
* **-K, --keepua**: do not add PTST to the original browser User Agent string
* **-N, --duration** _\<seconds\>_: minimum test duration in seconds
* **-A, --noads**: block ads defined by adblockrules.org
* **-E, --aft**: (experimental) measure above-the-fold rendering time
* **-M, --timeline**: capture Developer Tools Timeline (Chrome only)
* **-G, --netlog**: capture Network Log (Chrome only)
* **-Z, --spof** _\<domains\>_: space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests

#### Run (works for **pagespeed**, **utilization**, **request**, **timeline**, **netlog**, **console**, **waterfall** and **screenshot** commands)
* **-r, --run** _\<number\>_: which run number on a multiple runs test [1]
* **-c, --cached**: get the Repeat View (cached view) instead of default First View (primed cache)

#### Image (works for **waterfall** and **screenshot** commands)
* **-t, --thumbnail**: get the thumbnail of actual image
* **-u, --uri**: return the base64 string representation (inline) of actual image

#### Screenshot (works for **screenshot** command only)
* **-f, --full**: get full resolution screenshot in PNG format if available
* **-n, --render**: get the page screenshot at the Start Render point (i.e.: when something was first displayed on screen)
* **-p, --complete**: get the page screenshot at the Document Complete point (i.e.: when window.onload was fired)

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

#### 2. Run test on http://twitter.com/marcelduran from San Jose on IE9
```bash
$ webpagetest test http://twitter.com/marcelduran --key 1F2A3K4E5 --location SanJose_IE9 
```
```javascript
{
  "statusCode": 200,
  "statusText": "Ok",
  "data": {
    "testId": "121025_PT_N8K",
    "ownerKey": "868cb2813a0f376a977dd1a24ab041b4f12361b3",
    "jsonUrl": "http://localhost/results.php?test=121025_PT_N8K&f=json",
    "xmlUrl": "http://localhost/xmlResult.php?test=121025_PT_N8K",
    "userUrl": "http://localhost/results.php?test=121025_PT_N8K",
    "summaryCSV": "http://localhost/csv.php?test=121025_PT_N8K",
    "detailCSV": "http://localhost/csv.php?test=121025_PT_N8K&amp;requests=1"
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
      "summary": "http://www.webpagetest.org/result/121025_PT_N8K/",
      "testUrl": "http://twitter.com/marcelduran",
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

## Module

### Methods
* `getTestStatus(id, options, callback)`
* `getTestResults(id, options, callback)`
* `getLocations(options, callback)`
* `runTest(url_or_script, options, callback)`
* `cancelTest(id, options, callback)`
* `getHARData(id, options, callback)`
* `getPageSpeedData(id, options, callback)`
* `getUtilizationData(id, options, callback)`
* `getRequestData(id, options, callback)`
* `getTimelineData(id, options, callback)`
* `getNetLogData(id, options, callback)`
* `getConsoleLogData(id, options, callback)`
* `getWaterfallImage(id, options, callback)`
* `getScreenshotImage(id, options, callback)`
* `listen(port, callback)`
* `scriptToString(script)`

### Parameters
* **id**: test ID string (_required_)
* **options**: parameters object, see below (_optional_)
* **callback**: the callback function(error, data) (_required_)
* **url_or_script**: decoded url or script string (_required_)
* **port**: port number \[default: 7791\] (_optional_)
* **script**: script array in the form

```javascript
[
  {command1: 'value1', 'value2', ... , 'valueN'},
  {command2: 'value1', 'value2', ... , 'valueN'},
  ...
  {commandN: 'value1', 'value2', ... , 'valueN'}
]
```

#### Notes

* `getWaterfallImage` and `getScreenshotImage` callback function has a third parameter `info` which is an object with `{type: 'image/jpeg or png', encoding: 'utf8 or binary'}`
* `scriptToString` script array values 1-N are optional

### Options
#### Common (works for all methods with `options` parameter)
* **dryRun**: _Boolean_, if `true`, method does not make an actual request to the API Server but rather returns an object with `url` which contains the actual URL to make the GET request to WebPageTest API Server
* **server**: _String_, if specified, overrides the WebPageTest server informed in the constructor only for that method call

#### Test (works for `runTest` method only)
* **key**: _String_, API key (if assigned). Contact the WebPageTest server administrator for a key if required
* **location**: _String_, location to test from
* **runs**: _Number_, number of test runs [1]
* **firstViewOnly**: _Boolean_, skip the Repeat View test
* **label**: _String_, label for the test
* **private**: _Boolean_, keep the test hidden from the test log
* **video**: _Boolean_, capture video
* **connectivity**: _String_, connectivity profile (DSL|FIOS|Dial|custom) [DSL]
* **domElement**: _String_, DOM element to record for sub-measurement
* **connections**: _Number_, override the number of concurrent connections
* **stopAtDocumentComplete**: _Boolean_, force the test to stop at window.onload
* **sensitive**: _Boolean_, discard script and http headers in the result
* **block**: _[String]_, array of string of urls to block (substring match)
* **login**: _String_, username for authenticating tests (http authentication)
* **password**: _String_, password for authenticating tests (http authentication)
* **authenticationType**: _Number_, type of authentication: 0 = Basic, 1 = SNS [0]
* **requestId**: _String_, echo request ID, useful to track asynchronous requests
* **notifyEmail**: _String_, e-mail address to notify with the test results
* **pingback**: _String_, URL to ping when the test is complete (the test ID will be passed as an "id" parameter)
* **bandwidthDown**: _String_, download bandwidth in Kbps (used when specifying a custom connectivity profile)
* **bandwidthUp**: _String_, upload bandwidth in Kbps (used when specifying a custom connectivity profile)
* **latency**: _String_, first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)
* **packetLossRate**: _Number_, packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)
* **tcpDump**: _Boolean_, enable tcpdump capture
* **disableOptimization**: _Boolean_, disable optimization checks (for faster testing)
* **disableScreenshot**: _Boolean_, disable screen shot capturing
* **disableHTTPHeaders**: _Boolean_, disable saving of the http headers (as well as browser status messages and CPU utilization)
* **fullResolutionScreenshot**: _Boolean_, save a full-resolution version of the fully loaded screen shot as a PNG
* **jpegQuality**: _Number_, jpeg compression level (30-100) for the screen shots and video capture
* **disableJavaScript**: _Boolean_, disable javascript (IE, Chrome, Firefox)
* **ignoreSSL**: _Boolean_, ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc
* **disableCompatibilityView**: _Boolean_, forces all pages to load in standards mode (IE only)
* **saveResponseBodies**: _Boolean_, save response bodies for text resources
* **keepOriginalUserAgent**: _Boolean_, do not add PTST to the original browser User Agent string
* **minimumDuration**: _String_, minimum test duration in seconds
* **blockAds**: _Boolean_, block ads defined by adblockrules.org
* **aftRenderingTime**: _Boolean_, (experimental) measure above-the-fold rendering time
* **timeline**: _Boolean_, capture Developer Tools Timeline (Chrome only)
* **netLog**: _Boolean_, capture Network Log (Chrome only)
* **spof**: _[String]_, array of string of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests

#### Run (works for `getPageSpeedData`, `getUtilizationData`, `getRequestData`, `getTimelineData`, `getNetLogData`, `getConsoleLogData`, `getWaterfallImage` and `getScreenshotImage` methods)
* **run**: _Number_, the test run number for multiple runs tests (default: 1, first test)
* **repeatView**: _Boolean_, if `true` returns the repeat view (cached) data

#### Image (works for `getWaterfallImage` and `getScreenshotImage` methods)
* **thumbnail**: _Boolean_, returns the thumbnail of actual image
* **dataURI**: _Boolean_, returns the base64 string representation (inline) of actual image

#### Screenshot (works for `getScreenshotImage` method only)
* **fullResolution**: _Boolean_, returns the full resolution screenshot in PNG format if available
* **startRender**: _Boolean_, returns the page screenshot at the Start Render point (i.e.: when something was first displayed on screen)
* **documentComplete**: _Boolean_, returns the page screenshot at the Document Complete point (i.e.: when `window.onload` was fired)

### Examples

#### 1. Instantiating
```javascript
var WebPageTest = require('webpagetest');

var wpt = new WebPageTest('my-wpt.foo.com'); // default: www.webpagetest.org
var wptPublic = new WebPageTest('www.webpagetest.org', 'MY_API_KEY');
```

#### 2. Get available locations
```javascript
wpt.getLocations(function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

#### 3. Run test on http://twitter.com/marcelduran from San Jose on IE9
```javascript
wpt.runTest('http://twitter.com/marcelduran', {location: 'SanJose_IE9'}, function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

#### 4. Check current test status
```javascript
wpt.getTestStatus('121025_PT_N8K', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

#### 5. Get test results
```javascript
wpt.getTestResults('121025_PT_N8K', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

#### 6. Get test waterfall thumbnail from repeat view as data URI
```javascript
wpt.getWaterfallImage('121025_PT_N8K', {
  thumbnail: true,
  repeatView: true,
  dataURI: true
}, function (err, data, info) {
    if (err) throw err;
    console.log(data, info);
  }
);
```

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
$ curl http://localhost:8080/test/twitter.com/?locations=SanJose_IE9
```

#### Notes
* port _8080_ is optional, default port is _7791_
* `wpt.foo.com` is overriding the default `www.webpagetest.org` server but can still be overridden with `server` option

### Module
```javascript
var server = wpt.listen(8080, function(err, data) {
  if (err) throw err;
  console.log('listening on ' + data.url);
}); // listen on port 8080 (optional), default port is 7791

setTimeout(function() {
  server.close(function() {
    console.log('listening done');
  });
}, 10000); // wait for 10s before stop listening
```

## Issues

Have a bug/feature request? Please create an issue here on GitHub!

https://github.com/marcelduran/webpagetest-api/issues

## Author

**Marcel Duran**

+ http://github.com/marcelduran

## License

Copyright 2012 Twitter, Inc. and other contributors

Licensed under the [MIT License](http://github.com/marcelduran/webpagetest-api/raw/master/LICENSE)
