"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = express_1.default();
app.set('view engine', 'pug');
app.set('views', 'dist/views/dynamic');
app.use(express_1.default.static('dist/client'));
app.use(express_fileupload_1.default({
    limits: {
        filesize: 8 * 1024 * 1024 * 1
    }
}));
app.post('/upload', (req, res) => {
    if (req.files) {
        let ildaFile = req.files.ilda;
        let name = ildaFile.name;
        let data = ildaFile.data;
        return res.status(200).send({
            message: 'Recieved file ' + name,
            data: data
        });
    }
    else {
        return res.status(400).send({
            message: 'Error uploading file'
        });
    }
});
app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082');
});
