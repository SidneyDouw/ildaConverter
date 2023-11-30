import express from 'express'
import fileupload, { UploadedFile } from 'express-fileupload'
import fs from 'fs'
import ILDAFile from './shared/ILDAFile'
import converter from './converter/converter'
import drawSettings from './shared/drawSettings'
import { Image, loadImage } from 'canvas'

const app = express()

// Routes

app.use(express.static('dist/client'))
app.use(
    fileupload({
        limits: {
            fileSize: 30 * 1000 * 1000, //mb
        },
        abortOnLimit: true,
        debug: false,
    }),
)

app.post('/convert', (req, res) => {
    const files = req.files

    if (!files || !files.data) {
        res.status(200).send(
            'Values as FormData: \n' +
                "  'data': File (required)\n" +
                "  'watermark: File'\n" +
                'Values as JSON\n' +
                "  'resolution': number (default: 128)\n" +
                "  'lineWidth': number (default: 1)\n" +
                "  'fps': number (default: 25)\n" +
                "  'fileFormat': string (Currently only 'GIF' is supported)\n" +
                "  'watermark_alpha': number (default: 1)\n",
        )
        return
    }

    //@ts-ignore
    const ILDAfileName = files.data.name
    //@ts-ignore
    const ILDAbufferData = files.data.data

    const ildaFile = new ILDAFile(ILDAfileName, ILDAbufferData)
    console.log('received ILDA file: ' + ILDAfileName)

    handleWatermark(files.watermark).then((watermark) => {
        // Set default settings

        const settings: drawSettings = {
            resolution: 128,
            lineWidth: 1,
            fps: 25,
            fileFormat: 'GIF',
            watermark: watermark,
            watermark_alpha: 1,
        }

        // Update default settings

        if (req.body) {
            if (req.body.resolution) {
                if (isNaN(parseInt(req.body.resolution))) {
                    const msg = 'Invalid resolution, "' + req.body.resolution + '" is not a number'
                    console.log(msg)
                    res.status(400).send(msg)
                    return
                }

                settings.resolution = req.body.resolution
                    ? clamp(parseInt(req.body.resolution), 16, 512)
                    : settings.resolution
            }

            if (req.body.lineWidth) {
                if (isNaN(parseFloat(req.body.lineWidth))) {
                    const msg = 'Invalid linewidth, "' + req.body.lineWidth + '" is not a number'
                    console.log(msg)
                    res.status(400).send(msg)
                    return
                }

                settings.lineWidth = req.body.lineWidth
                    ? clamp(parseFloat(req.body.lineWidth), 0.1, 10)
                    : settings.lineWidth
            }

            if (req.body.fps) {
                if (isNaN(parseInt(req.body.fps))) {
                    const msg = 'Invalid fps, "' + req.body.fps + '" is not a number'
                    console.log(msg)
                    res.status(400).send(msg)
                    return
                }

                settings.fps = req.body.fps ? clamp(parseInt(req.body.fps), 1, 50) : settings.fps
            }

            if (req.body.fileFormat) {
                settings.fileFormat = req.body.fileFormat ? req.body.fileFormat : settings.fileFormat
            }

            if (req.body.watermark_alpha) {
                if (isNaN(parseFloat(req.body.watermark_alpha))) {
                    const msg = 'Invalid watermark_alpha, "' + req.body.watermark_alpha + '" is not a number'
                    console.log(msg)
                    res.status(400).send(msg)
                    return
                }

                settings.watermark_alpha = req.body.watermark_alpha
                    ? clamp(parseFloat(req.body.watermark_alpha), 0, 1)
                    : settings.watermark_alpha
            }
        }

        // Convert

        console.log('starting conversion process with settings:', settings)
        console.log('length:', ildaFile.length)

        converter(ildaFile.pointData, settings, (data, error) => {
            if (error) {
                console.log('conversion failed', error)
                res.status(400).send(error.message)
                return
            }

            console.log('conversion successful, sending file...')

            // Update total conversions

            let fileString = ''
            const input = fs.createReadStream('totalConversions.json')
            input.addListener('data', (chunk) => {
                fileString += Buffer.from(chunk).toString()
            })
            input.addListener('end', () => {
                const json = JSON.parse(fileString)
                json.count++

                fs.createWriteStream('totalConversions.json').write(JSON.stringify(json), 'utf-8', (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log('Total Conversions:', json.count)
                    console.log('\n')
                })
            })

            // res.write('testing')

            // Send converted file

            if (settings.fileFormat == 'GIF') {
                const buffer = data

                // let readStream = new Stream.PassThrough()
                // readStream.end(buffer)
                // readStream.pipe(res)

                res.send(buffer)
            }
        })
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

function handleWatermark(watermark: UploadedFile | UploadedFile[]): Promise<Image | null> {
    return new Promise((resolve) => {
        if (watermark) {
            //@ts-ignore
            const watermarkFileName = watermark.name
            //@ts-ignore
            const watermarkBufferData = watermark.data

            loadImage(watermarkBufferData).then((img) => {
                resolve(img)
            })

            console.log('using watermark: ' + watermarkFileName)
        } else {
            resolve(null)
        }
    })
}
