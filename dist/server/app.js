"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ILDAFile_1 = __importDefault(require("./shared/ILDAFile"));
const createGif_1 = __importDefault(require("./converter/createGif"));
const stream_1 = require("stream");
const app = express_1.default();
app.set('view engine', 'pug');
app.set('views', 'dist/views/dynamic');
app.use(express_1.default.static('dist/client'));
app.use(express_fileupload_1.default({
    limits: {
        filesize: 8 * 1024 * 1024 * 1
    }
}));
app.post('/convertToGif', (req, res) => {
    let files = req.files;
    if (files) {
        let fileName = files.data.name;
        let fileSize = files.data.size;
        let bufferData = files.data.data;
        let resolution = 256;
        let lineWidth = 1;
        let fps = 12;
        if (req.body) {
            resolution = req.body.resolution ? parseInt(req.body.resolution) : resolution;
            lineWidth = req.body.lineWidth ? parseFloat(req.body.lineWidth) : lineWidth;
            fps = req.body.fps ? parseInt(req.body.fps) : fps;
        }
        console.log(files, resolution, lineWidth, fps);
        let ildaFile = new ILDAFile_1.default(fileName, bufferData);
        createGif_1.default(ildaFile.pointData, {
            resolution: resolution,
            lineWidth: lineWidth,
            fps: fps
        }, (buffer) => {
            let readStream = new stream_1.Stream.PassThrough();
            readStream.end(buffer);
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename=' + fileName.replace('.ild', '.gif'));
            res.set('Content-Length', buffer.length + '');
            readStream.pipe(res);
        });
    }
});
app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082');
});
