import { Vector } from '@/libs/DrawApp/Utils';

export interface ISettings {
  gridSize: number
  pixelSize?: number
  gridColor: string
  showGrid: boolean
}

export interface IZoom {
  level: number
  position?: Vector
  offset?: Vector
  minLevel: number
  maxLevel: number
  steps: number
}
