## WebPageTest API Wrapper for NodeJS [![Build Status](https://secure.travis-ci.org/marcelduran/webpagetest-api.png?branch=master)](http://travis-ci.org/marcelduran/webpagetest-api)

[WebPageTest API Wrapper](http://github.com/marcelduran/webpagetest-api) is a [NPM](http://npmjs.org) package that wraps [WebPageTest](http://code.google.com/p/webpagetest/) API for [NodeJS](http://nodejs.org) as a module and a command-line tool.

## Getting started

```bash
$ npm install webpagetest -g
```

## Basics

```javascript
var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org');

wpt.runTest({url: 'http://twitter.com/marcelduran'}, function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

## Issues

Have a bug/feature request? Please create an issue here on GitHub!

https://github.com/marcelduran/webpagetest-api/issues

## Author

**Marcel Duran**

+ http://github.com/marcelduran

## License

Copyright 2012 Twitter, Inc.

Licensed under the [MIT License](http://github.com/marcelduran/webpagetest-api/raw/master/LICENSE)
