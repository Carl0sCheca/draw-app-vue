import { Vector, VectorZero, RandomColor, Clamp, Lerp } from './DrawApp/Utils'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { ISettings } from './DrawApp/Interfaces'

export class DrawApp {
  private _ctx: CanvasRenderingContext2D
  private readonly _mousePos: Vector
  private _mousePosPrev: Vector
  private _mouseClicked: boolean
  private _mouseOffset: Vector
  private _pixelSize: number
  private _zoom: number
  private _zoomPoint: Vector
  private readonly _maxPixels: number
  private _pixels: string[][]

  private readonly color1: string
  private readonly color2: string
  private readonly color3: string
  private readonly color4: string

  public constructor (canvas: HTMLCanvasElement, settings: ISettings) {
    this._ctx = canvas.getContext('2d')
    this._mousePos = { x: 0, y: 0 }
    this._mousePosPrev = { x: 0, y: 0 }
    this._mouseOffset = { x: 0, y: 0 }
    this._zoom = 1
    this._zoomPoint = null
    this._maxPixels = settings.gridSize
    this._mouseClicked = false

    this.color1 = RandomColor()
    this.color2 = RandomColor()
    this.color3 = RandomColor()
    this.color4 = RandomColor()

    this._setSizeCanvas()
    this.clearCanvas(true)

    this._ctx.canvas.addEventListener('mousemove', this._mouseMoveEvent.bind(this))
    this._ctx.canvas.addEventListener('wheel', this._mouseWheelEvent.bind(this))
    this._ctx.canvas.addEventListener('mousedown', this._mouseDownEvent.bind(this))
    this._ctx.canvas.addEventListener('mouseleave', () => {
      this._mouseClicked = false
    })
    this._ctx.canvas.addEventListener('mouseup', () => {
      this._mouseClicked = false
    })
    this._ctx.canvas.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault())
    window.addEventListener('resize', this._windowResizeEvent.bind(this))
  }

  public init () {
    this._ctx.transform(this._zoom, 0, 0, this._zoom, this._mouseOffset.x, this._mouseOffset.y)

    this._ctx.strokeStyle = this.color1
    this._ctx.lineWidth = this._pixelSize < 40 ? 9 : 11
    this._ctx.strokeRect(-2, -2, this._ctx.canvas.width + 4, this._ctx.canvas.height + 4)

    this._ctx.lineWidth = this._pixelSize < 40 ? 2 : 4
    for (let i = 0; i < this._maxPixels; i++) {
      for (let j = 0; j < this._maxPixels; j++) {
        this._ctx.strokeRect(i * this._pixelSize, j * this._pixelSize, this._pixelSize, this._pixelSize)
      }
    }
  }

  private _windowResizeEvent (): void {
    this._setSizeCanvas()
    this.init()
    this._redrawCanvas()
  }

  public clearCanvas (init = false): void {
    this._ctx.fillStyle = 'white'
    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)
    if (init) this._pixels = []
    for (let i = 0; i < this._maxPixels; i++) {
      if (init) this._pixels[i] = []
      for (let j = 0; j < this._maxPixels; j++) {
        this._pixels[i][j] = '#ffffff'
      }
    }
  }

  private _redrawCanvas (): void {
    this._ctx.fillStyle = 'white'
    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)
    for (let i = 0; i < this._maxPixels; i++) {
      for (let j = 0; j < this._maxPixels; j++) {
        this._ctx.fillStyle = this._pixels[i][j]
        this._ctx.fillRect(i * this._pixelSize, j * this._pixelSize, this._pixelSize, this._pixelSize)

        this._ctx.strokeStyle = this.color1
        this._ctx.strokeRect(i * this._pixelSize, j * this._pixelSize, this._pixelSize, this._pixelSize)
      }
    }
  }

  private _setSizeCanvas (): void {
    this._ctx.canvas.width = (this._ctx.canvas as HTMLElement).offsetWidth
    this._ctx.canvas.height = (this._ctx.canvas as HTMLElement).offsetHeight
    this._pixelSize = this._ctx.canvas.width / this._maxPixels
    // console.log(this._pixelSize)
  }

  private _setMousePos (e: MouseEvent): void {
    this._mousePos.x = Math.trunc((Math.trunc(e.offsetX / (this._ctx.canvas as HTMLElement).offsetWidth * this._ctx.canvas.width) - this._mouseOffset.x) / this._zoom)
    this._mousePos.y = Math.trunc((Math.trunc(e.offsetY / (this._ctx.canvas as HTMLElement).offsetHeight * this._ctx.canvas.width) - this._mouseOffset.y) / this._zoom)
  }

  private _mouseMoveEvent (e: MouseEvent): void {
    this._mousePosPrev = { x: this._mousePos.x, y: this._mousePos.y }
    this._setMousePos(e)

    if (this._zoomPoint !== null) {
      this._zoomPoint = null
    }

    if (this._mouseClicked) {
      const distance: number = Math.max(Math.abs(this._mousePosPrev.x - this._mousePos.x), Math.abs(this._mousePosPrev.y - this._mousePos.y))
      const _lerpSteps: number = 0.5 / distance

      let currentPos: Vector = { x: this._mousePos.x, y: this._mousePos.y }

      for (let _lerp = 0; _lerp <= 1; _lerp += _lerpSteps) {
        currentPos = {
          x: Math.trunc(Lerp(this._mousePosPrev.x, this._mousePos.x, _lerp)),
          y: Math.trunc(Lerp(this._mousePosPrev.y, this._mousePos.y, _lerp))
        }

        this._ctx.fillStyle = this.color3
        this._ctx.fillRect(Math.trunc((currentPos.x / this._ctx.canvas.width) * this._maxPixels * this._pixelSize), currentPos.y, this._pixelSize, this._pixelSize)

        this._pixels[Math.trunc((currentPos.x / this._ctx.canvas.width) * this._maxPixels)][Math.trunc((currentPos.y / this._ctx.canvas.width) * this._maxPixels)] = 'red'
      }
    }
  }

  private _mouseWheelEvent (e: WheelEvent): void {
    e.preventDefault()

    this._setSizeCanvas()

    if (this._zoomPoint === null) {
      this._setMousePos(e)
      this._zoomPoint = {
        x: this._mousePos.x,
        y: this._mousePos.y
        // Para saltos de cuadrado en cuadrado con el zoom
        // x: Math.trunc(this._mousePos.x / this._pixelSize) * this._pixelSize,
        // y: Math.trunc(this._mousePos.y / this._pixelSize) * this._pixelSize
      }
    }

    let moved = false
    // let zoomOut = false
    if (e.deltaY < 0 && this._zoom < 4) { // up scrolling
      moved = true
      this._zoom += 0.25
    } else if (e.deltaY > 0 && this._zoom > 1) { // down scrolling
      moved = true
      // zoomOut = true
      this._zoom -= 0.25
    }

    const size: number = this._ctx.canvas.width * this._zoom
    const pixelQty: number = this._ctx.canvas.width / (this._pixelSize * this._zoom)
    const maxSize: number = -size + ((size / this._maxPixels) * pixelQty)
    const pixelSize: number = this._pixelSize * this._zoom

    if (moved) {
      this._mouseOffset.x = pixelSize * (pixelQty * 0.5) - (pixelSize * (this._zoomPoint.x / this._pixelSize))
      this._mouseOffset.y = pixelSize * (pixelQty * 0.5) - (pixelSize * (this._zoomPoint.y / this._pixelSize))

      this._mouseOffset.x = Clamp(this._mouseOffset.x, maxSize, 0)
      this._mouseOffset.y = Clamp(this._mouseOffset.y, maxSize, 0)
    }

    // if (zoomOut) {
    //   const leftCanvas: Vector = {
    //     x: this._maxPixels - (((size + this._mouseOffset.x) / this._ctx.canvas.width) * pixelQty),
    //     y: this._maxPixels - (((size + this._mouseOffset.y) / this._ctx.canvas.width) * pixelQty)
    //   }
    //   const centerCanvas: Vector = { x: leftCanvas.x + (pixelQty * 0.5), y: leftCanvas.y + (pixelQty * 0.5) }
    //   this._pixels[Math.trunc(centerCanvas.x)][Math.trunc(centerCanvas.y)] = 'red'
    //
    //   this._mouseOffset.x = pixelSize * (pixelQty * 0.5) - (pixelSize * centerCanvas.x)
    //   this._mouseOffset.y = pixelSize * (pixelQty * 0.5) - (pixelSize * centerCanvas.y)
    //
    //   this._mouseOffset.x = Clamp(this._mouseOffset.x, maxSize, 0)
    //   this._mouseOffset.y = Clamp(this._mouseOffset.y, maxSize, 0)
    // }

    this.init()
    this._redrawCanvas()
  }

  private _mouseDownEvent (e: MouseEvent): void {
    if (e.button === MouseButton.LEFT) {
      this._setMousePos(e)

      if (this._mousePos.x < 0 || this._mousePos.x > this._ctx.canvas.width ||
        this._mousePos.y < 0 || this._mousePos.y > this._ctx.canvas.height) {
        return
      }

      if (!this._mouseClicked) {
        const x: number = Math.trunc(this._mousePos.x / this._pixelSize) * this._pixelSize
        const y: number = Math.trunc(this._mousePos.y / this._pixelSize) * this._pixelSize

        const color: string = RandomColor()
        this._pixels[x / this._pixelSize][y / this._pixelSize] = color

        this._ctx.fillStyle = color
        this._ctx.fillRect(x, y, this._pixelSize, this._pixelSize)

        this._ctx.strokeStyle = this.color1
        this._ctx.strokeRect(x, y, this._pixelSize, this._pixelSize)

        this._mousePosPrev = { x, y }
        this._mouseClicked = true
      } else {
        // coso
      }
    } else if (e.button === MouseButton.RIGHT) {
      console.log('boton derecho')
    }
  }
}
