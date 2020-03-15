"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultColorIndex_1 = __importDefault(require("./defaultColorIndex"));
function drawFrame(ctx, drawData, frame, settings) {
    ctx.clearRect(0, 0, settings.resolution, settings.resolution);
    ctx.lineWidth = settings.lineWidth;
    for (let i = 1; i < drawData[frame].length; i++) {
        let startPoint = drawData[frame][i - 1];
        let nextPoint = drawData[frame][i + 0];
        if (startPoint.statusCode == 64)
            continue;
        if (nextPoint.statusCode == 64)
            continue;
        let x1 = (startPoint.x + 32768) / 65535 * settings.resolution;
        let y1 = (1 - (startPoint.y + 32768) / 65535) * settings.resolution;
        let x2 = (nextPoint.x + 32768) / 65535 * settings.resolution;
        let y2 = (1 - (nextPoint.y + 32768) / 65535) * settings.resolution;
        let r, g, b;
        if (startPoint.colorIndex) {
            let ci = startPoint.colorIndex % 64;
            r = defaultColorIndex_1.default[ci].r;
            g = defaultColorIndex_1.default[ci].g;
            b = defaultColorIndex_1.default[ci].b;
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
}
exports.default = drawFrame;
