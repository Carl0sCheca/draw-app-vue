import { GUIElement } from '../../GUIElement'
import { CheckRange, Clamp, Vector } from '../../../Utils/Math'
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
  }

  public mouseUp () {
    const position: Vector = {
      x: Clamp(this.drawApp.mouse.realPosition.x, 0, this.position.x + this.size.x - 1),
      y: Clamp(this.drawApp.mouse.realPosition.y, 0, this.position.y + this.size.y - 1)
    }

    this.child.forEach(element => {
      if (CheckRange(position, element.position, {
        x: element.position.x + element.size.x,
        y: element.position.y + element.size.y
      })) {
        element.mouseUp()
        this.drawApp.reloadCanvas()
        this.drawApp.gui.reloadGUI()
      }
    })
  }

  public ui (): void {
    this.child.forEach(element => element.ui())
  }
}
