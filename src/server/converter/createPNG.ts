import archiver from 'archiver'
import drawFrame from '../shared/drawFrame'

import { PointData } from '../shared/ILDAFile'
import drawSettings from '../shared/drawSettings'

export default function createPNG(
    ctx: any,
    drawData: PointData[][],
    totalFrames: number,
    settings: drawSettings,
    callback: Function,
) {
    let frame = 0

    // Setup Zip Stream

    let archive = archiver('zip', {
        zlib: { level: 9 },
    })

    archive.on('finish', () => {
        callback.call(null, archive)
    })

    archive.on('progress', () => {
        // Draw next frame

        frame++

        if (frame < totalFrames - 1) {
            drawFrameRecursively(archive, ctx, drawData, frame + 1, totalFrames, settings, callback)
        } else {
            archive.finalize()
        }
    })

    // archive.on('data', () => {
    //     console.log('data')
    // })

    archive.on('error', (err) => {
        console.log(err)
    })

    // Draw Frames and add to archive
    drawFrameRecursively(archive, ctx, drawData, frame, totalFrames, settings, callback)
}

function drawFrameRecursively(
    archive: archiver.Archiver,
    ctx: any,
    drawData: PointData[][],
    frame: number,
    totalFrames: number,
    settings: drawSettings,
    callback: Function,
) {
    // Draw Image
    drawFrame(ctx, drawData, frame, settings)

    // Stream Image to archive
    archive.append(ctx.canvas.createPNGStream(), { name: 'test_' + frame + '.png' })

    console.log(Math.round((frame / (totalFrames - 1)) * 10000) / 100)
}
