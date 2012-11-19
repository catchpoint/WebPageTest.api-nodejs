# JsonML

[JSON Markup Language][1] library for [node.js][2].

[![Build Status](https://secure.travis-ci.org/raszi/node-jsonml.png?branch=master)](http://travis-ci.org/raszi/node-jsonml)

## About

This is a simple library implements the array specification of the JsonML library.

*Only* parsing is supported yet.

## Usage

```javascript
var
  fs    = require('fs'),
  parse = require('jsonml').parse;

var jsonML = parse(fs.readFileSync('myfile.xml'));
```

[1]: http://jsonml.org/
[2]: http://nodejs.org/
