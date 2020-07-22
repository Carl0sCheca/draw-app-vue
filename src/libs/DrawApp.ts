import { ISettings } from './DrawApp/Interfaces'
import { Canvas } from '@/libs/DrawApp/Canvas'

export class DrawApp {
  private readonly _canvas: Canvas

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    this._canvas = new Canvas(canvas, settings)
  }
}
