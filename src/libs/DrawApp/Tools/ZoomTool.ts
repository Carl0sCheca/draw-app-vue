import { DrawApp } from '@/libs/DrawApp/DrawApp'
import { IZoom } from '@/libs/DrawApp/Interfaces'
import { Clamp, Vector } from '@/libs/DrawApp/Utils/Math'
import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import { MouseButton, MouseScroll } from '@/libs/DrawApp/Mouse'

export class ZoomTool extends Tool implements IZoom {
  public level: number
  public maxLevel: number
  public minLevel: number
  public offset: Vector
  public position: Vector
  public steps: number

  public constructor (canvas: DrawApp, toolType: ToolType, settings: IZoom) {
    super(canvas, toolType)

    this.level = settings.level
    this.maxLevel = settings.maxLevel
    this.minLevel = settings.minLevel
    this.offset = { x: 0, y: 0 }
    this.position = { x: 0, y: 0 }
    this.steps = settings.steps
  }

  public zoomIn (): void {
    this._zoomScaled(this.steps)
  }

  public zoomOut (): void {
    this._zoomScaled(-this.steps)
  }

  private _zoomScaled (zoom: number): void {
    const position: Vector = {
      x: this.canvas.mouse.relativeRealPosition.x / this.canvas.canvas.width,
      y: this.canvas.mouse.relativeRealPosition.y / this.canvas.canvas.height
    }

    this.level = Clamp(
      this.level + zoom,
      this.minLevel,
      this.maxLevel
    )

    this.offset = {
      x: -Clamp(
        ((this.canvas.canvas.width * this.level * position.x) - this.canvas.mouse.realPosition.x),
        0,
        (this.canvas.canvas.width * this.level) - this.canvas.canvas.width
      ),
      y: -Clamp(
        ((this.canvas.canvas.height * this.level * position.y) - this.canvas.mouse.realPosition.y),
        0,
        (this.canvas.canvas.height * this.level) - this.canvas.canvas.height
      )
    }

    this.canvas.reloadCanvas()
  }

  public onAction (): void {
    if (this.canvas.mouse.button !== MouseButton.NONE) {
      return
    }

    if (this.canvas.mouse.scroll === MouseScroll.UP) {
      this.zoomIn()
    } else if (this.canvas.mouse.scroll === MouseScroll.DOWN) {
      this.zoomOut()
    }
  }
}
