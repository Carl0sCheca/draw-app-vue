import { Canvas } from '@/libs/DrawApp/Canvas'
import { IZoom } from '@/libs/DrawApp/Interfaces'
import { Clamp, Vector } from '@/libs/DrawApp/Utils'

export class Zoom implements IZoom {
  private _canvas: Canvas

  public level: number
  public maxLevel: number
  public minLevel: number
  public offset: Vector
  public position: Vector
  public steps: number

  public constructor (canvas: Canvas, settings: IZoom) {
    this._canvas = canvas
    this.level = settings.level
    this.maxLevel = settings.maxLevel
    this.minLevel = settings.minLevel
    this.offset = { x: 0, y: 0 }
    this.position = { x: 0, y: 0 }
    this.steps = settings.steps
  }

  public zoomIn (): void {
    this._zoomScaled(this.steps)
  }

  public zoomOut (): void {
    this._zoomScaled(-this.steps)
  }

  private _zoomScaled (zoom: number): void {
    const position: Vector = {
      x: this._canvas.mouse.relativeRealPosition.x / this._canvas.canvas.width,
      y: this._canvas.mouse.relativeRealPosition.y / this._canvas.canvas.height
    }

    this.level = Clamp(
      this.level + zoom,
      this.minLevel,
      this.maxLevel
    )

    this.offset = {
      x: -Clamp(
        ((this._canvas.canvas.width * this.level * position.x) - this._canvas.mouse.realPosition.x),
        0,
        (this._canvas.canvas.width * this.level) - this._canvas.canvas.width
      ),
      y: -Clamp(
        ((this._canvas.canvas.height * this.level * position.y) - this._canvas.mouse.realPosition.y),
        0,
        (this._canvas.canvas.height * this.level) - this._canvas.canvas.height
      )
    }

    this._canvas.reloadCanvas()
  }
}
