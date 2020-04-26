"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const archiver_1 = __importDefault(require("archiver"));
const drawFrame_1 = __importDefault(require("../shared/drawFrame"));
function createPNG(ctx, drawData, totalFrames, settings, callback) {
    let frame = 0;
    let archive = archiver_1.default('zip', {
        zlib: { level: 9 }
    });
    archive.on('finish', () => {
        callback.call(null, archive);
    });
    archive.on('progress', () => {
        frame++;
        if (frame < totalFrames - 1) {
            drawFrameRecursively(archive, ctx, drawData, frame + 1, totalFrames, settings, callback);
        }
        else {
            archive.finalize();
        }
    });
    archive.on('error', (err) => {
        console.log(err);
    });
    drawFrameRecursively(archive, ctx, drawData, frame, totalFrames, settings, callback);
}
exports.default = createPNG;
function drawFrameRecursively(archive, ctx, drawData, frame, totalFrames, settings, callback) {
    drawFrame_1.default(ctx, drawData, frame, settings);
    archive.append(ctx.canvas.createPNGStream(), { name: 'test_' + frame + '.png' });
    console.log(Math.round(frame / (totalFrames - 1) * 10000) / 100);
}
