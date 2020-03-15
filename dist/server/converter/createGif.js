"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const drawFrame_1 = __importDefault(require("../shared/drawFrame"));
const GIFEncoder = require('gif-encoder-2');
function createGif(drawData, settings, callback) {
    let canvas = canvas_1.createCanvas(settings.resolution, settings.resolution);
    let ctx = canvas.getContext('2d');
    let frames = Object.keys(drawData);
    let encoder = new GIFEncoder(settings.resolution, settings.resolution, 'neuquant', false, frames.length);
    encoder.setFrameRate(settings.fps);
    encoder.setQuality(10);
    encoder.start();
    encoder.on('progress', (percent) => {
        console.log(percent);
    });
    for (let frame of frames) {
        drawFrame_1.default(ctx, drawData, parseInt(frame), {
            resolution: settings.resolution,
            lineWidth: settings.lineWidth
        });
        encoder.addFrame(ctx);
    }
    encoder.finish();
    let buffer = encoder.out.getData();
    callback.call(this, buffer);
}
exports.default = createGif;
