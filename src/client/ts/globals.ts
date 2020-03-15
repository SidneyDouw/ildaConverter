import ILDAFile from "../../server/shared/ILDAFile"

interface globals {

    settings: {
        [key: string]: number
        resolution: number
        lineWidth: number
        fps: number
    }

    activeFile: File
    activeFileParsed: ILDAFile

}

const globals: globals = {

    settings: {
        resolution: 512,
        lineWidth: 1,
        fps: 12
    },

    activeFile: null,
    activeFileParsed: null
    
}

export default globals