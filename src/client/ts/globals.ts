import ILDAFile from '../../server/shared/ILDAFile'
import drawSettings from '../../server/shared/drawSettings'

interface globals {
    settings: drawSettings

    activeFile: File | null
    activeFileParsed: ILDAFile | null
}

const globals: globals = {
    settings: {
        resolution: 256,
        lineWidth: 1,
        fps: 12,
        fileFormat: 'GIF',
    },

    activeFile: null,
    activeFileParsed: null,
}

export default globals
