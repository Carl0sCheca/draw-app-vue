import { GUIElement } from '../GUIElement'
import { HSLtoString, HSVtoHSL, RGBtoHEX } from '../../Utils/Color'
import { CheckRange, Clamp, Vector } from '../../Utils/Math'
import { ToolType } from '../../Tools/ToolSelector'
import { PencilTool } from '../../Tools/PencilTool'

export class ColorSelector extends GUIElement {
  public change: boolean
  public colorSelectorSize: Vector
  public pixelSize: Vector
  public imageData: ImageData

  public setSizes (): void {
    this.colorSelectorSize = {
      x: 200,
      y: 200
    }

    this.pixelSize = { x: this.colorSelectorSize.x / 100, y: this.colorSelectorSize.y / 100 }
  }

  public action () {
    const position: Vector = {
      x: Clamp(this.drawApp.mouse.realPosition.x, 0, this.position.x + this.size.x - 1),
      y: Clamp(this.drawApp.mouse.realPosition.y, 0, this.position.y + this.size.y - 1)
    }

    if (CheckRange(position, this.position, {
      x: this.position.x + this.colorSelectorSize.x,
      y: this.position.y + this.colorSelectorSize.y
    })) {
      console.log('inside color selector')
    } else {
      if (CheckRange(position, {
        x: this.position.x,
        y: this.position.y + this.colorSelectorSize.y
      }, {
        x: this.position.x + this.size.x,
        y: this.position.y + this.size.y
      })) {
        console.log('outside color selector')
      }
    }
  }

  private onColorSelector (position: Vector): void {
    this.drawApp.toolSelector.colorSelected = RGBtoHEX(this.drawApp.ctx.getImageData(position.x, position.y, 1, 1).data as unknown as Array<number>)
    const pencilTool: PencilTool = this.drawApp.toolSelector.tools[ToolType.PENCIL] as PencilTool
    pencilTool.rainbow = false
    console.log(position, this.size, this.position, {
      x: this.position.x + this.size.x,
      y: this.position.y + this.size.y
    })
  }

  public ui (): void {
    if (this.change) {
      this.change = false

      let x0 = 0
      let y0 = 0

      for (let y = 0; y < this.colorSelectorSize.y; y += this.pixelSize.y) {
        x0 = 0
        for (let x = 0; x < this.colorSelectorSize.x; x += this.pixelSize.x) {
          this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({
            H: 0,
            S: x0,
            V: 100 - y0
          }))
          x0++
          this.drawApp.ctx.fillRect(x + this.position.x, y + this.position.y, this.pixelSize.x, this.pixelSize.y)
        }
        y0++
      }

      this.imageData = this.drawApp.ctx.getImageData(this.position.x, this.position.y, this.colorSelectorSize.x, this.colorSelectorSize.y)
    } else {
      this.drawApp.ctx.fillStyle = 'green'
      this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.colorSelectorSize.x, this.colorSelectorSize.y)

      this.drawApp.ctx.fillStyle = 'yellow'
      this.drawApp.ctx.fillRect(this.position.x, this.position.y + this.colorSelectorSize.y, this.size.x, this.size.y - this.colorSelectorSize.y)

      // this.drawApp.ctx.putImageData(this.imageData, this.position.x, this.position.y)
    }
  }
}
