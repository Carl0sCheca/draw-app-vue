import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'

export abstract class Tool {
  public name: string
  public event: Event
  public toolType: ToolType
  protected canvas: Canvas

  public constructor (canvas: Canvas, toolType: ToolType) {
    this.canvas = canvas
    this.toolType = toolType
    this.name = this.toolType.toString()
    this.event = new Event(this.name)
    canvas.canvas.addEventListener(this.name, () => this.onClick())
  }

  public abstract onClick(): void
}
