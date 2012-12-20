var
  vows   = require('vows'),
  assert = require('assert'),
  fs     = require('fs'),
  path   = require('path'),

  parse  = require('../lib/jsonml.js').parse;

var
  simpleXHTMLData = [ "ul",
    [ "li", { "style" : "color:red" }, "First Item" ],
    [ "li", { "title" : "Some hover text.", "style" : "color:green" }, "Second Item" ],
    [ "li", [ "span", { "class" : "code-example-third" }, "Third" ], " Item" ]
  ],

  complicatedXHTMLData = [ "table", { "class" : "MyTable", "style" : "background-color:yellow" },
    [ "tr",
      [ "td", { "class" : "MyTD", "style" : "border:1px solid black" }, "#5D28D1" ],
      [ "td", { "class" : "MyTD", "style" : "background-color:red" }, "Example text here" ]
    ],
    [ "tr",
      [ "td", { "class" : "MyTD", "style" : "border:1px solid black" }, "#AF44EF" ],
      [ "td", { "class" : "MyTD", "style" : "background-color:green" }, "127310656" ]
    ],
    [ "tr",
      [ "td", { "class" : "MyTD", "style" : "border:1px solid black" }, "#AAD034" ],
      [ "td", { "class" : "MyTD", "style" : "background-color:blue" }, "\u00A0",
        ["span", { "style" : "background-color:maroon" }, "\u00A9" ],
        "\u00A0"
      ]
    ],
    [ "tr",
      [ "td", { "class" : "MyTD", "style" : "border:1px solid black" }, "#F00BA5" ],
      [ "td", { "class" : "MyTD", "style" : "background-color:cyan" }, "foo&bar" ]
    ]
  ];

function _testXHTML(filename, data) {
  return {
    'when reading a file first': {
      topic: function() {
        fs.readFile(path.join(__dirname, filename), this.callback);
      },

      'should read it without error': assert.isNull,

      'should parse it without error': function (err, data) {
        assert.doesNotThrow(function() {
          parse(data);
        }, Error);
      },

      'then parsing the data': {
        topic: function(data) {
          return parse(data.toString());
        },

        'should be valid': function(jsonml) {
          assert.deepEqual(jsonml, data);
        }
      }
    }
  };
}

vows.describe('Simple test')
  .addBatch(_testXHTML('simple-snippet.xhtml', simpleXHTMLData))
  .addBatch(_testXHTML('complicated-snippet.xhtml', complicatedXHTMLData))
  .export(module);
