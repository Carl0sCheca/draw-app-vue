import { Vector } from '@/libs/DrawApp/Utils';

export interface ISettings {
  gridSize: number
  pixelSize?: number
  zoom?: IZoom
}

export interface IZoom {
  level: number
  position: Vector
  offset: Vector
  minLevel: number
  maxLevel: number
}
