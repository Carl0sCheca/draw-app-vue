import { ITool } from '@/libs/DrawApp/ITool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { Vector } from '@/libs/DrawApp/Utils'

export class PencilTool extends ITool {
  public name: string
  public event: Event

  public constructor (canvas: Canvas) {
    super(canvas)

    this.name = 'Pencil'
    this.event = new Event(this.name)
    canvas.canvas.addEventListener(this.name, () => this.onClick())
  }

  public onClick (): void {
    if (this.canvas.mouse.clicked === MouseButton.LEFT) {
      if (this.canvas.mouse.position.x < 0 || this.canvas.mouse.position.x > this.canvas.ctx.canvas.width ||
        this.canvas.mouse.position.y < 0 || this.canvas.mouse.position.y > this.canvas.ctx.canvas.height) {
        return
      }

      const position: Vector = this.canvas.mouse.position

      this.canvas.ctx.fillStyle = 'red'
      this.canvas.ctx.fillRect(position.x, position.y, this.canvas.settings.pixelSize, this.canvas.settings.pixelSize)

      this.canvas.ctx.strokeStyle = 'black'
      this.canvas.ctx.strokeRect(position.x, position.y, this.canvas.settings.pixelSize, this.canvas.settings.pixelSize)
    }
  }
}
