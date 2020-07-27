import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import {
  DiscretizationDataPosition,
  DiscretizationPosition,
  LerpSteps,
  RandomColour,
  Vector
} from '@/libs/DrawApp/Utils/Math'

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
        LerpSteps(this.canvas, this.canvas.mouse.position, this.canvas.mouse.lastPosition, (currentPos: Vector) => this._pencilTool(currentPos))
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
