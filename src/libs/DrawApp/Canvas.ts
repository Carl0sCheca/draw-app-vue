import { ISettings } from '@/libs/DrawApp/Interfaces'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { EventCanvas } from '@/libs/DrawApp/EventCanvas'
import { Data } from '@/libs/DrawApp/Data'
import { ToolSelector } from '@/libs/DrawApp/Tools/ToolSelector'
import { Clamp, DiscretizationDataPosition, DiscretizationPosition, RandomColour, Vector } from '@/libs/DrawApp/Utils'
import { Zoom } from '@/libs/DrawApp/Zoom'

export class Canvas {
  public readonly canvas: HTMLCanvasElement
  public readonly mouse: Mouse
  public readonly eventCanvas: EventCanvas
  public readonly zoom: Zoom
  public readonly settings: ISettings
  public readonly data: Data
  public readonly toolSelector: ToolSelector
  public readonly ctx: CanvasRenderingContext2D

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    // Init canvas, mouse and events from canvas
    this.canvas = canvas
    this.mouse = new Mouse(this)
    this.eventCanvas = new EventCanvas(this)
    this.zoom = new Zoom(this, {
      level: 1,
      minLevel: 1,
      maxLevel: 8,
      steps: 0.1
    })

    // Data and setting from canvas
    this.data = new Data(settings.gridSize)
    this.settings = settings

    // Canvas context
    this.ctx = canvas.getContext('2d')

    // Init tool selector
    this.toolSelector = new ToolSelector(this)

    // Init canvas
    this.reloadCanvas()
  }

  public resizeWindow (): void {
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

  public reloadCanvas (): void {
    this._setSizeCanvas()
    this._zoomReload()
  }

  private _zoomReload (): void {
    this.ctx.transform(
      this.zoom.level,
      0,
      0,
      this.zoom.level,
      this.zoom.offset.x,
      this.zoom.offset.y
    )
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

  private _leftPointCanvas (): Vector {
    return {
      x: Math.trunc(-this.zoom.offset.x / this.zoom.level),
      y: Math.trunc(-this.zoom.offset.y / this.zoom.level)
    }
  }

  private _rightPointCanvas (): Vector {
    return {
      x: Math.trunc((this.canvas.width - this.zoom.offset.x) / this.zoom.level),
      y: Math.trunc((this.canvas.width - this.zoom.offset.y) / this.zoom.level)
    }
  }

  private _middlePointCanvas (): Vector {
    return {
      x: (this._leftPointCanvas().x + this._rightPointCanvas().x) * 0.5,
      y: (this._leftPointCanvas().y + this._rightPointCanvas().y) * 0.5
    }
  }

  private _pixelsOnScreen (): number {
    return (this.ctx.canvas.width - this.zoom.offset.x) / (this.settings.pixelSize * this.zoom.level)
  }
}
