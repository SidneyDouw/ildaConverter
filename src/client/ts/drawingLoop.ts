import ILDAFile from './ILDAFile'
import colorIndex from './defaultColorIndex'

import Values from '../../../../webParticles/src/ts/ui_thread/values/Values'

let filenameDiv = document.getElementById('filename')
let downloadButton = document.getElementById('download')
let values = new Values(document.getElementById('controls'))


downloadButton.onclick = () => {
    alert('not yet ;)')
}


for (let val of values.values) {
    val.on('change', () => {
        settings[val.scriptName] = val.value

        if (val.scriptName == 'resolution') {
            ctx.canvas.width = ctx.canvas.height = settings.resolution
        }
    })
}


const settings: {[key: string]: number} = {
    resolution: 512,
    fps: 12,
    lineWidth: 1
}


let currentFrame = 0
let currentFps = 0


let ctx = document.querySelector('canvas').getContext('2d')
    ctx.canvas.width = ctx.canvas.height = settings.resolution


let requestID: number


export default function startDrawingLoop(file: ILDAFile) {

    currentFrame = 1
    currentFps = 0

    // FPS Limiter
    let now: number
    let then: number = performance.now()

    // FPS Counter
    let times: number[] = []

    // Set Filename in UI
    filenameDiv.textContent = file.filename


    function loop() {

        now = performance.now()
        let elapsed = now - then

        if (elapsed > 1000 / settings.fps) {

            then = now - (elapsed % (1000 / settings.fps))


            // Render Code Here

            ctx.clearRect(0, 0, settings.resolution, settings.resolution)
            ctx.lineWidth = settings.lineWidth

            for (let i = 1; i < file.pointData[currentFrame].length; i++) {
                
                let startPoint = file.pointData[currentFrame][i - 1]
                let nextPoint = file.pointData[currentFrame][i + 0]

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
