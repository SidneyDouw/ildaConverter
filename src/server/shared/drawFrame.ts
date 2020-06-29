import { PointData } from './ILDAFile'
import drawSettings from './drawSettings'
import colorIndex from './defaultColorIndex'
import { CanvasRenderingContext2D } from 'canvas'

export default function drawFrame(
    ctx: CanvasRenderingContext2D,
    drawData: PointData[][],
    frame: number,
    settings: drawSettings,
) {
    ctx.clearRect(0, 0, settings.resolution, settings.resolution)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, settings.resolution, settings.resolution)
    ctx.lineWidth = settings.lineWidth

    for (let i = 1; i < drawData[frame].length; i++) {
        let startPoint = drawData[frame][i - 1]
        let nextPoint = drawData[frame][i + 0]

        if (startPoint.statusCode == 64) continue
        if (nextPoint.statusCode == 64) continue

        // Position

        let x1 = ((startPoint.x + 32768) / 65535) * settings.resolution
        let y1 = (1 - (startPoint.y + 32768) / 65535) * settings.resolution
        let x2 = ((nextPoint.x + 32768) / 65535) * settings.resolution
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

    // Watermark

    if (settings.watermark) {
        let imgW = settings.watermark.width
        let imgH = settings.watermark.height
        let ratio = imgW / imgH

        let cw = ctx.canvas.width
        let ch = ctx.canvas.height

        let scale = 0.9

        ctx.globalAlpha = settings.watermark_alpha
        // ctx.globalCompositeOperation = 'color-burn'

        ctx.drawImage(
            settings.watermark,
            (cw * (1 - scale)) / 2,
            ch / 2 - (ch * (1 / ratio)) / 2 + (ch * (1 / ratio) * (1 - scale)) / 2,
            cw * scale,
            ch * (1 / ratio) * scale,
        )

        ctx.globalAlpha = 1
        // ctx.globalCompositeOperation = 'source-over'
    }
}
