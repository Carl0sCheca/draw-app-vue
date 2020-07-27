import { Mouse, MouseButton, MouseScroll } from '@/libs/DrawApp/Mouse'
import { DrawApp } from '@/libs/DrawApp/DrawApp'

export class EventCanvas {
  private readonly _canvas: DrawApp

  public constructor (canvas: DrawApp) {
    this._canvas = canvas

    this._canvas.canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e, this._canvas.mouse))
    this._canvas.canvas.addEventListener('mouseenter', (e: MouseEvent) => this.onMouseEnter(e, this._canvas.mouse))
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

    if (mouse.button !== MouseButton.NONE) {
      this._dispatchEvent()
    }
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

    this._dispatchEvent()
  }

  public onMouseWheel (e: WheelEvent, mouse: Mouse): void {
    e.preventDefault()

    this._setupMousePosition(e, mouse)

    if (e.deltaY > 0) {
      mouse.mouseWheelDown()
    } else if (e.deltaY < 0) {
      mouse.mouseWheelUp()
    }
    if (mouse.scroll !== MouseScroll.NONE) {
      this._dispatchEvent()
      mouse.scroll = MouseScroll.NONE
      this._canvas.toolSelector.restoreTool()
    }
  }

  public onMouseMove (e: MouseEvent, mouse: Mouse): void {
    mouse.moving = true
    this._setupMousePosition(e, mouse)

    if (mouse.button !== MouseButton.NONE) {
      this._dispatchEvent()
    }
    mouse.moving = false
  }

  public onMouseEnter (e: MouseEvent, mouse: Mouse): void {
    if (e.buttons === MouseButton.LEFT) {
      mouse.mouseLeave()
      this._dispatchEvent()
    }

    if (mouse.button !== MouseButton.NONE) {
      this._setupMousePosition(e, mouse)
    }
  }

  public onContextMenu (e: MouseEvent): void {
    e.preventDefault()
  }

  public onResizeWindow (canvas: DrawApp): void {
    canvas.resizeWindow()
  }

  private _setupMousePosition (e: MouseEvent, mouse: Mouse): void {
    if (mouse.lastPosition === null) {
      mouse.mouseMove({ x: e.offsetX, y: e.offsetY })
      mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y }
    } else {
      mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y }
      mouse.mouseMove({ x: e.offsetX, y: e.offsetY })
    }
  }

  private _dispatchEvent (): void {
    this._canvas.gui.mouseCheck()
    this._canvas.canvas.dispatchEvent(this._canvas.toolSelector.tool.event)
    this._canvas.gui.reloadGUI()
  }
}
