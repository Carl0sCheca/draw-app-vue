import { ISettings } from '@/libs/DrawApp/Interfaces'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { EventCanvas } from '@/libs/DrawApp/EventCanvas'
import { Data } from '@/libs/DrawApp/Data'
import { ToolSelector } from '@/libs/DrawApp/Tools/ToolSelector'
import { Clamp, DiscretizationPosition, Vector, VectorZero } from '@/libs/DrawApp/Utils'

export class Canvas {
  public readonly canvas: HTMLCanvasElement
  public readonly mouse: Mouse
  public readonly eventCanvas: EventCanvas
  public readonly settings: ISettings
  public readonly data: Data
  public readonly toolSelector: ToolSelector
  public readonly ctx: CanvasRenderingContext2D

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    // Init canvas, mouse and events from canvas
    this.canvas = canvas
    this.mouse = new Mouse(this)
    this.eventCanvas = new EventCanvas(this)

    // Data and setting from canvas
    this.data = new Data(settings.gridSize)
    this.settings = settings
    this.settings.zoom = {
      level: 1,
      position: VectorZero,
      offset: VectorZero,
      minLevel: 1,
      maxLevel: 8
    }

    // Canvas context
    this.ctx = canvas.getContext('2d')

    // Init tool selector
    this.toolSelector = new ToolSelector(this)

    this._setSizeCanvas()
    this._redrawCanvas()
  }

  public resizeWindow (): void {
    this._setSizeCanvas()
    this._zoomReload()
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, size: number = this.settings.pixelSize): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(position.x, position.y, size, size)

    if (showGrid) {
      this.ctx.strokeStyle = 'black'
      this.ctx.strokeRect(position.x, position.y, size, size)
    }
  }

  private _zoomReload (): void {
    this.ctx.transform(
      this.settings.zoom.level,
      0,
      0,
      this.settings.zoom.level,
      this.settings.zoom.offset.x,
      this.settings.zoom.offset.y
    )
    this._redrawCanvas()
  }

  public zoomIn (): void {
    this.settings.zoom.level = Clamp(
      this.settings.zoom.level + 0.25,
      this.settings.zoom.minLevel,
      this.settings.zoom.maxLevel
    )
    this._setSizeCanvas()
    this._zoomReload()
  }

  public zoomOut (): void {
    this.settings.zoom.level = Clamp(
      this.settings.zoom.level - 0.25,
      this.settings.zoom.minLevel,
      this.settings.zoom.maxLevel
    )
    this._setSizeCanvas()
    this._zoomReload()
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
