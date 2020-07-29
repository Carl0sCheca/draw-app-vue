import { Tool } from './Tool'
import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import { MouseButton } from '../Mouse'
import { Vector } from '../Utils/Math'

export class MoveTool extends Tool {
  private dragging: boolean
  private firstPoint: Vector

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    super(drawApp, toolType)
    this.dragging = false
  }

  public onAction (): void {
    if (this.drawApp.mouse.button === MouseButton.NONE) {
      this.dragging = false
      this.drawApp.toolSelector.restoreTool()
      return
    }

    if (!this.dragging) {
      this.dragging = true
      this.firstPoint = this.drawApp.mouse.realPosition
    } else if (this.dragging) {
      const newPosition: Vector = {
        x: this.drawApp.zoom.offset.x - (this.firstPoint.x - this.drawApp.mouse.realPosition.x),
        y: this.drawApp.zoom.offset.y - (this.firstPoint.y - this.drawApp.mouse.realPosition.y)
      }

      if (newPosition.x <= 0 && this.drawApp.canvas.width < newPosition.x + this.drawApp.canvas.width * this.drawApp.zoom.level) {
        this.drawApp.zoom.offset.x = newPosition.x
      }

      if (newPosition.y <= 0 && this.drawApp.canvas.height < newPosition.y + this.drawApp.canvas.height * this.drawApp.zoom.level) {
        this.drawApp.zoom.offset.y = newPosition.y
      }

      this.firstPoint = this.drawApp.mouse.realPosition
      this.drawApp.reloadCanvas()
    }
  }
}
