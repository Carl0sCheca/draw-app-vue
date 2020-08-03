import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { RecursiveFillColor } from '../Utils/Canvas'
import { Vector } from '../Utils/Math'
import { Pixel, Type } from '../Data'

export class BucketTool extends Tool {
  public onAction (): void {
    super.onAction()
    if (!this.canRun) {
      return
    }

    if (this.drawApp.mouse.button === MouseButton.NONE) {
      if (this._dragging) {
        this._dragging = false

        this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected

        const filledPixels: Pixel = { positions: [], color: this.drawApp.ctx.fillStyle, type: Type.Array }
        const position: Vector = this.drawApp.mouse.dataPosition

        filledPixels.positions.push(position)
        RecursiveFillColor(position, this.drawApp, filledPixels.positions, this.drawApp.data.pixels[position.x][position.y])

        this.drawApp.data.writeData(filledPixels)

        this.drawApp.reloadCanvas()
      }
    } else if (this.drawApp.mouse.button === MouseButton.LEFT) {
      if (!this._dragging) {
        this._dragging = true
      } else if (this._dragging) {
      }
    }
  }
}
