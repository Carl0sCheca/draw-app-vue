import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'
import { CircleTool } from '../../Tools/CircleTool'

export class CircleButton extends GUIElement {
  public imgFilled!: HTMLImageElement

  public mouseUp (): void {
    this.drawApp.toolSelector.selectTool = ToolType.CIRCLE
    const circleTool: CircleTool = this.drawApp.toolSelector.tools[ToolType.CIRCLE] as CircleTool
    if (this.active) {
      circleTool.fill = !circleTool.fill
    }
  }

  public ui (): void {
    const circleTool: CircleTool = this.drawApp.toolSelector.tools[ToolType.CIRCLE] as CircleTool
    const image: HTMLImageElement = circleTool.fill ? this.imgFilled : this.img!
    if (this.active) {
      this.setActive(image)
    } else {
      this.drawApp.ctx.drawImage(image, this.position.x, this.position.y, this.size.x, this.size.y)
    }
  }
}
