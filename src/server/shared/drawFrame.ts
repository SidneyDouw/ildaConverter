import { PointData } from './ILDAFile'
import drawSettings from './drawSettings'
import colorIndex from './defaultColorIndex'
import NodeCanvas from 'canvas'

export default function drawFrame(
    ctx: NodeCanvas.CanvasRenderingContext2D,
    drawData: PointData[][],
    frame: number,
    settings: drawSettings,
) {
    ctx.clearRect(0, 0, settings.resolution!, settings.resolution!)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, settings.resolution!, settings.resolution!)
    ctx.lineWidth = settings.lineWidth!

    for (let i = 1; i < drawData[frame].length; i++) {
        const startPoint = drawData[frame][i - 1]
        const nextPoint = drawData[frame][i + 0]

        if (startPoint.statusCode == 64) continue
        if (nextPoint.statusCode == 64) continue

        // TODO: input validation of drawdata, gotta check the format type to know whats in it
        //       input validation of settings, should not be undefined at this point

        if (!startPoint.x || !startPoint.y || !nextPoint.x || !nextPoint.y) {
            return
        }

        // Position

        const x1 = ((startPoint.x + 32768) / 65535) * settings.resolution!
        const y1 = (1 - (startPoint.y + 32768) / 65535) * settings.resolution!
        const x2 = ((nextPoint.x + 32768) / 65535) * settings.resolution!
        const y2 = (1 - (nextPoint.y + 32768) / 65535) * settings.resolution!
        // Z is still missing

        // Color

        let r, g, b

        if (startPoint.colorIndex) {
            const ci = startPoint.colorIndex % 64

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

    // Watermark

    if (settings.watermark) {
        const imgW = settings.watermark.width
        const imgH = settings.watermark.height
        const ratio = imgW / imgH

        const cw = ctx.canvas.width
        const ch = ctx.canvas.height

        const scale = 0.9

        ctx.globalAlpha = settings.watermark_alpha!

        ctx.drawImage(
            settings.watermark,
            (cw * (1 - scale)) / 2,
            ch / 2 - (ch * (1 / ratio)) / 2 + (ch * (1 / ratio) * (1 - scale)) / 2,
            cw * scale,
            ch * (1 / ratio) * scale,
        )

        ctx.globalAlpha = 1
    }
}
