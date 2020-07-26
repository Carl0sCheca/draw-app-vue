import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import {
  DiscretizationDataPosition,
  DiscretizationPosition,
  LerpSteps,
  RandomColour,
  Vector
} from '@/libs/DrawApp/Utils'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'

export class PencilTool extends Tool {
  private _started: boolean

  public constructor (canvas: Canvas, toolType: ToolType) {
    super(canvas, toolType)
    this._started = false
  }

  public onAction (): void {
    if (this.canvas.mouse.button === MouseButton.LEFT) {
      if (!this._started) {
        this._started = true
        this._pencilTool(DiscretizationDataPosition(this.canvas.mouse.position, this.canvas))
      } else if (this.canvas.mouse.position.x !== this.canvas.mouse.lastPosition.x || this.canvas.mouse.position.y !== this.canvas.mouse.lastPosition.y) {
        const position: Vector = { x: this.canvas.mouse.position.x, y: this.canvas.mouse.position.y }
        if (position.x - this.canvas.mouse.lastPosition.x > Number.EPSILON) {
          position.x += this.canvas.settings.pixelSize / 2
        }
        if (position.y - this.canvas.mouse.lastPosition.y > Number.EPSILON) {
          position.y += this.canvas.settings.pixelSize / 2
        }
        LerpSteps(this.canvas, position, this.canvas.mouse.lastPosition, (currentPos: Vector) => this._pencilTool(currentPos))
      }
    } else {
      this._started = false
    }
  }

  private _pencilTool (position: Vector): void {
    const color: string = RandomColour()
    this.canvas.paintCanvas(DiscretizationPosition(position, this.canvas), this.canvas.settings.showGrid, color)
    this.canvas.data.writeData(position, color)
  }
}
