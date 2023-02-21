import { PointData } from '../shared/ILDAFile'
import drawSettings from '../shared/drawSettings'

import { createCanvas } from 'canvas'
import createGIF from './createGIF'

export default function converter(
    drawData: PointData[][],
    settings: drawSettings,
    callback: (data: Buffer | null, err?: { message: string }) => void,
) {
    // Create canvas and draw and save frames

    const canvas = createCanvas(settings.resolution!, settings.resolution!)
    const ctx = canvas.getContext('2d')

    const lengthInFrames = Object.keys(drawData).length

    switch (settings.fileFormat) {
        case 'GIF':
            createGIF(ctx, drawData, lengthInFrames, settings, callback)
            break

        default:
            callback.call(null, null, { message: 'Invalid fileformat, "' + settings.fileFormat + '"' })
    }
}
