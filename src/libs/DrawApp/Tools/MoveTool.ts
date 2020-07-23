import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { Vector } from '@/libs/DrawApp/Utils'

export class MoveTool extends Tool {
  private dragging: boolean
  private firstPoint: Vector

  public constructor (canvas: Canvas, toolType: ToolType) {
    super(canvas, toolType)
    this.dragging = false
  }

  public onAction (): void {
    if (this.canvas.mouse.button === MouseButton.NONE) {
      this.dragging = false
      this.canvas.toolSelector.restoreTool()
      return
    }

    if (!this.dragging) {
      this.dragging = true
      this.firstPoint = this.canvas.mouse.realPosition
    } else if (this.dragging) {
      const newPosition: Vector = {
        x: this.canvas.zoom.offset.x - (this.firstPoint.x - this.canvas.mouse.realPosition.x),
        y: this.canvas.zoom.offset.y - (this.firstPoint.y - this.canvas.mouse.realPosition.y)
      }

      if (newPosition.x <= 0 && this.canvas.canvas.width < newPosition.x + this.canvas.canvas.width * this.canvas.zoom.level) {
        this.canvas.zoom.offset.x = newPosition.x
      }

      if (newPosition.y <= 0 && this.canvas.canvas.height < newPosition.y + this.canvas.canvas.height * this.canvas.zoom.level) {
        this.canvas.zoom.offset.y = newPosition.y
      }

      this.firstPoint = this.canvas.mouse.realPosition
      this.canvas.reloadCanvas()
    }
  }
}
