var WebPageTest = require('webpagetest');
var wpt = new WebPageTest();
wpt.listen(process.env.VCAP_APP_PORT || 3000);
