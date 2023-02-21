import { PointData } from '../shared/ILDAFile'
import drawSettings from '../shared/drawSettings'

import { CanvasRenderingContext2D } from 'canvas'
import drawFrame from '../shared/drawFrame'

import GIFEncoder from 'gif-encoder-2'

export default function createGIF(
    ctx: CanvasRenderingContext2D,
    drawData: PointData[][],
    totalFrames: number,
    settings: drawSettings,
    callback: (data: Buffer) => void,
) {
    // Create GIF Encoder

    const encoder = new GIFEncoder(settings.resolution!, settings.resolution!, 'neuquant', false, totalFrames)

    encoder.setFrameRate(settings.fps!)
    encoder.setQuality(10)
    encoder.start()

    // Progress Event

    // encoder.on('progress', (percent: any) => {
    //     console.log(percent)
    // })

    // Draw Frames and Encode

    for (let frame = 0; frame < totalFrames; frame++) {
        // Draw Image
        drawFrame(ctx, drawData, frame, settings)

        // Add encoded frame
        encoder.addFrame(ctx)

        // Progress
        // console.log(Math.round(frame / (totalFrames-1)*10000) / 100)
    }

    encoder.finish()

    // Send data to callback function

    const buffer = encoder.out.getData()
    callback.call(null, buffer)
}
