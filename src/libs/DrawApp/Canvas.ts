import { ISettings } from '@/libs/DrawApp/Interfaces'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { EventCanvas } from '@/libs/DrawApp/EventCanvas'
import { Data } from '@/libs/DrawApp/Data'
import { ToolSelector } from '@/libs/DrawApp/Tools/ToolSelector'
import { Clamp, DiscretizationDataPosition, DiscretizationPosition, RandomColour, Vector } from '@/libs/DrawApp/Utils'

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
    const algo = 4
    this.settings.zoom = {
      level: algo,
      position: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      minLevel: 1,
      maxLevel: algo
    }

    setInterval(() => {
      this.settings.zoom.offset.x -= 1
      this._reloadCanvas()
    }, 100)

    // Canvas context
    this.ctx = canvas.getContext('2d')

    // Init tool selector
    this.toolSelector = new ToolSelector(this)

    // Init canvas
    this._reloadCanvas()
  }

  public resizeWindow (): void {
    this._reloadCanvas()
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, size: number = this.settings.pixelSize): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(position.x, position.y, size, size)

    if (showGrid) {
      this.ctx.strokeStyle = 'black'
      this.ctx.strokeRect(position.x, position.y, size, size)
    }

    this.data.writeData(DiscretizationDataPosition(position, this), color)
  }

  private _reloadCanvas (): void {
    this._setSizeCanvas()
    this._zoomReload()
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

    const right: Vector = {
      x: Math.trunc((this.canvas.width - this.settings.zoom.offset.x) / this.settings.zoom.level),
      y: Math.trunc((this.canvas.width - this.settings.zoom.offset.y) / this.settings.zoom.level)
    }
    const left: Vector = {
      x: Math.trunc(-this.settings.zoom.offset.x / this.settings.zoom.level),
      y: Math.trunc(-this.settings.zoom.offset.y / this.settings.zoom.level)
    }
    const middle: Vector = {
      x: (left.x + right.x) * 0.5,
      y: (left.y + right.y) * 0.5
    }

    this.paintCanvas(middle, true, RandomColour())
    this._reloadCanvas()
  }

  public zoomOut (): void {
    this.settings.zoom.level = Clamp(
      this.settings.zoom.level - 0.25,
      this.settings.zoom.minLevel,
      this.settings.zoom.maxLevel
    )
    this._reloadCanvas()
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
