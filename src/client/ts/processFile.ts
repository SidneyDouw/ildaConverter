import ILDAFile from '../../server/shared/ILDAFile'
import startDrawingLoop from './drawingLoop'
import globals from './globals'

/* Converts the file to a Buffer
 * Checks if the file is valid
 * Starts the drawing loop if it is
 */

export default function processFile(file: File) {
    const filenameDiv = document.getElementById('filename')!
    filenameDiv.className = ''
    filenameDiv.textContent = 'loading...'

    getBufferData(file).then((data) => {
        if (checkFileFormat(data)) {
            globals.activeFile = file
            globals.activeFileParsed = new ILDAFile(file.name, data)

            startDrawingLoop(globals.activeFileParsed)

            filenameDiv.className = ''
            filenameDiv.textContent = file.name
        } else {
            filenameDiv.className = 'error'
            filenameDiv.textContent = 'Invalid File Format'
        }
    })
}

function getBufferData(file: File) {
    return new Promise<Buffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)

        reader.onload = () => {
            if (reader.result) {
                if (typeof reader.result === 'string') {
                    resolve(Buffer.from(reader.result))
                } else {
                    resolve(Buffer.from(reader.result))
                }
            } else {
                reject()
            }
        }
    })
}

function checkFileFormat(bufferData: Buffer) {
    return bufferData.slice(0, 4).toString() === 'ILDA' ? true : false
}
