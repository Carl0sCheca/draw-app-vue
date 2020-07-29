import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import {
  DiscretizationDataPosition,
  DiscretizationPosition,
  LerpSteps, RandomNumber,
  Vector
} from '../Utils/Math'
import { HSLtoString, HSVtoHSL } from '../Utils/Color'

export class PencilTool extends Tool {
  private _counter: number
  public rainbow: boolean

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)

    this._counter = RandomNumber(0, 360)
    this.rainbow = true
  }

  public onAction (): void {
    super.onAction()
    if (!this.canRun) {
      return
    }

    if (this.drawApp.mouse.button === MouseButton.LEFT) {
      if (!this._dragging) {
        this._dragging = true
        this._pencilTool(DiscretizationDataPosition(this.drawApp.mouse.position, this.drawApp))
      } else if (this.drawApp.mouse.position.x !== this.drawApp.mouse.lastPosition.x || this.drawApp.mouse.position.y !== this.drawApp.mouse.lastPosition.y) {
        LerpSteps(this.drawApp, this.drawApp.mouse.position, this.drawApp.mouse.lastPosition, (currentPos: Vector) => this._pencilTool(currentPos))
      }
    } else {
      this._dragging = false
    }
  }

  private _pencilTool (position: Vector): void {
    this._counter++
    if (this._counter > 360) {
      this._counter = 0
    }

    let color: string
    if (this.rainbow) {
      color = HSLtoString(HSVtoHSL({ H: this._counter, S: 100, V: 100 }))
    } else {
      color = this.drawApp.toolSelector.colorSelected
    }

    this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color)
    this.drawApp.data.writeData(position, color)
  }
}
