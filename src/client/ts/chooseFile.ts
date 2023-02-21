import processFile from './processFile'
import { stopDrawingLoop } from './drawingLoop'

/** Handles the User Interaction of selecting / dropping a file
 * passes the file to the 'processFile' function
 */

const dropZone = document.getElementById('dropZone')!

dropZone.onclick = () => {
    stopDrawingLoop()

    const input = document.createElement('input')
    input.type = 'file'
    input.name = 'ilda'
    input.accept = '.ild'

    input.click()
    input.onchange = () => {
        if (input.files && input.files.length > 0) {
            processFile(input.files[0])
        }
    }
}

dropZone.ondrop = (evt) => {
    stopDrawingLoop()

    evt.preventDefault()
    dropZone.style.outlineWidth = '1px'

    if (evt.dataTransfer && evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
        processFile(evt.dataTransfer.items[0].getAsFile()!)
    }
}

dropZone.ondragover = (evt) => {
    evt.preventDefault()
}
dropZone.ondragenter = () => {
    // dropZone.textContent = 'DROP ME'
    dropZone.style.outlineWidth = '5px'
}
dropZone.ondragleave = () => {
    // dropZone.textContent = 'Select / Drop files'
    dropZone.style.outlineWidth = '1px'
}
