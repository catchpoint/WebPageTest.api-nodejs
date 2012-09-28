/**
 * Copyright (c) 2012, Twitter Inc. All rights reserved.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

var jsonml = require('jsonml');

var reNumber = /^[\.\+\-]?[\d\.]+$/,
    reInvalidDec = /(?:\.\d*){2,}/,
    reDec = /\./,
    reLineBreak = /[\n\r]+/g,
    reLastBreak = /\n$/,

    TAB = '\t',
    NEWLINE = '\n';

function parseNumber(s) {
  if (typeof s !== 'string' || !reNumber.test(s) || reInvalidDec.test(s)) {
    return s;
  }
  
  return reDec.test(s) ? parseFloat(s, 10) : parseInt(s, 10);
}

function xmlToObj(xml) {
  var obj = {},
      
      rec = function xmlToObjRecursion(a, o) {
        var val, newObj, i,
            len = a.length;
        
        if (len === 2) {
          if (typeof a[1] !== 'object') {
            o[a[0]] = parseNumber(a[1]);
          } else {
            o[a[0]] = {};
            rec(a[1], o[a[0]]);
          }
        } else if (len > 2) {
          if (o[a[0]]) {
            if (!(o[a[0]] instanceof Array)) {
              val = o[a[0]];
              o[a[0]] = [val];
            }
            newObj = {};
            o[a[0]].push(newObj);
          } else {
            o[a[0]] = {};
          }
          for (i = 1, len = a.length; i < len; i += 1) {
            rec(a[i], newObj || o[a[0]]);
          }
        }
      };
  
  rec(jsonml.parse(xml), obj);
  
  return obj;
}

function svToObj(delimiter, headers, sv) {
  var data,
      start = 0,
      obj = {};
  
  delimiter = delimiter || ',';

  if (!sv) {
    return {};
  }

  // keep line breaks consistent as "\n" and remove the very last one
  data = sv.replace(reLineBreak, '\n').replace(reLastBreak, '').split('\n');

  if (!headers) {
    headers = data[0].split(delimiter);
    start = 1;
  }

  // edge case: when response provides headers, 1st 2 rows should be ignored
  if (data[0].split(delimiter)[3] === 'IP Address') {
    start = 2;
  }
  
  headers.forEach(function headersEach(header) {
    obj[header] = [];
  });
  
  data.slice(start).forEach(function dataEach(row) {
    row.split(delimiter).forEach(function rowEach(value, index) {
      if (headers[index]) {
        obj[headers[index]].push(parseNumber(value));
      }
    });
  });
  
  return obj;
}

// Net log has a buggy end of file, attempt to fix
function netLogParser(data) {
  data = data || '{}';
  if (data.slice(data.length - 3) === ',\r\n') {
    data = data.slice(0, data.length - 3) + ']}';
  }

  return JSON.parse(data);
}

// Convert image (binary) into data URI (string)
function dataURI(data) {
  return new Buffer(data || '', 'binary').toString('base64');
}

// Convert script objects into formatted string
function scriptToString(data) {
  var script = [];

  data.forEach(function dataEach(step) {
    var key, value;

    if (typeof step === 'string') {
      script.push(step);
    } else if (typeof step === 'object') {
      key = [Object.keys(step)[0]];
      value = step[key];
      if (value !== undefined && value !== null && value !== '') {
        key = key.concat(value);
      }
      script.push(key.join(TAB));
    }
  });

  return script.join(NEWLINE);
}

module.exports = {
  xmlToObj: xmlToObj,
  csvToObj: svToObj.bind(null, ',', false),
  tsvToObj: svToObj.bind(null, '\t'),
  netLogParser: netLogParser,
  scriptToString: scriptToString
};
