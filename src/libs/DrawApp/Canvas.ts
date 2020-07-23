import { ISettings } from '@/libs/DrawApp/Interfaces'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { EventCanvas } from '@/libs/DrawApp/EventCanvas'
import { Data } from '@/libs/DrawApp/Data'
import { ToolSelector, ToolType } from '@/libs/DrawApp/Tools/ToolSelector'
import { DiscretizationDataPosition, DiscretizationPosition, Vector } from '@/libs/DrawApp/Utils'
import { ZoomTool } from '@/libs/DrawApp/Tools/ZoomTool'

export class Canvas {
  public readonly canvas: HTMLCanvasElement
  public readonly mouse: Mouse
  public readonly eventCanvas: EventCanvas
  public readonly settings: ISettings
  public readonly data: Data
  public readonly toolSelector: ToolSelector
  public readonly ctx: CanvasRenderingContext2D

  public readonly zoom: ZoomTool

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    // Init canvas, mouse and events from canvas
    this.canvas = canvas
    this.mouse = new Mouse(this)
    this.eventCanvas = new EventCanvas(this)

    // Data and setting from canvas
    this.data = new Data(settings.gridSize)
    this.settings = settings

    // Canvas context
    this.ctx = canvas.getContext('2d')

    // Init Tool Selector
    this.toolSelector = new ToolSelector(this)

    // Zoom from Tool Selector
    this.zoom = (this.toolSelector.tools[ToolType.ZOOM] as ZoomTool)

    // Init canvas
    this.reloadCanvas()
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, size: number = this.settings.pixelSize): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(
      position.x,
      position.y,
      size,
      size
    )

    if (showGrid) {
      this.ctx.strokeStyle = 'black'
      this.ctx.strokeRect(
        position.x,
        position.y,
        size,
        size
      )
    }

    this.data.writeData(DiscretizationDataPosition(position, this), color)
  }

  public resizeWindow (): void {
    this.zoom.zoomIn()
    this.zoom.zoomOut()
    this.reloadCanvas()
  }

  public reloadCanvas (): void {
    this._setSizeCanvas()
    this.zoom.zoomReload()
    this._redrawCanvas()
  }

  private _setSizeCanvas (): void {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.settings.pixelSize = this.canvas.width / this.settings.gridSize
  }

  private _redrawCanvas (): void {
    for (let i = 0; i < this.settings.gridSize; i++) {
      for (let j = 0; j < this.settings.gridSize; j++) {
        this.paintCanvas(DiscretizationPosition({
          x: i,
          y: j
        }, this), this.toolSelector.showGrid, this.data.pixels[i][j])
      }
    }
  }
}
