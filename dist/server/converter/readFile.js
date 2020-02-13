"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileStructures_1 = __importDefault(require("./fileStructures"));
function readFile(data, callback) {
    let error = null;
    let drawData = {};
    if (data.length < 32) {
        error = 'Not an ILDA file';
        callback(error, null);
        return;
    }
    let byteOffset = 0;
    while (byteOffset < data.length) {
        let headerValues;
        for (let name in fileStructures_1.default.header) {
            let datatype = fileStructures_1.default.header[name].type;
            let start = fileStructures_1.default.header[name].range[0] + byteOffset;
            let end = fileStructures_1.default.header[name].range[1] + byteOffset;
            let buffer = data.slice(start, end);
            headerValues[name] = convertByteValue(buffer, datatype);
        }
        byteOffset += 32;
        if (headerValues.dataRecords > 0) {
            drawData[headerValues.frame] = [];
        }
        else {
            break;
        }
        if (headerValues.format != 'ILDA') {
            error = 'Not an ILDA file';
            console.log(error);
            callback(error, null);
            return;
        }
        console.log('Format: ' + headerValues.formatCode + ', frame ' + headerValues.frame + ' of ' + headerValues.length);
        let pointStructure = fileStructures_1.default['ilda_' + headerValues.formatCode];
        for (let pointIndex = 0; pointIndex < headerValues.dataRecords; pointIndex++) {
            let pointValues = {};
            for (let name in pointStructure) {
                let datatype = pointStructure[name].type;
                let start = pointStructure[name].range[0] + byteOffset;
                let end = pointStructure[name].range[1] + byteOffset;
                let buffer = data.slice(start, end);
                pointValues[name] = convertByteValue(buffer, datatype);
            }
            byteOffset += 8;
            drawData[headerValues.frame][pointIndex] = pointValues;
        }
    }
    console.log('reached end of file');
    callback(error, drawData);
}
exports.default = readFile;
function convertByteValue(buffer, type) {
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
