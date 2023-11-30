// Type Definitions

export interface ByteValue {
    type: string
    range: number[]
}
export interface ByteStructure {
    [key: string]: ByteValue
}

export interface HeaderData {
    [key: string]: string | number
    format: string
    formatCode: number
    frameName: string
    company: string
    dataRecords: number
    frame: number
    length: number
    projector: number
    reserved_1: number
    reserved_2: number
}
export interface PointData {
    [key: string]: number | undefined
    x?: number
    y?: number
    z?: number
    r?: number
    g?: number
    b?: number
    colorIndex?: number
    statusCode?: number
}

// Possible ILDA File Structures

const headerStructure: ByteStructure = {
    format: {
        type: 'string',
        range: [0, 4],
    },
    reserved_1: {
        type: 'uint',
        range: [4, 7],
    },
    formatCode: {
        type: 'uint',
        range: [7, 8],
    },
    frameName: {
        type: 'string',
        range: [8, 16],
    },
    company: {
        type: 'string',
        range: [16, 24],
    },
    dataRecords: {
        type: 'uint16',
        range: [24, 26],
    },
    frame: {
        type: 'uint16',
        range: [26, 28],
    },
    length: {
        type: 'uint16',
        range: [28, 30],
    },
    projector: {
        type: 'uint',
        range: [30, 31],
    },
    reserved_2: {
        type: 'uint',
        range: [31, 32],
    },
}

const ilda_0: ByteStructure = {
    x: {
        type: 'int16',
        range: [0, 2],
    },
    y: {
        type: 'int16',
        range: [2, 4],
    },
    z: {
        type: 'int16',
        range: [4, 6],
    },
    statusCode: {
        type: 'uint',
        range: [6, 7],
    },
    colorIndex: {
        type: 'uint',
        range: [7, 8],
    },
}

const ilda_1: ByteStructure = {
    x: {
        type: 'int16',
        range: [0, 2],
    },
    y: {
        type: 'int16',
        range: [2, 4],
    },
    statusCode: {
        type: 'uint',
        range: [4, 5],
    },
    colorIndex: {
        type: 'uint',
        range: [5, 6],
    },
}

const ilda_2: ByteStructure = {
    r: {
        type: 'uint',
        range: [0, 1],
    },
    g: {
        type: 'uint',
        range: [1, 2],
    },
    b: {
        type: 'uint',
        range: [2, 3],
    },
}

const ilda_4: ByteStructure = {
    x: {
        type: 'int16',
        range: [0, 2],
    },
    y: {
        type: 'int16',
        range: [2, 4],
    },
    z: {
        type: 'int16',
        range: [4, 6],
    },
    statusCode: {
        type: 'uint',
        range: [6, 7],
    },
    b: {
        type: 'uint',
        range: [7, 8],
    },
    g: {
        type: 'uint',
        range: [8, 9],
    },
    r: {
        type: 'uint',
        range: [9, 10],
    },
}

const ilda_5: ByteStructure = {
    x: {
        type: 'int16',
        range: [0, 2],
    },
    y: {
        type: 'int16',
        range: [2, 4],
    },
    statusCode: {
        type: 'uint',
        range: [4, 5],
    },
    b: {
        type: 'uint',
        range: [5, 6],
    },
    g: {
        type: 'uint',
        range: [6, 7],
    },
    r: {
        type: 'uint',
        range: [7, 8],
    },
}

const ilda_point_structure: { [key: string]: ByteStructure } = {
    ilda_0,
    ilda_1,
    ilda_2,
    ilda_4,
    ilda_5,
}

// Class

export default class ILDAFile {
    bufferData: Buffer
    byteOffset: number

    headerData: HeaderData[]
    pointData: PointData[][]

    // FileInfo

    filename: string
    formatCode: undefined
    length: number

    constructor(filename: string, bufferData: Buffer) {
        this.filename = filename

        this.bufferData = bufferData
        this.byteOffset = 0

        this.headerData = []
        this.pointData = []

        this.length = 0

        // this.readHeaderOnce()
        this.readFile()
    }

    readHeaderOnce() {
        for (const fieldname in headerStructure) {
            const datatype = headerStructure[fieldname].type
            const start = headerStructure[fieldname].range[0]
            const end = headerStructure[fieldname].range[1]

            const fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype)
            console.log(fieldname, fieldvalue)
        }
    }

    readFile() {
        while (this.byteOffset < this.bufferData.length) {
            this.readHeader()
            this.readPointData()
        }

        this.length = this.pointData.length

        // console.log(this.headerData)
        // console.log(this.pointData)
    }

    readHeader() {
        const header: HeaderData = <HeaderData>{}
        let byteRange = 0

        for (const fieldname in headerStructure) {
            const datatype = headerStructure[fieldname].type
            const start = headerStructure[fieldname].range[0] + this.byteOffset
            const end = headerStructure[fieldname].range[1] + this.byteOffset

            const fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype)

            byteRange += end - start
            header[fieldname] = fieldvalue
        }

        this.byteOffset += byteRange
        this.headerData.push(header)
    }

    readPointData() {
        if (this.byteOffset >= this.bufferData.length) return

        const header = this.headerData[this.headerData.length - 1]
        const pointStructure = ilda_point_structure['ilda_' + header.formatCode]
        const pointArr: PointData[] = []

        for (let index = 0; index < header.dataRecords; index++) {
            const point: PointData = <PointData>{}
            let byteRange = 0

            for (const fieldname in pointStructure) {
                const datatype = pointStructure[fieldname].type
                const start = pointStructure[fieldname].range[0] + this.byteOffset
                const end = pointStructure[fieldname].range[1] + this.byteOffset

                const fieldvalue = this.convertBuffer(this.bufferData.slice(start, end), datatype)

                byteRange += end - start
                if (typeof fieldvalue === 'string') {
                    throw new Error("BUG: fieldvalue should not be a string, that only occurs in 'HeaderData'")
                }
                point[fieldname] = fieldvalue
            }

            this.byteOffset += byteRange
            pointArr.push(point)
        }

        this.pointData.push(pointArr)
    }

    convertBuffer(buffer: Buffer, type: string) {
        let returnVal: string | number

        switch (type) {
            case 'string':
                returnVal = buffer.toString()
                break

            case 'uint':
                returnVal = buffer.readUInt8(0)
                break

            case 'int':
                returnVal = buffer.readInt8(0)
                break

            case 'uint16':
                returnVal = buffer.readUInt16BE(0)
                break

            case 'int16':
                returnVal = buffer.readInt16BE(0)
                break

            default:
                throw Error('unknown type "' + type + '" in file structure')
        }

        return returnVal
    }
}
