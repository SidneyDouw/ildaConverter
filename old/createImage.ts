// import fs from 'fs'
// import { createCanvas } from 'canvas'

// import { DrawData } from './readFile'
// import colorIndex from './colorindex'

// const GIFEncoder = require('gif-encoder-2')


// // Settings

// let canvasWidth = 512
// let canvasHeight = 512

// let lineWidth = 4


// // function saveSequence(frame, totalFrames, callback) {

// //     // Draw Image

// //     let pointIndices = Object.keys(drawData[frame])

// //     ctx.clearRect(0, 0, canvasWidth, canvasHeight)
// //     ctx.lineWidth = lineWidth

    
// //     for (let i = 0; i < pointIndices.length-1; i++) {
// //         let startPoint = drawData[frame][i + 0]
// //         let nextPoint = drawData[frame][i + 1]

// //         if (startPoint.statusCode == 64) continue
        
// //         let x1 = (startPoint.x + 32768) / 65535 * canvasWidth
// //         let y1 = (1 - (startPoint.y + 32768) / 65535) * canvasHeight
// //         let x2 = (nextPoint.x + 32768) / 65535 * canvasWidth
// //         let y2 = (1 - (nextPoint.y + 32768) / 65535) * canvasHeight
        
// //         let r = startPoint.r
// //         let g = startPoint.g
// //         let b = startPoint.b
                
// //         ctx.beginPath()
// //         ctx.moveTo(x1, y1)
// //         ctx.lineTo(x2, y2)
// //         // ctx.closePath()

// //         ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')'
// //         ctx.stroke()

// //         // if (nextPoint.statusCode == 192) break
// //     }
    


// //     // Save Image


// //     let output = fs.createWriteStream('./test/test_' + frame + '.png')
// //     let stream = canvas.createPNGStream()
// //         stream.pipe(output)
        
// //     output.on('finish', () => {
// //         console.log('saving frame ' + frame)
// //         if (frame < totalFrames-1) {
// //             saveSequence(frame+1, totalFrames)
// //         } else {
// //             callback()
// //         }
// //     })
    

// // }

// // saveSequence(0, frames.length)


// export default function createImage(drawData: DrawData, callback: Function) {

//     // Create canvas and draw and save frames

//     let canvas = createCanvas(canvasWidth, canvasHeight)
//     let ctx = canvas.getContext('2d')

//     let frames = Object.keys(drawData)


//     // Create GIF Encoder

//     let encoder = new GIFEncoder(canvasWidth, canvasHeight, 'neuquant', false)

//         // encoder.createReadStream().pipe(fs.createWriteStream('test.gif'))

//         encoder.setFrameRate(12)
//         encoder.setQuality(10)
//         encoder.start()


//     for (let frame of frames) {

//         // Draw Image

//         let pointIndices = Object.keys(drawData[frame])

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight)
//         ctx.lineWidth = lineWidth

        
//         for (let i = 0; i < pointIndices.length-1; i++) {
//             let startPoint = drawData[frame][i + 0]
//             let nextPoint = drawData[frame][i + 1]

//             if (startPoint.statusCode == 64) continue
            
//             let x1 = (startPoint.x + 32768) / 65535 * canvasWidth
//             let y1 = (1 - (startPoint.y + 32768) / 65535) * canvasHeight
//             let x2 = (nextPoint.x + 32768) / 65535 * canvasWidth
//             let y2 = (1 - (nextPoint.y + 32768) / 65535) * canvasHeight
            
//             let r, g, b

//             if (startPoint.colorIndex) {

//                 r = colorIndex[startPoint.colorIndex].r
//                 g = colorIndex[startPoint.colorIndex].g
//                 b = colorIndex[startPoint.colorIndex].b

//             } else {

//                 r = startPoint.r
//                 g = startPoint.g
//                 b = startPoint.b

//             }
                    
//             ctx.beginPath()
//             ctx.moveTo(x1, y1)
//             ctx.lineTo(x2, y2)

//             ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')'
//             ctx.stroke()


//             // if (nextPoint.statusCode == 192) break
//         }
        


//         // Save Image

//         encoder.addFrame(ctx)
//         console.log('encoding frame ' + frame)

//     }

//     encoder.finish()

//     let buffer = encoder.out.getData()
//     fs.writeFile('test.gif', buffer, (err) => {
//         console.log('saved test.gif')
//         callback()
//     })

// }