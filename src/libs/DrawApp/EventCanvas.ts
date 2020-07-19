import { Mouse, MouseButton } from '@/libs/DrawApp/Mouse'
import { Canvas } from '@/libs/DrawApp/Canvas'

export class EventCanvas {
  private readonly _canvas: Canvas

  public constructor (canvas: Canvas) {
    this._canvas = canvas

    this._canvas.canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mouseleave', () => this.onMouseLeave(this._canvas.mouse))
    this._canvas.canvas.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e))
    window.addEventListener('resize', () => this.onResizeWindow(this._canvas))
  }

  public onMouseDown (e: MouseEvent, mouse: Mouse): void {
    e.preventDefault()
    this._setupMousePosition(e, mouse)

    if (e.button === MouseButton.LEFT) {
      mouse.mouseDownLeft()
    } else if (e.button === MouseButton.RIGHT) {
      mouse.mouseDownRight()
    } else if (e.button === MouseButton.MIDDLE) {
      mouse.mouseWheelButtonDown()
    }

    this._canvas.canvas.dispatchEvent(this._canvas.toolSelector.tool.event)
  }

  public onMouseUp (e: MouseEvent, mouse: Mouse): void {
    e.preventDefault()
    this._setupMousePosition(e, mouse)

    if (e.button === MouseButton.LEFT) {
      mouse.mouseUpLeft()
    } else if (e.button === MouseButton.RIGHT) {
      mouse.mouseUpRight()
    } else if (e.button === MouseButton.MIDDLE) {
      mouse.mouseWheelButtonUp()
    }
  }

  public onMouseWheel (e: WheelEvent, mouse: Mouse): void {
    e.preventDefault()

    this._setupMousePosition(e, mouse)

    if (e.deltaY > 0) {
      mouse.mouseWheelDown()
    } else if (e.deltaY < 0) {
      mouse.mouseWheelUp()
    }
  }

  public onMouseMove (e: MouseEvent, mouse: Mouse): void {
    this._setupMousePosition(e, mouse)
    this._canvas.canvas.dispatchEvent(this._canvas.toolSelector.tool.event)
  }

  public onMouseLeave (mouse: Mouse): void {
    mouse.mouseLeave()
  }

  public onContextMenu (e: MouseEvent): void {
    e.preventDefault()
  }

  public onResizeWindow (canvas: Canvas): void {
    canvas.resizeWindow()
  }

  private _setupMousePosition (e: MouseEvent, mouse: Mouse): void {
    mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y }
    mouse.mouseMove({ x: e.offsetX, y: e.offsetY })
  }
}
