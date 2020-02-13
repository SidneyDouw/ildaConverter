// // ILDA File structure

// // Header
// // Format
// // Header
// // Format
// // ...


// interface ByteValue {
//     type: string
//     range: number[]
// }

// interface ilda_header {
//     [key: string]: ByteValue
//     format: ByteValue
//     formatCode: ByteValue
//     frameName: ByteValue
//     company: ByteValue
//     dataRecords: ByteValue
//     frame: ByteValue
//     length: ByteValue
//     projector: ByteValue
// }

// interface ilda_0 {
//     x: ByteValue
//     y: ByteValue
//     z: ByteValue
//     statusCode: ByteValue
//     colorIndex: ByteValue
// }
// interface ilda_1 {
//     x: ByteValue
//     y: ByteValue
//     statusCode: ByteValue
//     colorIndex: ByteValue
// }
// interface ilda_2 {
//     r: ByteValue
//     g: ByteValue
//     b: ByteValue
// }
// interface ilda_4 {
//     x: ByteValue
//     y: ByteValue
//     z: ByteValue
//     statusCode: ByteValue
//     b: ByteValue
//     g: ByteValue
//     r: ByteValue
// }
// interface ilda_5 {
//     x: ByteValue
//     y: ByteValue
//     statusCode: ByteValue
//     b: ByteValue
//     g: ByteValue
//     r: ByteValue
// }

// interface Structure {
//     [key: string]: any
//     header: ilda_header
//     ilda_0: ilda_0
//     ilda_1: ilda_1
//     ilda_2: ilda_2
//     ilda_4: ilda_4
//     ilda_5: ilda_5
// }



// let header: ilda_header = {
//     format: {
//         type: 'string',
//         range: [0, 4]
//     },
//     // reserved_1: [4, 7],
//     formatCode: {
//         type: 'uint',
//         range: [7, 8]
//     },
//     frameName: {
//         type: 'string',
//         range: [8, 16]
//     },
//     company: {
//         type: 'string',
//         range: [16, 24]
//     },
//     dataRecords: {
//         type: 'uint16',
//         range: [24, 26]
//     },
//     frame: {
//         type: 'uint16',
//         range: [26, 28]
//     },
//     length: {
//         type: 'uint16',
//         range: [28, 30]
//     },
//     projector: {
//         type: 'uint',
//         range: [30, 31]
//     },
//     // reserved_2: [31, 32]
// }

// let ilda_0: ilda_0 = {
//     x: {
//         type: 'int16',
//         range: [0, 2]
//     },
//     y: {
//         type: 'int16',
//         range: [2, 4]
//     },
//     z: {
//         type: 'int16',
//         range: [4, 6]
//     },
//     statusCode: {
//         type: 'uint',
//         range: [6, 7]
//     },
//     colorIndex: {
//         type: 'uint',
//         range: [7, 8]
//     },
// }

// let ilda_1: ilda_1 = {
//     x: {
//         type: 'int16',
//         range: [0, 2]
//     },
//     y: {
//         type: 'int16',
//         range: [2, 4]
//     },
//     statusCode: {
//         type: 'uint',
//         range: [4, 5]
//     },
//     colorIndex: {
//         type: 'uint',
//         range: [5, 6]
//     },
// }

// let ilda_2: ilda_2 = {
//     r: {
//         type: 'uint',
//         range: [0, 1]
//     },
//     g: {
//         type: 'uint',
//         range: [1, 2]
//     },
//     b: {
//         type: 'uint',
//         range: [2, 3]
//     }
// }

// let ilda_4: ilda_4 = {
//     x: {
//         type: 'int16',
//         range: [0, 2]
//     },
//     y: {
//         type: 'int16',
//         range: [2, 4]
//     },
//     z: {
//         type: 'int16',
//         range: [4, 6]
//     },
//     statusCode: {
//         type: 'uint',
//         range: [6, 7]
//     },
//     b: {
//         type: 'uint',
//         range: [7, 8]
//     },
//     g: {
//         type: 'uint',
//         range: [8, 9]
//     },
//     r: {
//         type: 'uint',
//         range: [9, 10]
//     },
// }

// let ilda_5: ilda_5 = {
//     x: {
//         type: 'int16',
//         range: [0, 2]
//     },
//     y: {
//         type: 'int16',
//         range: [2, 4]
//     },
//     statusCode: {
//         type: 'uint',
//         range: [4, 5]
//     },
//     b: {
//         type: 'uint',
//         range: [5, 6]
//     },
//     g: {
//         type: 'uint',
//         range: [6, 7]
//     },
//     r: {
//         type: 'uint',
//         range: [7, 8]
//     },
// }

// let fileStructure: Structure = {
//     header,
//     ilda_0,
//     ilda_1,
//     ilda_2,
//     ilda_4,
//     ilda_5
// }

// export default fileStructure