import express from 'express'
import fileupload from 'express-fileupload'
import fs from 'fs'

import ILDAFile from './shared/ILDAFile'
import { Stream } from 'stream'
import archiver from 'archiver' 

import converter from './converter/converter'
import drawSettings from './shared/drawSettings'

const app = express()


// Pug Setup

app.set('view engine', 'pug')
app.set('views', 'dist/views/dynamic')


// Routes

app.use(express.static('dist/client'))
app.use(fileupload({
    limits: {
        fileSize: 5 * 1000 * 1000   //mb
    },
    abortOnLimit: true,
    debug: false
}))

app.post('/convert', (req, res) => {

    let files = req.files as any

    if (!files) {
        res.status(200).send(
            "Required Values as FormData: \n" +
            "  'data': File\n" +
            "Optional\n" +
            "  'resolution': number (default: 128)\n" +
            "  'lineWidth': number (default: 1)\n" +
            "  'fps': number (default: 25)\n" +
            "  'fileFormat': string (Currently only 'GIF' is supported)\n"
        )
        return
    }


    let fileName = files.data.name as string
    // let fileSize = files.data.size as number
    let bufferData = files.data.data as Buffer

    let ildaFile = new ILDAFile(fileName, bufferData)

    console.log('received file ' + fileName)


    // Set default settings

    let settings: drawSettings = {
        resolution: 128,
        lineWidth: 1,
        fps: 25,
        fileFormat: 'GIF'
    }

    // Update default settings    

    if (req.body) {
        if (req.body.resolution) {

            if (isNaN(parseInt(req.body.resolution))) {
                let msg = 'Invalid resolution, "' + req.body.resolution + '" is not a number'
                console.log(msg)
                res.status(400).send(msg)
                return
            }

            settings.resolution = req.body.resolution ? clamp(parseInt(req.body.resolution), 16, 512) : settings.resolution
        }

        if (req.body.lineWidth) {
            if (isNaN(parseFloat(req.body.lineWidth))) {
                let msg = 'Invalid linewidth, "' + req.body.lineWidth + '" is not a number'
                console.log(msg)
                res.status(400).send(msg)
                return
            }

            settings.lineWidth = req.body.lineWidth ? clamp(parseFloat(req.body.lineWidth), 0.1, 10) : settings.lineWidth
        }

        if (req.body.fps) {
            if (isNaN(parseInt(req.body.fps))) {
                let msg = 'Invalid fps, "' + req.body.fps + '" is not a number'
                console.log(msg)
                res.status(400).send(msg)
                return
            }

            settings.fps = req.body.fps ? clamp(parseInt(req.body.fps), 1, 50) : settings.fps
        }

        if (req.body.fileFormat) {
            settings.fileFormat = req.body.fileFormat ? req.body.fileFormat : settings.fileFormat
        }
    }
    

    // Convert    

    console.log('starting conversion process with settings:', settings)

    converter(ildaFile.pointData, settings, (data: Buffer | archiver.Archiver, error: any) => {

        if (error) {
            console.log('conversion failed', error)
            res.status(400).send(error.message)
            return
        }
        
        console.log('conversion successful, sending file...\n\n')


        // Update total conversions
        
        let fileString = ''
        let input = fs.createReadStream('totalConversions.json')
        input.addListener('data', (chunk) => {
            fileString += Buffer.from(chunk).toString()
        })
        input.addListener('end', () => {

            let json = JSON.parse(fileString)
                json.count++

            fs.createWriteStream('totalConversions.json').write(
                JSON.stringify(json),
                'utf-8',
                (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log('Total Conversions:', json.count)
                }
            )
        })


        // Send converted file

        if (settings.fileFormat == 'GIF') {

            let buffer = data as Buffer

            let readStream = new Stream.PassThrough()
                readStream.end(buffer)
                readStream.pipe(res)

        }

        if (settings.fileFormat == 'PNG' || settings.fileFormat == 'JPG') {

            let archive = data as archiver.Archiver
                archive.pipe(res)

        }

    })        

})


app.listen(8082, () => {
    console.log('Server started. Listening on Port 8082')
})



function clamp(val: number, min: number, max: number) {

    if (val < min) return min
    if (val > max) return max
    return val

}