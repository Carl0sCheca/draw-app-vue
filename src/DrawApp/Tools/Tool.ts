import { DrawApp } from '../DrawApp'
import { ToolType } from './ToolSelector'

export abstract class Tool {
  public name: string
  public event: Event
  public toolType: ToolType
  protected drawApp: DrawApp

  public constructor (drawApp: DrawApp, toolType: ToolType) {
    this.drawApp = drawApp
    this.toolType = toolType
    this.name = this.toolType.toString()
    this.event = new Event(this.name)
    drawApp.canvas.addEventListener(this.name, () => this.onAction())
  }

  public abstract onAction(): void
}
