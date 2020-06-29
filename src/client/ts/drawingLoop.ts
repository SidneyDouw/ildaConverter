import ILDAFile from '../../server/shared/ILDAFile'
import drawFrame from '../../server/shared/drawFrame'

import Values from './values/Values'
import globals from './globals'

// Update Settings via Sliders

let values = new Values(document.getElementById('controls'))

for (let val of values.values) {
    val.on('change', () => {
        globals.settings[val.scriptName] = val.value

        if (val.scriptName == 'resolution') {
            ctx.canvas.width = ctx.canvas.height = globals.settings.resolution
        }
    })
}

let ctx = document.querySelector('canvas').getContext('2d')
ctx.canvas.width = ctx.canvas.height = globals.settings.resolution

let requestID: number

export default function startDrawingLoop(file: ILDAFile) {
    let currentFrame = 0
    let currentFps = 0

    // FPS Limiter
    let now: number
    let then: number = performance.now()

    // FPS Counter
    let times: number[] = []

    function loop() {
        now = performance.now()
        let elapsed = now - then

        if (elapsed > 1000 / globals.settings.fps) {
            then = now - (elapsed % (1000 / globals.settings.fps))

            // Render Code Here

            drawFrame(ctx, file.pointData, currentFrame, {
                resolution: globals.settings.resolution,
                lineWidth: globals.settings.lineWidth,
            })

            // Render Code Stop Here

            currentFrame++

            if (currentFrame >= file.pointData.length - 1) {
                currentFrame = 0
            }

            // Fps Counter

            now = performance.now()
            while (times.length > 0 && times[0] <= now - 990) {
                times.shift()
            }
            times.push(now)

            currentFps = times.length
        }

        requestID = requestAnimationFrame(loop)
    }

    loop()
}

export function stopDrawingLoop() {
    cancelAnimationFrame(requestID)
}
