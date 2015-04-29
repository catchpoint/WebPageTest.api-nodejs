/**
 * Copyright (c) 2013, Twitter Inc.
 * Copyright (c) 2015, Google Inc.
 * Copyright (c) 2015, Marcel Duran and other contributors
 * Released under the MIT License
 */

var fs = require('fs'),
    Mocha = require('mocha'),
    assert = require('assert');

function buildSuite(defaults, tests) {
  describe(defaults.suiteName || 'WebPageTest', function() {
    tests.forEach(function(test) {
      it(test.text, function() {
        if (test.result instanceof Error) {
          return assert.ifError(test.result);
        }
        assert(test.result);
      });
    });
  });
}

function parseSpecs(data) {
  var specs;

  // already an object
  if (typeof data === 'object') {
    return data;
  }

  // from file
  if (fs.existsSync(data) && fs.statSync(data).isFile()) {
    data = fs.readFileSync(data, 'utf8');
  }

  // from string
  try {
    specs = JSON.parse(data);
  } catch (e) {
    return new Error('SpecsParserError: ' + e.message);
  }

  return specs;
}

function buildTest(metric, spec, actual, defaults) {
  var operation, expected, result, text;

  // text
  text = defaults.text || spec.text ||
    '{metric}: {actual} should be {operation} {expected}';

  // operation
  if (typeof spec !== 'object') {
    operation = defaults.operation || '<';
    expected = spec;
  } else {
    if ('max' in spec) {
      operation = '<';
      expected = spec.max;
    }
    if ('min' in spec) {
      if (!operation) {
        operation = '>';
        expected = spec.min;
      } else {
        operation = '<>';
        expected = [spec.max, spec.min];
      }
    }
  }

  // test
  switch (operation) {
    case '<':
      result = actual < expected;
      operation = 'less than';
      break;
    case '>':
      result = actual > expected;
      operation = 'greater than';
      break;
    case '<>':
      result = actual < expected[0] && actual > expected[1];
      operation = 'less than ' + expected[0] + ' and greater than';
      expected = expected[1];
      break;
    default:
      result = actual === expected;
      operation = 'equal to';
  }

  // result
  text = text
    .replace('{metric}', metric)
    .replace('{actual}', actual)
    .replace('{operation}', operation)
    .replace('{expected}', expected);

  return {text: text, result: result};
}

function specsRunner(specs, reporter, callback, err, data) {
  var defaults = {},
      tests = [],
      path = [];

  // bail if test not complete
  if (!err && (!data || data.statusCode !== 200)) {
    return callback(err, data);
  }

  function traverse(specs, data) {
    Object.keys(specs).forEach(function(key) {
      // bail on default
      if (key === 'defaults' && !path.length) {
        return;
      }

      path.push(key);
      if (data[key] === undefined || data[key] === null) {
        tests.push({
          text: path.join('.'),
          result: new Error('not found')
        });
        path.pop();
        return;
      }

      var spec = specs[key];
      if (typeof spec === 'object' && !spec.min && !spec.max) {
        traverse(spec, data[key]);
      } else if(typeof spec === 'number' && Array.isArray(data[key])) {
          tests.push(
            buildTest(path.join('.'), spec, data[key].length, defaults));
          path.pop();
      } else {
        tests.push(buildTest(path.join('.'), spec, data[key], defaults));
        path.pop();
      }
    });
  }

  // parse specs
  specs = parseSpecs(specs);

  // error handling
  if (specs instanceof Error) {
    err = err || specs;
  } else if (!(data && data.data)) {
    err = err || new Error('no data');
  }

  if (err) {
    tests.push({text: err.message, result: err});
  } else {
    defaults = specs.defaults || {};
    traverse(specs, data.data);
  }

  // run mocha suite
  var mocha = new Mocha({reporter: reporter});
  mocha.suite.emit('pre-require', global, null, mocha);
  buildSuite(defaults, tests);
  mocha.run(callback || function(failures) {
    process.exit(failures);
  });
}

module.exports = specsRunner;
