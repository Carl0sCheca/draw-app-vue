import { DrawApp } from '../DrawApp'
import { Zoom } from '../Interfaces'
import { Clamp, Vector } from '../Utils/Math'
import { Tool } from './Tool'
import { ToolType } from './ToolSelector'
import { MouseButton, MouseScroll } from '../Mouse'

export class ZoomTool extends Tool implements Zoom {
  public level: number
  public maxLevel: number
  public minLevel: number
  public offset: Vector
  public position: Vector
  public stepsMouseWheel: number

  public constructor (drawApp: DrawApp, toolType: ToolType, settings: Zoom) {
    super(drawApp, toolType)

    this.level = settings.level
    this.maxLevel = settings.maxLevel
    this.minLevel = settings.minLevel
    this.offset = { x: 0, y: 0 }
    this.position = { x: 0, y: 0 }
    this.stepsMouseWheel = settings.stepsMouseWheel
  }

  public zoomIn (): void {
    this._zoomScaled(this.drawApp.mouse.scrollStep)
  }

  public zoomOut (): void {
    this._zoomScaled(-this.drawApp.mouse.scrollStep)
  }

  private _zoomScaled (zoom: number): void {
    const position: Vector = {
      x: this.drawApp.mouse.relativeRealPosition.x / this.drawApp.canvas.width,
      y: this.drawApp.mouse.relativeRealPosition.y / this.drawApp.canvas.height
    }

    this.level = Clamp(
      Math.round((this.level + zoom) * 10) / 10,
      this.minLevel,
      this.maxLevel
    )

    this.offset = {
      x: -Clamp(
        ((this.drawApp.canvas.width * this.level * position.x) - this.drawApp.mouse.realPosition.x),
        0,
        (this.drawApp.canvas.width * this.level) - this.drawApp.canvas.width
      ),
      y: -Clamp(
        ((this.drawApp.canvas.height * this.level * position.y) - this.drawApp.mouse.realPosition.y),
        0,
        (this.drawApp.canvas.height * this.level) - this.drawApp.canvas.height
      )
    }

    this.drawApp.reloadCanvas()
  }

  public onAction (): void {
    super.onAction()
    if (!this.canRun) {
      return
    }

    if (this.drawApp.mouse.button !== MouseButton.NONE) {
      return
    }

    if (this.drawApp.mouse.scroll === MouseScroll.UP) {
      this.zoomIn()
    } else if (this.drawApp.mouse.scroll === MouseScroll.DOWN && this.drawApp.zoom.level !== this.drawApp.zoom.minLevel) {
      this.zoomOut()
    }
  }
}
