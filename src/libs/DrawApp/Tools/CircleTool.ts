import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { DiscretizationPosition, PushIfNotExists, RecursiveFill, Vector } from '@/libs/DrawApp/Utils'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import { MouseButton } from '@/libs/DrawApp/Mouse'

export class CircleTool extends Tool {
  private dragging: boolean
  private centerCircle: Vector
  private _circlePixels: Vector[]
  public fill: boolean

  public constructor (canvas: Canvas, toolType: ToolType) {
    super(canvas, toolType)
    this.dragging = false
    this._circlePixels = []
    this.fill = true
  }

  public onAction (): void {
    if (this.canvas.mouse.button === MouseButton.NONE) {
      if (this.dragging) {
        this._circlePixels.forEach(position => this.canvas.data.writeData(position, this.canvas.toolSelector.colorSelected))

        this.canvas.reloadCanvas()
        this.dragging = false
      }
    } else if (this.canvas.mouse.button === MouseButton.LEFT) {
      if (!this.dragging) {
        this.centerCircle = this.canvas.mouse.dataPosition
        this._draw(this.centerCircle)

        this.dragging = true
      } else if (this.dragging) {
        if (this.canvas.mouse.position.x !== this.canvas.mouse.lastPosition.x || this.canvas.mouse.position.y !== this.canvas.mouse.lastPosition.y) {
          this.canvas.reloadCanvas()
          this._circle()
        }
      }
    }
  }

  private _circle (): void {
    if (!this.dragging) return

    const radius: number = Math.max(
      Math.abs(this.centerCircle.x - this.canvas.mouse.dataPosition.x),
      Math.abs(this.centerCircle.y - this.canvas.mouse.dataPosition.y)
    )

    if (radius < 1) {
      this._draw(this.centerCircle)
    } else {
      let d = (5 - radius * 4) / 4
      let x = 0
      let y = radius

      this._circlePixels = []

      do {
        PushIfNotExists({ x: this.centerCircle.x + x, y: this.centerCircle.y + y }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x + x, y: this.centerCircle.y - y }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x - x, y: this.centerCircle.y + y }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x - x, y: this.centerCircle.y - y }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x + y, y: this.centerCircle.y + x }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x + y, y: this.centerCircle.y - x }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x - y, y: this.centerCircle.y + x }, this._circlePixels)
        PushIfNotExists({ x: this.centerCircle.x - y, y: this.centerCircle.y - x }, this._circlePixels)

        if (d < 0) {
          d += 2 * x + 1
        } else {
          d += 2 * (x - y) + 1
          y--
        }

        x++
      } while (x <= y)

      if (this.fill) {
        PushIfNotExists(this.centerCircle, this._circlePixels)
        RecursiveFill(this.centerCircle, this.canvas, this._circlePixels)
      }

      this._circlePixels.forEach(position => this._draw(position))
    }
  }

  private _draw (position: Vector): void {
    this.canvas.paintCanvas(DiscretizationPosition(position, this.canvas), this.canvas.settings.showGrid)
  }
}
