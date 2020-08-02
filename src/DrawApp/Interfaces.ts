import { Vector } from './Utils/Math'

export interface ISettings {
  gridSize: number
  pixelSize?: number
  gridColor: string
  showGrid: boolean
  numColors?: number
}

export interface IZoom {
  level: number
  position?: Vector
  offset?: Vector
  minLevel: number
  maxLevel: number
  steps: number
}
