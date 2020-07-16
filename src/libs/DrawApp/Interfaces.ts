import { Vector } from '@/libs/DrawApp/Utils';

export interface ISettings {
  gridSize: number,
  pixelSize?: number,
}

export interface IZoom {
  level: number
  position: Vector
}
