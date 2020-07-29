import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'
import { CircleTool } from '../../Tools/CircleTool'

export class CircleButton extends GUIElement {
  public imgFilled: HTMLImageElement

  public action (): void {
    // console.log(`mouse button left up inside ${this.name}`)
    this.drawApp.toolSelector.selectTool = ToolType.CIRCLE
    const circleTool: CircleTool = this.drawApp.toolSelector.tool as CircleTool
    console.log(circleTool.fill)
    if (this.active) {
      circleTool.fill = !circleTool.fill
    }
  }

  public hide (): void {
    this.enabled = false
  }

  public show (): void {
    this.enabled = true
  }

  public ui (): void {
    const circleTool: CircleTool = this.drawApp.toolSelector.tool as CircleTool
    const image: HTMLImageElement = circleTool.fill ? this.imgFilled : this.img
    if (this.active) {
      this.setActive(image)
    } else {
      this.drawApp.ctx.drawImage(image, this._position.x, this._position.y, this.size.x, this.size.y)
    }
  }
}
