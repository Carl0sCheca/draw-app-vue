import { DrawApp } from '@/libs/DrawApp/DrawApp'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'

export abstract class Tool {
  public name: string
  public event: Event
  public toolType: ToolType
  protected canvas: DrawApp

  public constructor (canvas: DrawApp, toolType: ToolType) {
    this.canvas = canvas
    this.toolType = toolType
    this.name = this.toolType.toString()
    this.event = new Event(this.name)
    canvas.canvas.addEventListener(this.name, () => this.onAction())
  }

  public abstract onAction(): void
}
