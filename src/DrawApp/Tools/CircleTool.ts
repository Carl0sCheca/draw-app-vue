import { Tool } from './Tool'
import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import { MouseButton } from '../Mouse'
import { DiscretizationPosition, Vector } from '../Utils/Math'
import { PushIfNotExists } from '../Utils/Util'
import { RecursiveFill } from '../Utils/Canvas'

export class CircleTool extends Tool {
  private dragging: boolean
  private centerCircle: Vector
  private _circlePixels: Vector[]
  public fill: boolean

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)
    this.dragging = false
    this._circlePixels = []
    this.fill = false
  }

  public onAction (): void {
    if (this.drawApp.mouse.button === MouseButton.NONE) {
      if (this.dragging) {
        this._circlePixels.forEach(position => this.drawApp.data.writeData(position, this.drawApp.toolSelector.colorSelected))

        this.drawApp.reloadCanvas()
        this.dragging = false
      }
    } else if (this.drawApp.mouse.button === MouseButton.LEFT) {
      if (!this.dragging) {
        this.centerCircle = this.drawApp.mouse.dataPosition
        this._draw(this.centerCircle)

        this.dragging = true
      } else if (this.dragging) {
        if (this.drawApp.mouse.position.x !== this.drawApp.mouse.lastPosition.x || this.drawApp.mouse.position.y !== this.drawApp.mouse.lastPosition.y) {
          this.drawApp.reloadCanvas()
          this._circle()
        }
      }
    }
  }

  private _circle (): void {
    if (!this.dragging) return

    const radius: number = Math.max(
      Math.abs(this.centerCircle.x - this.drawApp.mouse.dataPosition.x),
      Math.abs(this.centerCircle.y - this.drawApp.mouse.dataPosition.y)
    )

    if (radius < 1) {
      this._draw(this.centerCircle)
    } else {
      let d = (5 - radius * 4) / 4
      let y = radius

      this._circlePixels = []

      for (let x = 0; x <= y; x++) {
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
      }

      if (this.fill) {
        PushIfNotExists(this.centerCircle, this._circlePixels)
        RecursiveFill(this.centerCircle, this.drawApp, this._circlePixels)
      }

      this._circlePixels.forEach(position => this._draw(position))
    }
  }

  private _draw (position: Vector): void {
    this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid)
  }
}
