import { Tool } from './Tool'
import { MouseButton } from '../Mouse'
import { ToolType } from './ToolSelector'
import { PencilTool } from './PencilTool'

export class ColourPickerTool extends Tool {
  public onAction (): void {
    super.onAction()
    if (!this.canRun) {
      return
    }

    if (this.drawApp.mouse.button === MouseButton.NONE) {
      if (this._dragging) {
        this._dragging = false
        this.drawApp.toolSelector.colorSelected = '#' + this.drawApp.data.pixels[this.drawApp.mouse.dataPosition.x][this.drawApp.mouse.dataPosition.y]
        const pencilTool: PencilTool = this.drawApp.toolSelector.tools.find((tool: { toolType: ToolType }) => tool.toolType === ToolType.PENCIL) as PencilTool
        pencilTool.rainbow = false
      }
    } else if (this.drawApp.mouse.button === MouseButton.LEFT) {
      if (!this._dragging) {
        this._dragging = true
      } else if (this._dragging) {
      }
    }
  }
}
