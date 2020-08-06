import { Mouse, MouseButton, MouseScroll } from './Mouse'
import { DrawApp } from './DrawApp'
import { DiscretizationDataPosition, Vector, VectorZero } from './Utils/Math'
import * as Hammer from 'hammerjs'
import { CheckIfSamePositionAsLast } from './Utils/Canvas'

interface EventButton {
  button?: MouseButton;
  position?: Vector;
  scroll?: number;
}

enum TouchAction {
  NONE,
  LEFTBUTTON,
  MOVEZOOM
}

export class EventCanvas {
  private readonly _drawApp: DrawApp

  private readonly mc: HammerManager
  private _currentDelta: Vector
  private _currentScale: number
  private _touchAction: TouchAction
  private _touchLastPosition: Vector
  private limiting: number
  private lastScale: number

  public constructor (drawApp: DrawApp) {
    this._drawApp = drawApp

    this._drawApp.canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e))
    this._drawApp.canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e))
    this._drawApp.canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e))
    this._drawApp.canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e))
    this._drawApp.canvas.addEventListener('mouseenter', (e: MouseEvent) => this.onMouseEnter(e))
    this._drawApp.canvas.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e))
    window.addEventListener('resize', () => this.onResizeWindow(this._drawApp))

    this.mc = new Hammer.Manager(drawApp.canvas)
    this._initTouch()
  }

  private _initTouch (): void {
    this._touchAction = TouchAction.NONE

    this._currentDelta = { x: 0, y: 0 }
    this._currentScale = 0

    this._drawApp.canvas.addEventListener('touchstart', (e: TouchEvent) => e.cancelable ? e.preventDefault() : null)
    this._drawApp.canvas.addEventListener('touchmove', (e: TouchEvent) => e.cancelable ? e.preventDefault() : null)
    this._drawApp.canvas.addEventListener('touchend', (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault()
      }

      this.mc.get('twofingerspan').set({ enable: true })
      this.mc.get('twofingerspinch').set({ enable: true })

      if (this._touchAction === TouchAction.LEFTBUTTON || this._touchAction === TouchAction.MOVEZOOM) {
        this.onButtonUp({ button: this._drawApp.mouse.button, position: this._touchLastPosition })
        this._touchAction = TouchAction.NONE
      }
    })

    this.mc.add(new Hammer.Press({ time: 25 }))
    this.mc.add(new Hammer.Pan({ event: 'move', pointers: 1 }))
    this.mc.add(new Hammer.Tap({ event: 'singletap' }))
    this.mc.add(new Hammer.Tap({ event: 'doubletap', pointers: 2 }))
    this.mc.add(new Hammer.Pan({ event: 'twofingerspan', pointers: 2 }))
    this.mc.add(new Hammer.Pinch({ event: 'twofingerspinch', pointers: 2 }))

    this.mc.on('press', (e: HammerInput) => {
      if (e.pointerType === 'touch') {
        if (e.pointers !== null && e.pointers[0].x !== undefined && e.pointers[0].y !== undefined) {
          this._touchLastPosition = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y })
          this.onButtonDown({
            button: MouseButton.LEFT,
            position: this._touchLastPosition
          })
          this._touchAction = TouchAction.LEFTBUTTON
        }
      }
    })

    this.mc.on('move', (e: HammerInput) => {
      if (e.pointerType === 'touch' && this._touchAction === TouchAction.LEFTBUTTON) {
        if (e.pointers !== null && e.pointers[0].x !== undefined && e.pointers[0].y !== undefined) {
          const newPos: Vector = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y })
          if (CheckIfSamePositionAsLast(DiscretizationDataPosition(newPos, this._drawApp), DiscretizationDataPosition(this._touchLastPosition, this._drawApp))) {
            this._touchLastPosition = newPos
            this.onMove({
              button: MouseButton.LEFT,
              position: this._touchLastPosition
            })
          }
        }
      }
    })

    this.mc.on('twofingerspanmove twofingerspinchmove', (e: HammerInput) => {
      if ((e.pointerType === 'touch' && this._touchAction === TouchAction.NONE) || this._touchAction === TouchAction.MOVEZOOM) {
        if (this._touchAction === TouchAction.NONE) {
          this._touchAction = TouchAction.MOVEZOOM
          this.limiting = 0
          this.lastScale = e.scale
        } else if (this._touchAction === TouchAction.MOVEZOOM) {
          if (this.limiting > 10) {
            const zoomIn: boolean = this.lastScale <= e.scale

            this._touchLastPosition = this._touchPosition({ x: e.center.x, y: e.center.y })

            const pinchMovement: number = Math.abs(this.lastScale - e.scale)

            if (pinchMovement >= 0.08) { // Zoom
              this._drawApp.mouse.scrollStep = zoomIn ? pinchMovement : pinchMovement * 2
              this.onZoom({ button: MouseButton.MIDDLE, position: this._touchLastPosition, scroll: zoomIn ? -1 : 1 })
            } else { // Move
              this.onButtonDown({ button: MouseButton.MIDDLE, position: this._touchLastPosition })
            }

            this.lastScale = e.scale
            this.limiting = 0
          } else {
            this.limiting++
          }
        }
      }
    })

    this.mc.on('doubletap', (e: HammerInput) => {
      if (e.pointerType === 'touch' && this._touchAction === TouchAction.NONE) {
        this.mc.get('twofingerspan').set({ enable: false })
        this.mc.get('twofingerspinch').set({ enable: false })
        this.onButtonDown({ button: MouseButton.RIGHT, position: VectorZero })
      }
    })

    this.mc.get('twofingerspinch').recognizeWith('doubletap')
    this.mc.get('twofingerspan').recognizeWith('doubletap')
  }

  private _touchPosition (position: Vector): Vector {
    const rect: DOMRect = this._drawApp.canvas.getBoundingClientRect()
    return { x: position.x - rect.left, y: position.y - rect.top }
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
