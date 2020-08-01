import { GUIElement } from '../GUIElement'
import { ToolType } from '../../Tools/ToolSelector'
import { PencilTool } from '../../Tools/PencilTool'

export class PencilButton extends GUIElement {
  public imgAlternative: HTMLImageElement
  private _pencilTool: PencilTool

  public init (): void {
    this._pencilTool = this.drawApp.toolSelector.tools.find(tool => tool.toolType === ToolType.PENCIL) as PencilTool
  }

  public mouseUp (): void {
    if (this.drawApp.toolSelector.tool instanceof PencilTool) {
      this._pencilTool.size = this._pencilTool.size === 1 ? 2 : 1
    } else {
      this.drawApp.toolSelector.selectTool = ToolType.PENCIL
    }
  }

  public ui (): void {
    let img: HTMLImageElement
    if (this._pencilTool.size === 1) {
      img = this.img
    } else {
      img = this.imgAlternative
    }

    if (this.active) {
      this.setActive(img)
    } else {
      this.drawApp.ctx.drawImage(img, this.position.x, this.position.y, this.size.x, this.size.y)
    }
  }
}
