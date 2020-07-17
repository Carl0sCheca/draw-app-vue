import { ITool } from '@/libs/DrawApp/Tools/ITool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { DiscretizationDataPosition, DiscretizationPosition, Lerp, Vector } from '@/libs/DrawApp/Utils'

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
      if (
        this.canvas.mouse.dataPosition.x < 0 || this.canvas.mouse.dataPosition.x >= this.canvas.settings.gridSize ||
        this.canvas.mouse.dataPosition.y < 0 || this.canvas.mouse.dataPosition.y >= this.canvas.settings.gridSize ||
        this.canvas.mouse.position.x < 0 || this.canvas.mouse.position.x >= this.canvas.ctx.canvas.width ||
        this.canvas.mouse.position.y < 0 || this.canvas.mouse.position.y >= this.canvas.ctx.canvas.height
      ) {
        return
      }

      const distance: number = Math.max(
        Math.abs(this.canvas.mouse.lastPosition.x - this.canvas.mouse.position.x),
        Math.abs(this.canvas.mouse.lastPosition.y - this.canvas.mouse.position.y)
      )

      const _lerpSteps: number = 10 / distance
      let _currentPos: Vector = { x: this.canvas.mouse.position.x, y: this.canvas.mouse.position.y }

      for (let _lerp = 0; _lerp <= 1; _lerp += _lerpSteps) {
        _currentPos = DiscretizationDataPosition({
          x: Lerp(this.canvas.mouse.lastPosition.x, this.canvas.mouse.position.x, _lerp),
          y: Lerp(this.canvas.mouse.lastPosition.y, this.canvas.mouse.position.y, _lerp)
        }, this.canvas)

        this.canvas.paintCanvas(DiscretizationPosition(_currentPos, this.canvas), this.canvas.toolSelector.showGrid)
        this.canvas.data.writeData(_currentPos, this.canvas.toolSelector.colorSelected)
      }
    }
  }
}
