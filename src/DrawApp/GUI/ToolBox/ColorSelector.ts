import { GUIElement } from '../GUIElement'
import { HSLtoString, HSVtoHSL, RGBtoHEX } from '../../Utils/Color'
import { Vector } from '../../Utils/Math'
import { ToolType } from '../../Tools/ToolSelector'
import { PencilTool } from '../../Tools/PencilTool'

export class ColorSelector extends GUIElement {
  public change: boolean
  public pixelSize: Vector
  public imageData: ImageData

  public action () {
    const position: Vector = this.drawApp.mouse.realPosition
    this.drawApp.toolSelector.colorSelected = RGBtoHEX(this.drawApp.ctx.getImageData(position.x, position.y, 1, 1).data as unknown as Array<number>)
    const pencilTool: PencilTool = this.drawApp.toolSelector.tools[ToolType.PENCIL] as PencilTool
    pencilTool.rainbow = false
  }

  public ui (): void {
    if (this.change) {
      this.change = false
      let x0 = 0
      let y0 = 0
      for (let y = this.position.y + this.size.y; y > this.position.y; y -= this.pixelSize.y) {
        x0 = 0
        for (let x = this.position.x; x <= this.position.x + this.size.x; x += this.pixelSize.x) {
          this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({
            H: 0,
            S: x0,
            V: y0
          }))
          x0++
          this.drawApp.ctx.fillRect(x, y, this.pixelSize.x, this.pixelSize.y)
        }
        y0++
      }
      this.imageData = this.drawApp.ctx.getImageData(this.position.x, this.position.y, this.size.x * this.pixelSize.x, this.size.y * this.pixelSize.y)
    } else {
      this.drawApp.ctx.filter = 'hue-rotate(80deg)'
      this.drawApp.ctx.putImageData(this.imageData, this.position.x, this.position.y)
      this.drawApp.ctx.filter = 'none'
    }
  }
}
