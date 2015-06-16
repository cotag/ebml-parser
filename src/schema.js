export class EBMLParserSchema {
    constructor() {
        this.schema = {};
    }

    add(id, name, dataType) {
        var type = {name, dataType};
        if (dataType == 'master')
            type.container = true;
        this.schema[id] = type;
    }

    type(id) {
        return this.schema[id];
    }
}

export var EBMLParserWebMSchema = new EBMLParserSchema();
var webm = EBMLParserWebMSchema;
webm.add(0x1C53BB6B, 'Cues',          'master');      // lvl. 1
webm.add(0xBB, 'CuePoint',            'master');      // lvl. 2
webm.add(0xB3, 'CueTime',             'uinteger');    // lvl. 3
webm.add(0xB7, 'CueTrackPositions',   'master');      // lvl. 3
webm.add(0xF7, 'CueTrack',            'uinteger');    // lvl. 4
webm.add(0xF1, 'CueClusterPosition',  'uinteger');    // lvl. 4
