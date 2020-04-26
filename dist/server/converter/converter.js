"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const createGIF_1 = __importDefault(require("./createGIF"));
function converter(drawData, settings, callback) {
    let canvas = canvas_1.createCanvas(settings.resolution, settings.resolution);
    let ctx = canvas.getContext('2d');
    let frames = Object.keys(drawData);
    switch (settings.fileFormat) {
        case 'GIF':
            createGIF_1.default(ctx, drawData, frames.length, settings, callback);
            break;
        default:
            let msg = 'Invalid fileformat, "' + settings.fileFormat + '"';
            callback.call(null, null, { message: 'Invalid fileformat, "' + settings.fileFormat + '"' });
    }
}
exports.default = converter;
