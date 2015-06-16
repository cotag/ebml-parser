var assert = require('assert');
var fs = require('fs');
var EBMLParser = require('../src/parser.js').EBMLParser;
var schema = require('../src/schema.js').EBMLParserWebMSchema;

describe('Parser', function() {
    var nodeBuffer = fs.readFileSync('test/cues.ebml');
    var arrayBuffer = new Uint8Array(nodeBuffer).buffer;
    var parser = new EBMLParser(arrayBuffer, schema);

    it('should have a single Cues element', function() {
        assert.equal(1, parser.elements.length);
        assert.equal('Cues', parser.elements[0].meta.name);
    });

    it('should load 34 CuePoints', function() {
        assert.equal(34, parser.elements[0].children.length);
    });

    it('should parse UInteger values correctly', function() {
        var cuePoint = parser.elements[0].children[1];
        var cueTime = cuePoint.children[0];
        var cueClusterPos = cuePoint.children[1].children[1];
        assert.equal(5005, cueTime.value);
        assert.equal(245848, cueClusterPos.value);
    });
});
