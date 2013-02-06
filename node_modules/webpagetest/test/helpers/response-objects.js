/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var fs = require('fs'),
    path = require('path');

var PATH_OBJECTS = path.join(__dirname, '../fixtures/objects');

var reExtensions = /^\.(?:json|txt)$/i,
    reJSONExt = /^\.json$/i,
    reEOFNewLine = /\s+$/;

var objects = {};

fs.readdirSync(PATH_OBJECTS).forEach(function eachFile(file) {
  var content, name,
      ext = path.extname(file);

  if (!reExtensions.test(ext)) {
    return;
  }

  name = path.basename(file, ext);
  content = fs.readFileSync(path.join(PATH_OBJECTS, file), 'utf8');
  content = content.replace(reEOFNewLine, '');

  if (reJSONExt.test(ext)) {
    try {
      content = JSON.parse(content);
    } catch (ex) {
      content = {error: ex};
    }
  }

  objects[name] = content;
});

module.exports = objects;
