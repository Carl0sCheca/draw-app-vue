import { Mouse, MouseButton, MouseScroll } from './Mouse'
import { DrawApp } from './DrawApp'
import { Vector, VectorZero } from './Utils/Math'

interface EventButton {
  button?: MouseButton;
  position?: Vector;
  scroll?: number;
}

export class EventCanvas {
  public constructor (private readonly _drawApp: DrawApp) {
    window.addEventListener('resize', () => this.onResizeWindow(this._drawApp))

    // Mouse
    this._drawApp.canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e))
    this._drawApp.canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e))
    this._drawApp.canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e))
    this._drawApp.canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e))
    this._drawApp.canvas.addEventListener('mouseenter', (e: MouseEvent) => this.onMouseEnter(e))
    this._drawApp.canvas.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e))

    // Touch
    this._drawApp.canvas.addEventListener('touchstart', (e: TouchEvent) => e.cancelable ? e.preventDefault() : null)
    this._drawApp.canvas.addEventListener('touchmove', (e: TouchEvent) => e.cancelable ? e.preventDefault() : null)
    this._drawApp.canvas.addEventListener('touchend', (e: TouchEvent) => this.onTouchEnd(e))

    this._drawApp.touch.mc.on('press', (e: HammerInput) => this.onTouchPress(e))
    this._drawApp.touch.mc.on('move', (e: HammerInput) => this.onTouchMove(e))
    this._drawApp.touch.mc.on('twofingerspanmove twofingerspinchmove', (e: HammerInput) => this.onTwoFingersMove(e))
    this._drawApp.touch.mc.on('twofingerstap', (e: HammerInput) => this.onTwoFingersTap(e))
  }

  public onTouchEnd (e: TouchEvent): void {
    if (e.cancelable) {
      e.preventDefault()
    }

    this._drawApp.touch.touchEnd((lastPosition: Vector) => this.onButtonUp({
      button: this._drawApp.mouse.button,
      position: lastPosition
    }))
  }

  public onTouchPress (e: HammerInput): void {
    this._drawApp.touch.touchPress(e, (lastPosition: Vector) => this.onButtonDown({
      button: MouseButton.LEFT,
      position: lastPosition
    }))
  }

  public onTouchMove (e: HammerInput): void {
    this._drawApp.touch.touchMove(e, (lastPosition: Vector) => this.onMove({
      button: MouseButton.LEFT,
      position: lastPosition
    }))
  }

  public onTwoFingersMove (e: HammerInput): void {
    this._drawApp.touch.touchTwoFingers(e,
      (lastPosition: Vector) => this.onButtonDown({ button: MouseButton.MIDDLE, position: lastPosition }),
      (lastPosition: Vector, zoomIn: boolean) => this.onZoom({
        button: MouseButton.MIDDLE,
        position: lastPosition,
        scroll: zoomIn ? -1 : 1
      }))
  }

  public onTwoFingersTap (e: HammerInput): void {
    this._drawApp.touch.touchTwoFingersTap(e, () => this.onButtonDown({
      button: MouseButton.RIGHT,
      position: VectorZero
    }))
  }

  public onMouseDown (e: MouseEvent): void {
    e.preventDefault()
    this.onButtonDown({ button: e.button, position: { x: e.offsetX, y: e.offsetY } })
  }

  public onButtonDown (e: EventButton): void {
    const mouse: Mouse = this._drawApp.mouse

    this._setupMousePosition(e.position)

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

  public onMouseUp (e: MouseEvent): void {
    e.preventDefault()
    this.onButtonUp({ button: e.button, position: { x: e.offsetX, y: e.offsetY } })
  }

  private onButtonUp (e: EventButton): void {
    const mouse: Mouse = this._drawApp.mouse

    this._setupMousePosition(e.position)

    if (e.button === MouseButton.LEFT) {
      mouse.mouseUpLeft()
    } else if (e.button === MouseButton.RIGHT) {
      mouse.mouseUpRight()
      if (this._drawApp.toolSelector.tool !== undefined) {
        this._drawApp.canvas.dispatchEvent(this._drawApp.toolSelector.tool.event)
      }
    } else if (e.button === MouseButton.MIDDLE) {
      mouse.mouseWheelButtonUp()
    }

    this._dispatchEvent()
  }

  public onMouseWheel (e: WheelEvent): void {
    e.preventDefault()
    this._drawApp.mouse.scrollStep = this._drawApp.zoom.stepsMouseWheel
    this.onZoom({ scroll: e.deltaY, position: { x: e.offsetX, y: e.offsetY } })
  }

  public onZoom (e: EventButton): void {
    const mouse: Mouse = this._drawApp.mouse

    this._setupMousePosition(e.position)

    if (e.scroll > 0) {
      mouse.mouseWheelDown()
    } else if (e.scroll < 0) {
      mouse.mouseWheelUp()
    }

    if (mouse.scroll !== MouseScroll.NONE) {
      this._dispatchEvent()
      mouse.scroll = MouseScroll.NONE
      this._drawApp.toolSelector.restoreTool()
    }
  }

  public onMouseMove (e: MouseEvent): void {
    e.preventDefault()

    this.onMove({ button: e.button, position: { x: e.offsetX, y: e.offsetY } })
  }

  public onMove (e: EventButton): void {
    const mouse: Mouse = this._drawApp.mouse

    mouse.moving = true
    this._setupMousePosition(e.position)

    if (mouse.button !== MouseButton.NONE) {
      this._dispatchEvent()
    } else {
      this._drawApp.gui.mouseCheck()
    }
    mouse.moving = false
  }

  public onMouseEnter (e: MouseEvent): void {
    const mouse: Mouse = this._drawApp.mouse

    if (e.buttons === MouseButton.LEFT) {
      mouse.mouseLeave()
      this._dispatchEvent()
    }

    if (mouse.button !== MouseButton.NONE) {
      this._setupMousePosition({ x: e.offsetX, y: e.offsetY })
    }
  }

  public onContextMenu (e: MouseEvent): void {
    e.preventDefault()
  }

  public onResizeWindow (drawApp: DrawApp): void {
    drawApp.resizeWindow()
  }

  private _setupMousePosition (e: Vector): void {
    const mouse: Mouse = this._drawApp.mouse

    if (mouse.lastPosition === null) {
      mouse.mouseMove({ x: e.x, y: e.y })
      mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y }
    } else {
      mouse.lastPosition = { x: mouse.position.x, y: mouse.position.y }
      mouse.mouseMove({ x: e.x, y: e.y })
    }
  }

  private _dispatchEvent (): void {
    if (this._drawApp.toolSelector.tool !== undefined) {
      this._drawApp.gui.mouseCheck()
      this._drawApp.canvas.dispatchEvent(this._drawApp.toolSelector.tool.event)
    }
  }
}
