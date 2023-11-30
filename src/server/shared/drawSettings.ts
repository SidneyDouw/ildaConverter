import { Image } from 'canvas'

export default interface drawSettings {
    resolution?: number
    lineWidth?: number
    fps?: number
    fileFormat?: string
    watermark?: Image | null
    watermark_alpha?: number
}
