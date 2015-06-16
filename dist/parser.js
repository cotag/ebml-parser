'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EBMLParserBuffer = (function () {
    function EBMLParserBuffer(buffer) {
        _classCallCheck(this, EBMLParserBuffer);

        this.data = new DataView(buffer);
        this.size = this.data.byteLength;
        this.byte = 0;
    }

    _createClass(EBMLParserBuffer, [{
        key: 'readVInt',
        value: function readVInt() {
            var id = arguments[0] === undefined ? false : arguments[0];

            var startByte = this.data.getUint8(this.byte);

            // a variable int is parsed bit by bit. they are variable because they
            // use a variable number of bytes for storage.
            // width: off (0) bits at the start of the first byte represent the
            //        number of trailing bytes are used to store the integer. when
            //        width is 0 only a single byte (the first we read) is used.
            //        when width is 1, the first byte plus one other are used, etc.
            // mark:  a single 1 bit to separate the width from int data
            // data:  the remaining bits of the first byte, plus width * bytes form
            //        the int data (big endian).

            // we avoid using bit operations because they are slow in JS (the
            // original 64bit float gets converted to an int for each operation).
            // because the mark is a 1 we can use equality operations to determine
            // width. when width is 0 (there are no off bits at the start of the
            // first byte, and the mark is in the first bit (7)) startByte will
            // be >= 2 ^ 7. when width is 1, the mark will be stored in bit 6, so
            // startByte will be >= 2 ^ 6 and so on. when startByte is 0, all bits
            // are off, and the width is stored in multiple bytes. numbers this
            // large are not supported.
            if (startByte == 0) throw 'Variable int is too large to parse';

            for (var width = 0; width < 8; width++) {
                if (startByte >= Math.pow(2, 7 - width)) break;
            }

            if (this.byte + width + 1 > this.size) throw 'Missing bytes, not enough data to parse variable int';

            // remove the mark bit for non-id values
            var value = startByte;
            if (!id) value -= Math.pow(2, 7 - width);

            // for each trailing byte: shift the existing bits left by a byte, and
            // add the new byte to the value. again, we don't use bit operations
            // for speed, but also because << is performed on 32bits.
            for (var i = 1; i <= width; i++) {
                value *= Math.pow(2, 8);
                value += this.data.getUint8(this.byte + i);
            }

            this.byte += width + 1;
            return value;
        }
    }, {
        key: 'readUInt',
        value: function readUInt(length) {
            var value = 0;
            for (var i = 0; i < length; i++) {
                value *= Math.pow(2, 8);
                value += this.data.getUint8(this.byte + i);
            }

            this.byte += length;
            return value;
        }
    }]);

    return EBMLParserBuffer;
})();

var EBMLParserElement = (function () {
    function EBMLParserElement() {
        _classCallCheck(this, EBMLParserElement);

        this.id = 0;
        this.start = 0;
        this.size = 0;
        this.meta = null;
        this.value = null;
        this.children = [];
    }

    _createClass(EBMLParserElement, [{
        key: 'setMeta',
        value: function setMeta(schema) {
            this.meta = schema.type(this.id);
        }
    }, {
        key: 'parseElements',
        value: function parseElements(buffer, schema) {
            var end = this.start + this.size;
            while (buffer.byte < end) {
                this.children.push(this.parseElement(buffer, schema));
            }
        }
    }, {
        key: 'parseElement',
        value: function parseElement(buffer, schema) {
            var element = new EBMLParserElement();
            element.start = buffer.byte;
            element.id = buffer.readVInt(true);
            element.size = buffer.readVInt();
            element.setMeta(schema);

            // only containers and UInteger values are supported right now
            if (element.meta.container) element.parseElements(buffer, schema);else element.value = buffer.readUInt(element.size);

            return element;
        }
    }, {
        key: 'name',
        get: function () {
            return this.meta.name;
        }
    }]);

    return EBMLParserElement;
})();

var EBMLParser = (function () {
    function EBMLParser(arrayBuffer, schema) {
        _classCallCheck(this, EBMLParser);

        var buffer = new EBMLParserBuffer(arrayBuffer);
        this.root = new EBMLParserElement();
        this.root.start = 0;
        this.root.size = buffer.size;
        this.root.parseElements(buffer, schema);
    }

    _createClass(EBMLParser, [{
        key: 'elements',
        get: function () {
            return this.root.children;
        }
    }]);

    return EBMLParser;
})();

exports.EBMLParser = EBMLParser;