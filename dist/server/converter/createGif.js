"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drawFrame_1 = __importDefault(require("../shared/drawFrame"));
const GIFEncoder = require('gif-encoder-2');
function createGIF(ctx, drawData, totalFrames, settings, callback) {
    let encoder = new GIFEncoder(settings.resolution, settings.resolution, 'neuquant', false, totalFrames);
    encoder.setFrameRate(settings.fps);
    encoder.setQuality(10);
    encoder.start();
    for (let frame = 0; frame < totalFrames; frame++) {
        drawFrame_1.default(ctx, drawData, frame, settings);
        encoder.addFrame(ctx);
        console.log(Math.round(frame / (totalFrames - 1) * 10000) / 100);
    }
    encoder.finish();
    let buffer = encoder.out.getData();
    callback.call(null, buffer);
}
exports.default = createGIF;
