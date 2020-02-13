import ILDAFile from './ILDAFile'
import colorIndex from './defaultColorIndex'

import Values from '../../../../webParticles/src/ts/ui_thread/values/Values'


let values = new Values(document.getElementById('controls'))

for (let val of values.values) {
    val.on('change', () => {
        settings[val.scriptName] = val.value

        if (val.scriptName == 'canvasSize') {
            ctx.canvas.width = ctx.canvas.height = settings.canvasSize
        }
    })
}


const settings: {[key: string]: number} = {
    canvasSize: 512,
    fps: 12,
    lineWidth: 2
}


let currentFrame = 0
let currentFps = 0


let ctx = document.querySelector('canvas').getContext('2d')
    ctx.canvas.width = ctx.canvas.height = settings.canvasSize


let requestID: number


export default function startDrawingLoop(file: ILDAFile) {

    currentFrame = 0
    currentFps = 0

    // FPS Limiter
    let now: number
    let then: number = performance.now()

    // FPS Counter
    let times: number[] = []


    function loop() {

        now = performance.now()
        let elapsed = now - then

        if (elapsed > 1000 / settings.fps) {

            then = now - (elapsed % (1000 / settings.fps))


            // Render Code Here

            ctx.clearRect(0, 0, settings.canvasSize, settings.canvasSize)
            ctx.lineWidth = settings.lineWidth

            for (let i = 1; i < file.pointData[currentFrame].length; i++) {

                let startPoint = file.pointData[currentFrame][i - 1]
                let nextPoint = file.pointData[currentFrame][i + 0]

                if (startPoint.statusCode == 64) continue

                // Position

                let x1 = (startPoint.x + 32768) / 65535 * settings.canvasSize
                let y1 = (1 - (startPoint.y + 32768) / 65535) * settings.canvasSize
                let x2 = (nextPoint.x + 32768) / 65535 * settings.canvasSize
                let y2 = (1 - (nextPoint.y + 32768) / 65535) * settings.canvasSize

                // Color

                let r, g, b

                if (startPoint.colorIndex) {

                    r = colorIndex[startPoint.colorIndex].r
                    g = colorIndex[startPoint.colorIndex].g
                    b = colorIndex[startPoint.colorIndex].b

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

 
            currentFrame++

            if (currentFrame >= file.pointData.length-1) {
                currentFrame = 0
            }

            // Fps Counter

            now = performance.now();
            while (times.length > 0 && times[0] <= now - 990) {
                times.shift();
            }
            times.push(now);

            currentFps = times.length

        }

        requestID = requestAnimationFrame(loop)

    }

    loop()

}

export function stopDrawingLoop() {

    cancelAnimationFrame(requestID)

}
