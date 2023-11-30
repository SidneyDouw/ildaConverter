import { Canvas } from 'canvas'

declare module 'canvas' {
    export interface CanvasRenderingContext2D {
        canvas: Canvas
    }
}
