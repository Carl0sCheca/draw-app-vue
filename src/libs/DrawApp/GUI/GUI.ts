import { Canvas } from '@/libs/DrawApp/Canvas'

export class GUI {
  private _canvas: Canvas

  public constructor (canvas: Canvas) {
    this._canvas = canvas
  }

  public reloadRelativeGUI (): void {
    this._centerLines()
  }

  private _centerLines (lineWidth = 6): void {
    if (this._canvas.settings.showGrid) {
      this._canvas.paintCanvas(
        { x: 0, y: (this._canvas.canvas.height / 2) - (lineWidth / 2) },
        false,
        this._canvas.settings.gridColor,
        this._canvas.canvas.width,
        lineWidth
      )
      this._canvas.paintCanvas(
        { x: (this._canvas.canvas.width / 2) - (lineWidth / 2), y: 0 },
        false,
        this._canvas.settings.gridColor,
        lineWidth,
        this._canvas.canvas.height
      )
    }
  }
}
