import { ISettings } from '@/libs/DrawApp/Interfaces'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { EventCanvas } from '@/libs/DrawApp/EventCanvas'
import { Data } from '@/libs/DrawApp/Data'
import { ToolSelector } from '@/libs/DrawApp/Tools/ToolSelector'
import { Vector } from '@/libs/DrawApp/Utils'

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

    // Canvas and setting from canvas
    this.data = new Data(settings.gridSize)
    this.settings = settings

    // Canvas context
    this.ctx = canvas.getContext('2d')

    // Init tool selector
    this.toolSelector = new ToolSelector(this)

    this._setSizeCanvas()
  }

  public resizeWindow (): void {
    // console.log('resizeWindow')
    this._setSizeCanvas()
    // this.init()
    // this._redrawCanvas()
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, size: number = this.settings.pixelSize): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(position.x, position.y, size, size)

    if (showGrid) {
      this.ctx.strokeStyle = 'black'
      this.ctx.strokeRect(position.x, position.y, size, size)
    }
  }

  private _setSizeCanvas (): void {
    this.canvas.width = (this.canvas as HTMLElement).offsetWidth
    this.canvas.height = (this.canvas as HTMLElement).offsetHeight
    this.settings.pixelSize = this.canvas.width / this.settings.gridSize
    this._redrawCanvas()
  }

  private _redrawCanvas (): void {
    for (let i = 0; i < this.settings.gridSize; i++) {
      for (let j = 0; j < this.settings.gridSize; j++) {
        this.ctx.fillStyle = this.data.pixels[i][j]
        this.ctx.fillRect(i * this.settings.pixelSize, j * this.settings.pixelSize, this.settings.pixelSize, this.settings.pixelSize)

        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(i * this.settings.pixelSize, j * this.settings.pixelSize, this.settings.pixelSize, this.settings.pixelSize)
      }
    }
  }
}
