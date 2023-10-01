import { Settings } from './Interfaces'
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
  public readonly mouse: Mouse
  public readonly touch: Touch
  public readonly eventCanvas: EventCanvas
  public readonly settings: Settings
  public readonly data: Data
  public readonly toolSelector: ToolSelector
  public readonly ctx: CanvasRenderingContext2D
  public readonly gui: GUI

  public readonly zoom: ZoomTool

  public constructor (public readonly canvas: HTMLCanvasElement, settings: Settings) {
    // Init canvas, mouse and events from canvas
    this.mouse = new Mouse(this)
    this.touch = new Touch(this)
    this.eventCanvas = new EventCanvas(this)

    // Data and setting from canvas
    this.data = new Data(this, settings.gridSize)
    this.settings = settings
    this.settings.numColors = 20

    // DrawApp context
    this.ctx = canvas.getContext('2d', { alpha: false })!

    // Init Tool Selector
    this.toolSelector = new ToolSelector(this)

    // Zoom from Tool Selector
    this.zoom = (this.toolSelector.tools[ToolType.ZOOM] as ZoomTool)

    // Set canvas size for GUI
    this.setSizeCanvas()

    // Init GUI
    this.gui = new GUI(this)
    this.gui.initToolBox()

    // Init canvas
    this.reloadCanvas()
  }

  public getData (): string[][] {
    return this.data.pixels
  }

  public loadData (pixels: string[][]): void {
    this.data.pixels = pixels
    this.reloadCanvas()
  }

  public saveImage (): void {
    let wasGridEnabled = false;
    if (this.settings.showGrid) {
      wasGridEnabled = true;
      this.toggleGrid();
    }
    const canvasUrl = this.canvas.toDataURL()
    const createEl = document.createElement('a')
    createEl.href = canvasUrl
    createEl.download = 'image'

    createEl.click()
    createEl.remove()

    if (wasGridEnabled) {
      this.toggleGrid();
    }
  }

  public paintCanvas (position: Vector, showGrid = false, color: string = this.toolSelector.colorSelected, sizeWidth: number = this.settings.pixelSize!, sizeHeight: number = this.settings.pixelSize!): void {
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

    if (showGrid && this.mouse.button !== MouseButton.MIDDLE) {
      if (this.touch.touchAction !== TouchAction.MOVEZOOM) {
        this.ctx.lineWidth = this.zoom.level
        this.ctx.strokeStyle = this.settings.gridColor
        this.ctx.strokeRect(point.x + 0.5, point.y + 0.5, pointSizeW - 0.5, pointSizeH - 0.5)
      }
    }
  }

  public resizeWindow (): void {
    this.zoom.zoomIn()
    this.zoom.zoomOut()
    this.reloadCanvas()
    this.gui.guiElements.forEach(element => {
      if (element.windowResize) {
        element.windowResize()
      }
    })
    this.gui.reloadGUI()
  }

  public reloadCanvas (): void {
    // console.time('reloadCanvas')
    this.setSizeCanvas()
    this._redrawCanvas()
    // console.timeEnd('reloadCanvas')
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
      x: this.settings.pixelSize!,
      y: this.settings.pixelSize!
    })))
    const endPoint: Vector = VectorClamp(VectorCeil(VectorAbs(VectorDiv(RightPointCanvas(this), {
      x: this.settings.pixelSize!,
      y: this.settings.pixelSize!
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
