import processFile from './processFile'
import { stopDrawingLoop } from './drawingLoop'


const dropZone = document.getElementById('dropZone')

dropZone.onclick = (evt) => {

    stopDrawingLoop()

    let input = document.createElement('input')
        input.type = 'file'
        input.name = 'ilda'
        input.accept = '.ild'

        input.click()
        input.onchange = (evt) => processFile(input.files[0])

}

dropZone.ondrop = (evt) => {

    stopDrawingLoop()

    evt.preventDefault()
    dropZone.style.outlineWidth = '1px'

    if (evt.dataTransfer.items) {
        
        let file = evt.dataTransfer.items[0].getAsFile()            
        processFile(file)
    
    }

}

dropZone.ondragover = (evt) => {
    evt.preventDefault()
}
dropZone.ondragenter = (evt) => {
    // dropZone.textContent = 'DROP ME'
    dropZone.style.outlineWidth = '5px'
}
dropZone.ondragleave = (evt) => {
    // dropZone.textContent = 'Select / Drop files'
    dropZone.style.outlineWidth = '1px'
}