import { ISettings } from './Interfaces'
import { Mouse, MouseButton } from './Mouse'
import { EventCanvas } from './EventCanvas'
import { Data } from './Data'
import { ToolSelector, ToolType } from './Tools/ToolSelector'
import { ZoomTool } from './Tools/ZoomTool'
import { GUI } from './GUI/GUI'
import {
  DiscretizationPosition,
  Vector,
  VectorAbs,
  VectorCeil,
  VectorClamp,
  VectorDiv,
  VectorTrunc,
  VectorZero
} from './Utils/Math'
import { LeftPointCanvas, RightPointCanvas } from './Utils/Canvas'
import { Touch, TouchAction } from './Touch'

export class DrawApp {
  public readonly canvas: HTMLCanvasElement
  public readonly mouse: Mouse
  public readonly touch: Touch
  public readonly eventCanvas: EventCanvas
  public readonly settings: ISettings
  public readonly data: Data
  public readonly toolSelector: ToolSelector
  public readonly ctx: CanvasRenderingContext2D
  public readonly gui: GUI

  public readonly zoom: ZoomTool

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    // Init canvas, mouse and events from canvas
    this.canvas = canvas
    this.mouse = new Mouse(this)
    this.touch = new Touch(this)
    this.eventCanvas = new EventCanvas(this)

    // Data and setting from canvas
    this.data = new Data(this, settings.gridSize)
    this.settings = settings
    this.settings.numColors = 20

    // DrawApp context
    this.ctx = canvas.getContext('2d', { alpha: false })

    // Init Tool Selector
    this.toolSelector = new ToolSelector(this)

    // Zoom from Tool Selector
    this.zoom = (this.toolSelector.tools[ToolType.ZOOM] as ZoomTool)

    // Set canvas size for GUI
    this.setSizeCanvas()

    // Init GUI
    this.gui = new GUI(this)

    // Init canvas
    this.reloadCanvas()
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, sizeWidth: number = this.settings.pixelSize, sizeHeight: number = this.settings.pixelSize): void {
    const point: Vector = {
      x: position.x * this.zoom.level + this.zoom.offset.x,
      y: position.y * this.zoom.level + this.zoom.offset.y
    }

    const pointSizeW: number = sizeWidth * this.zoom.level
    const pointSizeH: number = sizeHeight * this.zoom.level

    if (color.includes('hsl')) {
      this.ctx.fillStyle = color
      color = this.ctx.fillStyle.substr(1)
    } else if (color.includes('#')) {
      color = color.substr(1)
    }

    this.ctx.fillStyle = '#' + color
    this.ctx.fillRect(point.x, point.y, pointSizeW, pointSizeH)

    if (showGrid && (this.mouse.button !== MouseButton.MIDDLE || this.touch.touchAction !== TouchAction.MOVEZOOM)) {
      this.ctx.lineWidth = this.zoom.level
      this.ctx.strokeStyle = this.settings.gridColor
      this.ctx.strokeRect(point.x, point.y, pointSizeW, pointSizeH)
    }
  }

  public resizeWindow (): void {
    this.zoom.zoomIn()
    this.zoom.zoomOut()
    this.reloadCanvas()
    this.gui.guiElements.forEach(element => {
      element.windowResize()
    })
    this.gui.reloadGUI()
  }

  public reloadCanvas (): void {
    console.time('reloadCanvas')
    this.setSizeCanvas()
    this._redrawCanvas()
    console.timeEnd('reloadCanvas')
  }

  public setSizeCanvas (): void {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.settings.pixelSize = this.canvas.width / this.settings.gridSize
  }

  public toggleGrid (): void {
    this.settings.showGrid = !this.settings.showGrid
    this.resizeWindow()
  }

  private _redrawCanvas (): void {
    const startPoint: Vector = VectorTrunc(VectorAbs(VectorDiv(LeftPointCanvas(this), {
      x: this.settings.pixelSize,
      y: this.settings.pixelSize
    })))
    const endPoint: Vector = VectorClamp(VectorCeil(VectorAbs(VectorDiv(RightPointCanvas(this), {
      x: this.settings.pixelSize,
      y: this.settings.pixelSize
    }))), VectorZero, { x: this.settings.gridSize, y: this.settings.gridSize })

    this.paintCanvas({ x: 0, y: 0 }, false, 'white', this.canvas.width, this.canvas.height)
    for (let i = startPoint.x; i < endPoint.x; i++) {
      for (let j = startPoint.y; j < endPoint.y; j++) {
        this.paintCanvas(DiscretizationPosition({
          x: i,
          y: j
        }, this), this.settings.showGrid, this.data.pixels[i][j])
      }
    }
    this.gui.reloadRelativeGUI()
  }
}
