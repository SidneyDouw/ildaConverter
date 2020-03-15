import express from 'express'
import fileupload from 'express-fileupload'

import ILDAFile from './shared/ILDAFile'
import createGif from './converter/createGif'
import { Stream } from 'stream'

const app = express()


// Pug Setup

app.set('view engine', 'pug')
app.set('views', 'dist/views/dynamic')


// Routes

app.use(express.static('dist/client'))
app.use(fileupload({
    limits: {
        filesize: 8 * 1024 * 1024 * 1
    }
}))

app.post('/convertToGif', (req, res) => {

    let files = req.files as any

    if (files) {

        let fileName = files.data.name as string
		let fileSize = files.data.size as number
        let bufferData = files.data.data as Buffer

        let resolution = 256
        let lineWidth = 1
        let fps = 12

        if (req.body) {

            resolution = req.body.resolution ? parseInt(req.body.resolution) : resolution
            lineWidth = req.body.lineWidth ? parseFloat(req.body.lineWidth) : lineWidth
            fps = req.body.fps ? parseInt(req.body.fps) : fps
        
        }

        console.log(files, resolution, lineWidth, fps)
        
        let ildaFile = new ILDAFile(fileName, bufferData)

        createGif(ildaFile.pointData, {
            resolution: resolution,
            lineWidth: lineWidth,
            fps: fps
        }, (buffer: Buffer) => {

            let readStream = new Stream.PassThrough()
            readStream.end(buffer)
          
            res.set('Content-Type', 'application/octet-stream')
            res.set('Content-Disposition', 'attachment; filename=' + fileName.replace('.ild', '.gif'))
            res.set('Content-Length', buffer.length + '')
          
            readStream.pipe(res)

        })        
    }


})


app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082')
})