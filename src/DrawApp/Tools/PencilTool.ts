import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import {
  Clamp,
  DiscretizationDataPosition,
  DiscretizationPosition,
  LerpSteps, RandomNumber,
  Vector
} from '../Utils/Math'
import { HSLtoString, HSVtoHSL } from '../Utils/Color'

export class PencilTool extends Tool {
  private _started: boolean

  private _counter: number

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)
    this._started = false

    this._counter = RandomNumber(0, 360)
  }

  public onAction (): void {
    if (this.drawApp.mouse.button === MouseButton.LEFT) {
      if (!this._started) {
        this._started = true
        this._pencilTool(DiscretizationDataPosition(this.drawApp.mouse.position, this.drawApp))
      } else if (this.drawApp.mouse.position.x !== this.drawApp.mouse.lastPosition.x || this.drawApp.mouse.position.y !== this.drawApp.mouse.lastPosition.y) {
        LerpSteps(this.drawApp, this.drawApp.mouse.position, this.drawApp.mouse.lastPosition, (currentPos: Vector) => this._pencilTool(currentPos))
      }
    } else {
      this._started = false
    }
  }

  private _pencilTool (position: Vector): void {
    const color: string = HSLtoString(HSVtoHSL({ H: Clamp(this._counter++, 0, 360), S: 100, V: 100 }))
    this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color)
    this.drawApp.data.writeData(position, color)
  }
}
