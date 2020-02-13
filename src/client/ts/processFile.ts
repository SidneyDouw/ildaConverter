import ILDAFile from './ILDAFile'
import startDrawingLoop from './drawingLoop'


export default function processFile (file: File) {

    
    getBufferData(file)
    .then(data => {

        if (checkFileFormat(data)) {

            startDrawingLoop(new ILDAFile(data))

        } else {

            console.log('Invalid File Format')

        }
    
    })

}

function getBufferData(file: File) {

    return new Promise<Buffer>((resolve, reject) => {

        let reader = new FileReader()
            reader.readAsArrayBuffer(file)

            reader.onload = () => {
                resolve(Buffer.from(reader.result))
            }

    })
        
    
}

function checkFileFormat(bufferData: Buffer) {

    return bufferData.slice(0, 4).toString() === 'ILDA' ? true : false

}