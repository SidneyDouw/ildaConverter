"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let header = {
    format: {
        type: 'string',
        range: [0, 4]
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
};
let ilda_0 = {
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
let ilda_1 = {
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
let ilda_2 = {
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
let ilda_4 = {
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
let ilda_5 = {
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
let fileStructure = {
    header,
    ilda_0,
    ilda_1,
    ilda_2,
    ilda_4,
    ilda_5
};
exports.default = fileStructure;
