var webPageTest = require('../lib/webpagetest');

//webPageTest.config({paths: {testStatus: 'testStatus.php'}});

var wpt = webPageTest('localhost');
//var wpt = webPageTest('www.webpagetest.org');

/*
wpt.getTestStatus('120816_V2_2', function (err, data) {
//wpt.getTestStatus('120920_JB_1', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
}, {dryRun: true});
//*/

//*
//wpt.getTestResults('120917_H9_1', function (err, data) {
wpt.getTestResults('120920_JB_1', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
}, {dryRun: true});
//*/

/*
wpt.getLocations(function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
});
//*/

/*
wpt.runTest({
  url: 'http://twitter.com/marcelduran',
  'location': 'Local_Firefox_Chrome:Chrome',
  label: 'test 123',
  runs: 3,
  firstViewOnly: true
}, function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
});
//*/

//*
wpt.runTest({
  url: 'http://twitter.com/marcelduran',
  'location': 'Local_Firefox_Chrome:Chrome',
  firstViewOnly: true,
  timeline: true,
  netLog: true,
  fullResolutionScreenshot: true
}, function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
}, {dryRun: true});
//*/

/*
wpt.getPageSpeedData('120814_HC_N', function (err, data) {
  if (err) err;
  console.log(JSON.stringify(data, null, 4));
}, {run: 1, repeatView: !true});
//*/

/*
wpt.getHARData('120816_V2_2', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
});
//*/

/*
wpt.getUtilizationData('120917_4R_2', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
}, {run: 1, repeatView: !true});
//*/

/*
//wpt.getRequestData('120914_ER_1', function (err, data) {
//wpt.getRequestData('120917_H9_1', function (err, data) {
wpt.getRequestData('120816_V2_2', function (err, data) {
//wpt.getRequestData('120917_4R_2', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
  Object.keys(data).forEach(function (key) {
    console.log(key + ': ' + data[key].length);
  });
});
//*/

/*
wpt.getTimelineData('120917_XP_3', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
});
//*/

/*
wpt.getNetLogData('120917_XP_3', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 4));
});
//*/

/*
wpt.getWaterfallImage('120917_XP_3', function (err, data) {
  if (err) throw err;
  console.log(data);
  //require('fs').writeFile('wf.png', data, 'binary', function (err) {
  //  if (err) throw err;
  //  console.log('waterfall saved', mimeType);
  //});
}, {run: 1, repeatView: !true, thumbnail: true, dataURI: true});
//*/

/*
//wpt.getScreenshotImage('120920_Q7_4', function (err, data, mimeType) {
wpt.getScreenshotImage('120917_XP_3', function (err, data, mimeType) {
  if (err) throw err;
  require('fs').writeFile('sc.jpg', data, 'binary', function (err) {
    if (err) throw err;
    console.log('screenshot saved', mimeType);
  });
  //console.log(data);
}, {run: 1, repeatView: !true, thumbnail: true, startRender: !true, documentComplete: !true, dataURI: !true, fullResolution: !true, dryRun: true});
//*/
