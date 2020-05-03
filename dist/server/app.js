"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const ILDAFile_1 = __importDefault(require("./shared/ILDAFile"));
const stream_1 = require("stream");
const converter_1 = __importDefault(require("./converter/converter"));
const app = express_1.default();
app.set('view engine', 'pug');
app.set('views', 'dist/views/dynamic');
app.use(express_1.default.static('dist/client'));
app.use(express_fileupload_1.default({
    limits: {
        fileSize: 5 * 1000 * 1000
    },
    abortOnLimit: true,
    debug: false
}));
app.post('/convert', (req, res) => {
    let files = req.files;
    if (!files) {
        res.status(200).send("Required Values as FormData: \n" +
            "  'data': File\n" +
            "Optional\n" +
            "  'resolution': number (default: 128)\n" +
            "  'lineWidth': number (default: 1)\n" +
            "  'fps': number (default: 25)\n" +
            "  'fileFormat': string (Currently only 'GIF' is supported)\n");
        return;
    }
    let fileName = files.data.name;
    let bufferData = files.data.data;
    let ildaFile = new ILDAFile_1.default(fileName, bufferData);
    console.log('received file ' + fileName);
    let settings = {
        resolution: 128,
        lineWidth: 1,
        fps: 25,
        fileFormat: 'GIF'
    };
    if (req.body) {
        if (req.body.resolution) {
            if (isNaN(parseInt(req.body.resolution))) {
                let msg = 'Invalid resolution, "' + req.body.resolution + '" is not a number';
                console.log(msg);
                res.status(400).send(msg);
                return;
            }
            settings.resolution = req.body.resolution ? clamp(parseInt(req.body.resolution), 16, 512) : settings.resolution;
        }
        if (req.body.lineWidth) {
            if (isNaN(parseFloat(req.body.lineWidth))) {
                let msg = 'Invalid linewidth, "' + req.body.lineWidth + '" is not a number';
                console.log(msg);
                res.status(400).send(msg);
                return;
            }
            settings.lineWidth = req.body.lineWidth ? clamp(parseFloat(req.body.lineWidth), 0.1, 10) : settings.lineWidth;
        }
        if (req.body.fps) {
            if (isNaN(parseInt(req.body.fps))) {
                let msg = 'Invalid fps, "' + req.body.fps + '" is not a number';
                console.log(msg);
                res.status(400).send(msg);
                return;
            }
            settings.fps = req.body.fps ? clamp(parseInt(req.body.fps), 1, 50) : settings.fps;
        }
        if (req.body.fileFormat) {
            settings.fileFormat = req.body.fileFormat ? req.body.fileFormat : settings.fileFormat;
        }
    }
    console.log('starting conversion process with settings:', settings);
    converter_1.default(ildaFile.pointData, settings, (data, error) => {
        if (error) {
            console.log('conversion failed', error);
            res.status(400).send(error.message);
            return;
        }
        console.log('conversion successful, sending file...\n\n');
        let fileString = '';
        let input = fs_1.default.createReadStream('totalConversions.json');
        input.addListener('data', (chunk) => {
            fileString += Buffer.from(chunk).toString();
        });
        input.addListener('end', () => {
            let json = JSON.parse(fileString);
            json.count++;
            fs_1.default.createWriteStream('totalConversions.json').write(JSON.stringify(json), 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Total Conversions:', json.count);
            });
        });
        if (settings.fileFormat == 'GIF') {
            let buffer = data;
            let readStream = new stream_1.Stream.PassThrough();
            readStream.end(buffer);
            readStream.pipe(res);
        }
        if (settings.fileFormat == 'PNG' || settings.fileFormat == 'JPG') {
            let archive = data;
            archive.pipe(res);
        }
    });
});
app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082');
});
function clamp(val, min, max) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
