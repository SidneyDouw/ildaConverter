"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const canvas_1 = require("canvas");
const colorindex_1 = __importDefault(require("./colorindex"));
const GIFEncoder = require('gif-encoder-2');
let canvasWidth = 512;
let canvasHeight = 512;
let lineWidth = 4;
function createImage(drawData, callback) {
    let canvas = canvas_1.createCanvas(canvasWidth, canvasHeight);
    let ctx = canvas.getContext('2d');
    let frames = Object.keys(drawData);
    let encoder = new GIFEncoder(canvasWidth, canvasHeight, 'neuquant', false);
    encoder.setFrameRate(12);
    encoder.setQuality(10);
    encoder.start();
    for (let frame of frames) {
        let pointIndices = Object.keys(drawData[frame]);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.lineWidth = lineWidth;
        for (let i = 0; i < pointIndices.length - 1; i++) {
            let startPoint = drawData[frame][i + 0];
            let nextPoint = drawData[frame][i + 1];
            if (startPoint.statusCode == 64)
                continue;
            let x1 = (startPoint.x + 32768) / 65535 * canvasWidth;
            let y1 = (1 - (startPoint.y + 32768) / 65535) * canvasHeight;
            let x2 = (nextPoint.x + 32768) / 65535 * canvasWidth;
            let y2 = (1 - (nextPoint.y + 32768) / 65535) * canvasHeight;
            let r, g, b;
            if (startPoint.colorIndex) {
                r = colorindex_1.default[startPoint.colorIndex].r;
                g = colorindex_1.default[startPoint.colorIndex].g;
                b = colorindex_1.default[startPoint.colorIndex].b;
            }
            else {
                r = startPoint.r;
                g = startPoint.g;
                b = startPoint.b;
            }
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            ctx.stroke();
        }
        encoder.addFrame(ctx);
        console.log('encoding frame ' + frame);
    }
    encoder.finish();
    let buffer = encoder.out.getData();
    fs_1.default.writeFile('test.gif', buffer, (err) => {
        console.log('saved test.gif');
        callback();
    });
}
exports.default = createImage;
