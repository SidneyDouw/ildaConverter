// import fileStructure from './fileStructures'


// interface HeaderData {
//     [key: string]: string | number
//     format: string
//     formatCode: number
//     frameName: string
//     company: string
//     dataRecords: number
//     frame: number
//     length: number
//     projector: number
// }

// interface PointData {
//     [key: string]: number
//     x?: number
//     y?: number
//     z?: number
//     r?: number
//     g?: number
//     b?: number
//     statusCode?: number
//     colorIndex?: number
// }

// export interface DrawData {
//     [key: string]: PointData[]
// }


// export default function readFile(data: Buffer, callback: (error: string, drawData: DrawData) => any) {

//     // Read ILDA file and return drawable data

//     let error: string = null
//     let drawData: DrawData = {}



//     // Basic file checks

//     if (data.length < 32) {
//         error = 'Not an ILDA file'
//         callback(error, null)
//         return
//     }



//     // Loop through file buffer data

//     let byteOffset = 0

//     while (byteOffset < data.length) {

//         // Header

//         let headerValues: HeaderData

//         for (let name in fileStructure.header) {

//             let datatype = fileStructure.header[name].type
//             let start = fileStructure.header[name].range[0] + byteOffset
//             let end = fileStructure.header[name].range[1] + byteOffset

//             let buffer = data.slice(start, end)
            
//             headerValues[name] = convertByteValue(buffer, datatype)
//         }

//         byteOffset += 32

//         if (headerValues.dataRecords > 0) {
//             drawData[headerValues.frame] = []
//         } else {
//             break
//         }


//         // Check if file is an ILDA file
        
//         if (headerValues.format != 'ILDA') {
//             error = 'Not an ILDA file'
//             console.log(error)
//             callback(error, null)
//             return
//         }


//         console.log('Format: ' + headerValues.formatCode + ', frame ' + headerValues.frame + ' of ' + headerValues.length)


        
//         // Point Data

//         let pointStructure = fileStructure['ilda_' + headerValues.formatCode]

//         for (let pointIndex = 0; pointIndex < headerValues.dataRecords; pointIndex++) {
            
//             let pointValues: PointData = {}

//             for (let name in pointStructure) {

//                 let datatype = pointStructure[name].type as string
//                 let start = pointStructure[name].range[0] + byteOffset as number
//                 let end = pointStructure[name].range[1] + byteOffset as number

//                 let buffer = data.slice(start, end)
                
//                 pointValues[name] = convertByteValue(buffer, datatype) as number
//             }

//             byteOffset += 8
//             drawData[headerValues.frame][pointIndex] = pointValues

//         }

//     }
//     console.log('reached end of file')

//     callback(error, drawData)

// }


// // Helper function to convert buffer values to correct data type

// function convertByteValue(buffer: Buffer, type: string) {

//     let returnVal

//     switch (type) {
        
//         case 'string':
//             returnVal = buffer.toString()
//             break
        
//         case 'uint':
//             returnVal = buffer.readUInt8(0)
//             break

//         case 'int':
//             returnVal = buffer.readInt8(0)
//             break

//         case 'uint16':
//             returnVal = buffer.readUInt16BE(0)
//             break

//         case 'int16':
//             returnVal = buffer.readInt16BE(0)
//             break
    
//         default:
//             throw Error ('unknown type "' + type + '" in file structure')
//     }

//     return returnVal

// }
