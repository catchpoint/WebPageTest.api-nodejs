/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var jsonml = require('jsonml'),
    url    = require('url'),
    os     = require('os');

var reNumber = /^[\.\+\-]?[\d\.]+$/,
    reInvalidDec = /(?:\.\d*){2,}/,
    reDec = /\./,
    reLineBreak = /[\n\r]+/g,
    reLastBreak = /\n$/,
    reProtocol = /^https?:\/\//i,
    reIp = /\d+\.\d+\.\d+\.\d+/, // 127.0.0.1

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

        if (len === 2 && !o[a[0]]) {
          if (typeof a[1] !== 'object') {
            o[a[0]] = parseNumber(a[1]);
          } else {
            o[a[0]] = {};
            rec(a[1], o[a[0]]);
          }
        } else if (len >= 2) {
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

  sv = sv.toString();
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
  data = (data || '{}').toString();
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

// Build the RESTful API url call only
function dryRun(config, path) {
  path = url.parse(path, true);

  return {
    url: url.format({
      protocol: config.protocol,
      hostname: config.hostname,
      port: (config.port !== 80 && config.port !== 443 ?
        config.port : undefined),
      pathname: path.pathname,
      query: path.query
    })
  };
}

// Normalize server config
function normalizeServer(server) {
  // normalize hostname
  if (!reProtocol.test(server)) {
    server = 'http://' + server;
  }
  server = url.parse(server);

  return {
    protocol: server.protocol,
    hostname: server.hostname,
    pathname: server.pathname,
    port: parseInt(server.port, 10) || (server.protocol === 'https:' ? 443 : 80)
  };
}

// Normalize localhost and port
function localhost(local, defaultPort) {
  // edge case when hostname:port is not informed via cli
  if (local === undefined || local === 'true') {
    local = [defaultPort];
  } else {
    local = local.toString().split(':');
  }

  return {
    hostname: reIp.test(local[0]) || isNaN(parseInt(local[0], 10)) &&
      local[0] ? local[0] : os.hostname(),
    port: parseInt(local[1] || (!reIp.test(local[0]) && local[0]), 10) ||
      defaultPort
  };
}

// Custom API response Error
function WPTAPIError(code, message) {
  this.name = 'WPTAPIError';
  this.code = code || 0;
  this.message = message || this.name;
}
WPTAPIError.prototype = new Error();
WPTAPIError.prototype.constructor = WPTAPIError;

// Set valid parameter in query
function setQuery(map, options, query) {
  query = query || {};
  options = options || {};

  map.options.forEach(function eachOpts(opt) {
    var nokey = map.nokey && map.nokey.indexOf(opt) > -1;

    Object.keys(opt).forEach(function eachOpt(key) {
      var param = opt[key],
          name = param.name,
          value = options[name] || options[key];

      if (value !== undefined && param.api && !nokey) {
        if (param.array) {
          value = [].concat(value).join(' ');
        }
        query[param.api] = param.bool ? param.invert ?
          (value ? 0 : 1) : (value ? 1 : 0) : value;
      }
    });
  });

  return query;
}

module.exports = {
  xmlToObj: xmlToObj,
  csvToObj: svToObj.bind(null, ',', false),
  tsvToObj: svToObj.bind(null, '\t'),
  netLogParser: netLogParser,
  scriptToString: scriptToString,
  dataURI: dataURI,
  dryRun: dryRun,
  normalizeServer: normalizeServer,
  localhost: localhost,
  setQuery: setQuery,
  WPTAPIError: WPTAPIError
};
