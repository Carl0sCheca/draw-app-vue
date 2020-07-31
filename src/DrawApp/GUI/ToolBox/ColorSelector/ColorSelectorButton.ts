import { GUIElement } from '../../GUIElement'
import { RGBtoHEX } from '../../../Utils/Color'
import { CheckRange, Clamp, RandomNumber, Vector } from '../../../Utils/Math'
import { ToolType } from '../../../Tools/ToolSelector'
import { PencilTool } from '../../../Tools/PencilTool'
import { ColorSelectorMain } from './ColorSelectorMain'
import { ColorSelectorSecondary } from './ColorSelectorSecondary'

export class ColorSelectorButton extends GUIElement {
  public change: boolean
  public hue: number

  public windowResize (): void {
    this.position = {
      x: this.drawApp.canvas.width - this.size.x - 5,
      y: this.drawApp.canvas.height - this.size.y - 5
    }
    this.child.forEach(element => {
      if (element.windowResize) {
        element.windowResize()
      }
    })
  }

  public init (): void {
    const colorSelectorMain: ColorSelectorMain = new ColorSelectorMain(this.drawApp, 'ColorSelectorMain')
    colorSelectorMain.parent = this
    colorSelectorMain.hoverable = false
    colorSelectorMain.selectable = false
    colorSelectorMain.size = {
      x: this.size.x,
      y: 200
    }
    colorSelectorMain.position = {
      x: this.position.x + this.size.x - colorSelectorMain.size.x,
      y: this.position.y + this.size.y - colorSelectorMain.size.y
    }
    colorSelectorMain.pixelSize = { x: colorSelectorMain.size.x / 100, y: colorSelectorMain.size.y / 100 }
    this.child.push(colorSelectorMain)

    const colorSelectorSec: ColorSelectorSecondary = new ColorSelectorSecondary(this.drawApp, 'ColorSelectorSecondary')
    colorSelectorSec.parent = this
    colorSelectorSec.hoverable = false
    colorSelectorSec.selectable = false
    colorSelectorSec.size = {
      x: this.size.x,
      y: this.size.y - colorSelectorMain.size.y
    }
    colorSelectorSec.position = {
      x: this.position.x,
      y: this.position.y
    }
    colorSelectorSec.init()
    this.child.push(colorSelectorSec)

    this.hue = 10 || RandomNumber(0, 359)
  }

  public action () {
    const position: Vector = {
      x: Clamp(this.drawApp.mouse.realPosition.x, 0, this.position.x + this.size.x - 1),
      y: Clamp(this.drawApp.mouse.realPosition.y, 0, this.position.y + this.size.y - 1)
    }

    this.child.forEach(element => {
      if (CheckRange(position, element.position, {
        x: element.position.x + element.size.x,
        y: element.position.y + element.size.y
      })) {
        element.action()
      }
    })
  }

  public ui (): void {
    // if (this.change) {
    //   this.change = false

    // let x0 = 0
    // let y0 = 0
    //
    // for (let y = 0; y < this.colorSelectorSize.y; y += this.pixelSize.y) {
    //   x0 = 0
    //   for (let x = 0; x < this.colorSelectorSize.x; x += this.pixelSize.x) {
    //     this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({
    //       H: this._hue,
    //       S: x0,
    //       V: 100 - y0
    //     }))
    //     x0++
    //     this.drawApp.ctx.fillRect(x + this.position.x, y + this.position.y, this.pixelSize.x, this.pixelSize.y)
    //   }
    //   y0++
    // }

    // this.imageDataHSV = this.drawApp.ctx.getImageData(this.position.x, this.position.y, this.colorSelectorSize.x, this.colorSelectorSize.y)
    // this.drawApp.ctx.putImageData(this.imageDataHue, this.position.x, this.position.y + this.colorSelectorSize.y)
    // } else {

    // this.drawApp.ctx.putImageData(this.imageDataHSV, this.position.x, this.position.y)
    // this.drawApp.ctx.putImageData(this.imageDataHue, this.position.x, this.position.y + this.colorSelectorSize.y)
    // }
    this.child.forEach(element => element.ui())
  }
}
