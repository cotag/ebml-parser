'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EBMLParserSchema = (function () {
    function EBMLParserSchema() {
        _classCallCheck(this, EBMLParserSchema);

        this.schema = {};
    }

    _createClass(EBMLParserSchema, [{
        key: 'add',
        value: function add(id, name, dataType) {
            var type = { name: name, dataType: dataType };
            if (dataType == 'master') type.container = true;
            this.schema[id] = type;
        }
    }, {
        key: 'type',
        value: function type(id) {
            return this.schema[id];
        }
    }]);

    return EBMLParserSchema;
})();

exports.EBMLParserSchema = EBMLParserSchema;
var EBMLParserWebMSchema = new EBMLParserSchema();
exports.EBMLParserWebMSchema = EBMLParserWebMSchema;
var webm = EBMLParserWebMSchema;
webm.add(475249515, 'Cues', 'master'); // lvl. 1
webm.add(187, 'CuePoint', 'master'); // lvl. 2
webm.add(179, 'CueTime', 'uinteger'); // lvl. 3
webm.add(183, 'CueTrackPositions', 'master'); // lvl. 3
webm.add(247, 'CueTrack', 'uinteger'); // lvl. 4
webm.add(241, 'CueClusterPosition', 'uinteger'); // lvl. 4