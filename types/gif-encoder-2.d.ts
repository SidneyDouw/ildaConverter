declare module 'gif-encoder-2' {
    import { Readable } from 'stream'
    import { CanvasRenderingContext2D } from 'canvas'

    class ByteArray {
        data: number[]

        constructor()

        getData(): Buffer
        writeByte(val: number): void
        writeUTFBytes(str: string): void
        writeBytes(array: number[], offset: number, length: number): void
    }

    export default class GIFEncoder {
        out: ByteArray

        constructor(width: number, height: number, algorithm: 'neuquant', useOptimizer: boolean, totalFrames: number)

        createReadStream(rs: Readable): Readable
        emitData(): void
        start(): void
        end(): void
        addFrame(input: CanvasRenderingContext2D): void
        analyzePixels(): void
        // findClosest(c): number
        setFrameRate(fps: number): void
        setDelay(ms: number): void
        setDispose(code: number): void
        setRepeat(repeat: number): void
        // setTransparent(color): void
        setQuality(quality: number): void
        setThreshold(threshold: number): void
        setPaletteSize(size: number): void
        writeLSD(): void
        writeGraphicCtrlExt(): void
        writeNetscapeExt(): void
        writeImageDesc(): void
        writePalette(): void
        writeShort(pValue: number): void
        writePixels(): void
        finish(): void
    }
}
