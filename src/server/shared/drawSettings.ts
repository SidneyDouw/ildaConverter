import { Image } from 'canvas'

export default interface drawSettings {
    [key: string]: any

    resolution?: number
    lineWidth?: number
    fps?: number
    fileFormat?: string
    watermark?: Image | null
    watermark_alpha?: number
}
