import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import { DiscretizationDataPosition, DiscretizationPosition, LerpSteps, Vector } from '../Utils/Math'
import { HSLtoString, HSVtoHSL } from '../Utils/Color'
import { Data, Pixel, Type } from '../Data'

export class PencilTool extends Tool {
  public rainbowColor: number
  public rainbow: boolean
  public size: number

  private _pixelPoints: Pixel

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)

    this.rainbow = false
    this.size = 1

    this._pixelPoints = { positions: [], colors: [], type: Type.Array }
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
      if (this._pixelPoints.positions.length > 0) {
        // TODO: remove duplicated elements from start and let the last one

        this._pixelPoints = Data.FlushDuplicatedData(this._pixelPoints, this.drawApp.settings.gridSize)
        this.drawApp.data.writeData(this._pixelPoints)
        this._pixelPoints = { positions: [], colors: [], type: Type.Array }
      }

      this._dragging = false
    }
  }

  private _pencilTool (position: Vector): void {
    this.rainbowColor++
    if (this.rainbowColor > this.drawApp.settings.numColors - 1) {
      this.rainbowColor = 0
    }

    let color: string
    if (this.rainbow) {
      color = HSLtoString(HSVtoHSL({ H: this.rainbowColor * 360 / this.drawApp.settings.numColors, S: 100, V: 100 }))
    } else {
      color = this.drawApp.toolSelector.colorSelected
    }

    this.drawApp.ctx.fillStyle = color
    color = this.drawApp.ctx.fillStyle

    if (this.size === 1) {
      this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color)

      this._pixelPoints.positions.push(position)
      this._pixelPoints.colors.push(color)
    } else {
      const positions: Array<Vector> = [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y }
      ]

      positions.forEach(position => {
        this._pixelPoints.positions.push(position)
        this._pixelPoints.colors.push(color)
        this.drawApp.paintCanvas(DiscretizationPosition(position, this.drawApp), this.drawApp.settings.showGrid, color)
      })
    }
  }
}
