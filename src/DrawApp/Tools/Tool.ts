import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'
import { MouseButton } from '../Mouse'

export abstract class Tool {
  public name: string
  public event: Event
  public toolType: ToolType
  protected drawApp: DrawApp
  protected _dragging: boolean

  protected canRun: boolean

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    this.drawApp = drawApp
    this.toolType = toolType
    this.name = this.toolType.toString()
    this.event = new Event(this.name)
    this._dragging = false
    this.canRun = true
    drawApp.canvas.addEventListener(this.name, () => this.onAction())
  }

  public onAction (): void {
    this.canRun = this.drawApp.mouse.button !== MouseButton.RIGHT
  }
}
