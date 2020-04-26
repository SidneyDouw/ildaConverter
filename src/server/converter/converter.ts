import { createCanvas } from 'canvas'

import { PointData } from '../shared/ILDAFile'
import drawSettings from '../shared/drawSettings'

import createGIF from './createGIF'
import createPNG from './createPNG'


export default function converter(drawData: PointData[][], settings: drawSettings, callback: Function) {

    // Create canvas and draw and save frames

    let canvas = createCanvas(settings.resolution, settings.resolution)
    let ctx = canvas.getContext('2d')

    let frames = Object.keys(drawData)


    switch (settings.fileFormat) {
        case 'GIF':
            createGIF(ctx, drawData, frames.length, settings, callback)
            break

        // case 'PNG':
        //     createPNG(ctx, drawData, frames.length, settings, callback)
        //     break

        default:
            let msg = 'Invalid fileformat, "' + settings.fileFormat + '"'
            callback.call(null, null, {message: 'Invalid fileformat, "' + settings.fileFormat + '"'})
    }

}