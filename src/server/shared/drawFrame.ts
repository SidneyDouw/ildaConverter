import { PointData } from './ILDAFile'
import drawSettings from './drawSettings'
import colorIndex from './defaultColorIndex'


export default function drawFrame(ctx: any, drawData: PointData[][], frame: number, settings: drawSettings) {

    ctx.clearRect(0, 0, settings.resolution, settings.resolution)
    ctx.lineWidth = settings.lineWidth

    for (let i = 1; i < drawData[frame].length; i++) {
        
        let startPoint = drawData[frame][i - 1]
        let nextPoint = drawData[frame][i + 0]

        if (startPoint.statusCode == 64) continue
        if (nextPoint.statusCode == 64) continue


        // Position

        let x1 = (startPoint.x + 32768) / 65535 * settings.resolution
        let y1 = (1 - (startPoint.y + 32768) / 65535) * settings.resolution
        let x2 = (nextPoint.x + 32768) / 65535 * settings.resolution
        let y2 = (1 - (nextPoint.y + 32768) / 65535) * settings.resolution
        // Z is still missing


        // Color

        let r, g, b

        if (startPoint.colorIndex) {

            let ci = startPoint.colorIndex % 64

            r = colorIndex[ci].r
            g = colorIndex[ci].g
            b = colorIndex[ci].b

        } else {

            r = startPoint.r
            g = startPoint.g
            b = startPoint.b

        }
        
        // Draw

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)

        ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')'
        ctx.stroke()

    }

}