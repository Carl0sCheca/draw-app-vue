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
  public rainbowColor: number
  public rainbow: boolean
  public size: number

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)

    this.rainbow = false
    this.size = 1
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
    this.rainbowColor++
    if (this.rainbowColor > 360) {
      this.rainbowColor = 0
    }

    let color: string
    if (this.rainbow) {
      color = HSLtoString(HSVtoHSL({ H: this.rainbowColor, S: 100, V: 100 }))
    } else {
      color = this.drawApp.toolSelector.colorSelected
    }

    if (this.size === 1) {
      this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color)
      this.drawApp.data.writeData(position, color)
    } else {
      const positions: Array<Vector> = [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y }
      ]
      positions.forEach(pos => {
        this.drawApp.paintCanvas(DiscretizationPosition(pos, this.drawApp), this.drawApp.settings.showGrid, color)
        this.drawApp.data.writeData(pos, color)
      })
    }
  }
}
