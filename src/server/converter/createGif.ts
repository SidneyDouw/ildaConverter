import fs from 'fs'
import { createCanvas } from 'canvas'
import drawFrame from '../shared/drawFrame'

import { PointData } from '../shared/ILDAFile'

const GIFEncoder = require('gif-encoder-2')


export default function createGif(drawData: PointData[][], settings: {resolution: number, lineWidth: number, fps: number}, callback: Function) {

    // Create canvas and draw and save frames

    let canvas = createCanvas(settings.resolution, settings.resolution)
    let ctx = canvas.getContext('2d')

    let frames = Object.keys(drawData)


    // Create GIF Encoder

    let encoder = new GIFEncoder(settings.resolution, settings.resolution, 'neuquant', false, frames.length)

        // encoder.createReadStream().pipe(fs.createWriteStream('test.gif'))

        encoder.setFrameRate(settings.fps)
        encoder.setQuality(10)
        encoder.start()

    
    encoder.on('progress', (percent: any) => {
        console.log(percent)
    }) 


    for (let frame of frames) {

        // Draw Image

        drawFrame(ctx, drawData, parseInt(frame), {
            resolution: settings.resolution,
            lineWidth: settings.lineWidth
        })        


        // Save Image

        encoder.addFrame(ctx)

    }

    encoder.finish()

    let buffer = encoder.out.getData() as Buffer
    callback.call(this, buffer)
    // fs.writeFile('test.gif', buffer, (err) => {--
    //     console.log('saved test.gif')
    //     callback.apply(this, buffer)
    // })

}