import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { RecursiveFillColor } from '../Utils/Canvas'
import { Vector } from '../Utils/Math'

export class BucketTool extends Tool {
  public onAction (): void {
    super.onAction()
    if (!this.canRun) {
      return
    }

    if (this.drawApp.mouse.button === MouseButton.NONE) {
      if (this._dragging) {
        this._dragging = false
        const filledPixels: Array<Vector> = []
        const position: Vector = this.drawApp.mouse.dataPosition
        RecursiveFillColor(position, this.drawApp, filledPixels, this.drawApp.data.pixels[position.x][position.y])
        this.drawApp.data.writeData(position, this.drawApp.toolSelector.colorSelected)
        filledPixels.forEach(position => this.drawApp.data.writeData(position, this.drawApp.toolSelector.colorSelected))
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
