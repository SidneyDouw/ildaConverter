"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const headerStructure = {
    format: {
        type: 'string',
        range: [0, 4]
    },
    reserved_1: {
        type: 'uint',
        range: [4, 7],
    },
    formatCode: {
        type: 'uint',
        range: [7, 8]
    },
    frameName: {
        type: 'string',
        range: [8, 16]
    },
    company: {
        type: 'string',
        range: [16, 24]
    },
    dataRecords: {
        type: 'uint16',
        range: [24, 26]
    },
    frame: {
        type: 'uint16',
        range: [26, 28]
    },
    length: {
        type: 'uint16',
        range: [28, 30]
    },
    projector: {
        type: 'uint',
        range: [30, 31]
    },
    reserved_2: {
        type: 'uint',
        range: [31, 32]
    }
};
const ilda_0 = {
    x: {
        type: 'int16',
        range: [0, 2]
    },
    y: {
        type: 'int16',
        range: [2, 4]
    },
    z: {
        type: 'int16',
        range: [4, 6]
    },
    statusCode: {
        type: 'uint',
        range: [6, 7]
    },
    colorIndex: {
        type: 'uint',
        range: [7, 8]
    },
};
const ilda_1 = {
    x: {
        type: 'int16',
        range: [0, 2]
    },
    y: {
        type: 'int16',
        range: [2, 4]
    },
    statusCode: {
        type: 'uint',
        range: [4, 5]
    },
    colorIndex: {
        type: 'uint',
        range: [5, 6]
    },
};
const ilda_2 = {
    r: {
        type: 'uint',
        range: [0, 1]
    },
    g: {
        type: 'uint',
        range: [1, 2]
    },
    b: {
        type: 'uint',
        range: [2, 3]
    }
};
const ilda_4 = {
    x: {
        type: 'int16',
        range: [0, 2]
    },
    y: {
        type: 'int16',
        range: [2, 4]
    },
    z: {
        type: 'int16',
        range: [4, 6]
    },
    statusCode: {
        type: 'uint',
        range: [6, 7]
    },
    b: {
        type: 'uint',
        range: [7, 8]
    },
    g: {
        type: 'uint',
        range: [8, 9]
    },
    r: {
        type: 'uint',
        range: [9, 10]
    },
};
const ilda_5 = {
    x: {
        type: 'int16',
        range: [0, 2]
    },
    y: {
        type: 'int16',
        range: [2, 4]
    },
    statusCode: {
        type: 'uint',
        range: [4, 5]
    },
    b: {
        type: 'uint',
        range: [5, 6]
    },
    g: {
        type: 'uint',
        range: [6, 7]
    },
    r: {
        type: 'uint',
        range: [7, 8]
    },
};
const ilda_point_structure = {
    ilda_0,
    ilda_1,
    ilda_2,
    ilda_4,
    ilda_5
};
class ILDAFile {
    constructor(filename, bufferData) {
        this.filename = filename;
        this.bufferData = bufferData;
        this.byteOffset = 0;
        this.headerData = [];
        this.pointData = [];
        this.readFile();
    }
    readHeaderOnce() {
        for (let fieldname in headerStructure) {
            let datatype = headerStructure[fieldname].type;
            let start = headerStructure[fieldname].range[0];
            let end = headerStructure[fieldname].range[1];
            let fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype);
            console.log(fieldname, fieldvalue);
        }
    }
    readFile() {
        while (this.byteOffset < this.bufferData.length) {
            this.readHeader();
            this.readPointData();
        }
    }
    readHeader() {
        let header = {};
        let byteRange = 0;
        for (let fieldname in headerStructure) {
            let datatype = headerStructure[fieldname].type;
            let start = headerStructure[fieldname].range[0] + this.byteOffset;
            let end = headerStructure[fieldname].range[1] + this.byteOffset;
            let fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype);
            byteRange += end - start;
            header[fieldname] = fieldvalue;
        }
        this.byteOffset += byteRange;
        this.headerData.push(header);
    }
    readPointData() {
        if (this.byteOffset >= this.bufferData.length)
            return;
        let header = this.headerData[this.headerData.length - 1];
        let pointStructure = ilda_point_structure['ilda_' + header.formatCode];
        let pointArr = [];
        for (let index = 0; index < header.dataRecords; index++) {
            let point = {};
            let byteRange = 0;
            for (let fieldname in pointStructure) {
                let datatype = pointStructure[fieldname].type;
                let start = pointStructure[fieldname].range[0] + this.byteOffset;
                let end = pointStructure[fieldname].range[1] + this.byteOffset;
                let fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype);
                byteRange += end - start;
                point[fieldname] = fieldvalue;
            }
            this.byteOffset += byteRange;
            pointArr.push(point);
        }
        this.pointData.push(pointArr);
    }
    convertBuffer(buffer, type) {
        let returnVal;
        switch (type) {
            case 'string':
                returnVal = buffer.toString();
                break;
            case 'uint':
                returnVal = buffer.readUInt8(0);
                break;
            case 'int':
                returnVal = buffer.readInt8(0);
                break;
            case 'uint16':
                returnVal = buffer.readUInt16BE(0);
                break;
            case 'int16':
                returnVal = buffer.readInt16BE(0);
                break;
            default:
                throw Error('unknown type "' + type + '" in file structure');
        }
        return returnVal;
    }
}
exports.default = ILDAFile;
