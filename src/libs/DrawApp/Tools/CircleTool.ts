import { Tool } from '@/libs/DrawApp/Tools/Tool'
import {
  DiscretizationPosition, RandomColour,
  Vector
} from '@/libs/DrawApp/Utils'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import { MouseButton } from '@/libs/DrawApp/Mouse'

export class CircleTool extends Tool {
  private dragging: boolean
  private firstPoint: Vector
  private _circlePixels: Vector[]

  public constructor (canvas: Canvas, toolType: ToolType) {
    super(canvas, toolType)
    this.dragging = false
    this._circlePixels = []
  }

  public onAction (): void {
    if (this.canvas.mouse.button === MouseButton.NONE) {
      if (this.dragging) {
        this._circlePixels.forEach(position => this.canvas.data.writeData(position, this.canvas.toolSelector.colorSelected))

        this.canvas.reloadCanvas()
        this.dragging = false
      }
    } else {
      if (!this.dragging) {
        this.firstPoint = this.canvas.mouse.dataPosition
        this._draw(this.firstPoint)

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
      Math.abs(this.firstPoint.x - this.canvas.mouse.dataPosition.x),
      Math.abs(this.firstPoint.y - this.canvas.mouse.dataPosition.y)
    )

    if (radius < 1) {
      this._draw(this.firstPoint)
    } else {
      let d = (5 - radius * 4) / 4
      let x = 0
      let y = radius

      this._circlePixels = []

      do {
        this._circlePixels.push({ x: this.firstPoint.x + x, y: this.firstPoint.y + y })
        this._circlePixels.push({ x: this.firstPoint.x + x, y: this.firstPoint.y - y })
        this._circlePixels.push({ x: this.firstPoint.x - x, y: this.firstPoint.y + y })
        this._circlePixels.push({ x: this.firstPoint.x - x, y: this.firstPoint.y - y })
        this._circlePixels.push({ x: this.firstPoint.x + y, y: this.firstPoint.y + x })
        this._circlePixels.push({ x: this.firstPoint.x + y, y: this.firstPoint.y - x })
        this._circlePixels.push({ x: this.firstPoint.x - y, y: this.firstPoint.y + x })
        this._circlePixels.push({ x: this.firstPoint.x - y, y: this.firstPoint.y - x })

        this._circlePixels.forEach(position => this._draw(position))

        if (d < 0) {
          d += 2 * x + 1
        } else {
          d += 2 * (x - y) + 1
          y--
        }
        x++
      } while (x <= y)
    }
  }

  private _draw (position: Vector): void {
    this.canvas.paintCanvas(DiscretizationPosition(position, this.canvas), this.canvas.settings.showGrid)
  }
}
