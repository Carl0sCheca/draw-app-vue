import { Mouse, MouseButton, MouseScroll } from './Mouse'
import { DrawApp } from './DrawApp'
import { CheckRange, HypotVector, Vector, VectorMidPoint } from './Utils/Math'

interface EventButton {
  button?: MouseButton;
  position?: Vector;
  scroll?: number;
}

enum TouchAction {
  NONE,
  ZOOM,
  MOVE
}

export class EventCanvas {
  private readonly _drawApp: DrawApp

  private _touchesLength: number
  private _touchesLocked: boolean
  private _touchAction: TouchAction
  private readonly _distancePoints: Array<number>
  private _distancePointsIndex: number
  private _lastTouchButton: MouseButton
  private _lastTouchPosition: Vector

  private readonly _touches: Array<Vector>

  public constructor (drawApp: DrawApp) {
    this._drawApp = drawApp

    this._drawApp.canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('wheel', (e: WheelEvent) => this.onMouseWheel(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('mouseenter', (e: MouseEvent) => this.onMouseEnter(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e))
    window.addEventListener('resize', () => this.onResizeWindow(this._drawApp))

    this._drawApp.canvas.addEventListener('touchstart', (e: TouchEvent) => this.onTouchStart(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('touchend', (e: TouchEvent) => this.onTouchEnd(e, this._drawApp.mouse))
    this._drawApp.canvas.addEventListener('touchmove', (e: TouchEvent) => this.onTouchMove(e, this._drawApp.mouse))
    this._touches = []
    this._touchesLength = 0
    this._touchAction = TouchAction.NONE
    this._lastTouchButton = MouseButton.NONE
    this._touchesLocked = false
    this._distancePoints = []
    this._distancePointsIndex = 0
  }

  private _touchPosition (position: Vector): Vector {
    const rect: DOMRect = this._drawApp.canvas.getBoundingClientRect()
    return { x: position.x - rect.left, y: position.y - rect.top }
  }

  private touchesDetector (e: TouchEvent, mouse: Mouse): void {
    setTimeout(() => {
      if (this._touchesLength === e.touches.length && !this._touchesLocked) {
        this._touchesLocked = true

        this._lastTouchPosition = this._touchPosition({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        })

        const eventButton: EventButton = {
          button: MouseButton.NONE,
          position: this._lastTouchPosition
        }

        switch (this._touchesLength) {
          case 1:
            eventButton.button = MouseButton.LEFT
            break
          case 2:
            this._touches[0] = this._touchPosition({
              x: e.touches[0].pageX,
              y: e.touches[0].pageY
            })
            this._touches[1] = this._touchPosition({
              x: e.touches[1].pageX,
              y: e.touches[1].pageY
            })
            break
          case 3:
            eventButton.button = MouseButton.RIGHT
            break
          default:
            eventButton.button = MouseButton.NONE
            break
        }

        this._lastTouchButton = eventButton.button

        this.onButtonDown(eventButton, mouse)
      }
    }, 50)
  }

  public onMouseDown (e: MouseEvent, mouse: Mouse): void {
    e.preventDefault()
    this.onButtonDown({ button: e.button, position: { x: e.offsetX, y: e.offsetY } }, mouse)
  }

  public onTouchStart (e: TouchEvent, mouse: Mouse): void {
    if (e.cancelable) {
      e.preventDefault()
    }

    if (this._touchesLocked) {
      return
    }
    this._touchesLength++

    this.touchesDetector(e, mouse)
  }

  public onButtonDown (e: EventButton, mouse: Mouse): void {
    this._setupMousePosition(e.position, mouse)

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
    this.onButtonUp({ button: e.button, position: { x: e.offsetX, y: e.offsetY } }, mouse)
  }

  public onTouchEnd (e: TouchEvent, mouse: Mouse): void {
    e.preventDefault()
    this._touchesLength--
    if (this._touchesLength <= 0) {
      this._touchesLocked = false
      this._touchesLength = 0

      this.onButtonUp({
        button: this._lastTouchButton,
        position: this._lastTouchPosition
      }, mouse)

      this._touchAction = TouchAction.NONE
      this._distancePointsIndex = 0
      this._lastTouchButton = MouseButton.NONE
    }
  }

  private onButtonUp (e: EventButton, mouse: Mouse): void {
    this._setupMousePosition(e.position, mouse)

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

  public onMouseWheel (e: WheelEvent, mouse: Mouse): void {
    e.preventDefault()
    this.onZoom({ scroll: e.deltaY, position: { x: e.offsetX, y: e.offsetY } }, mouse)
  }

  public onZoom (e: EventButton, mouse: Mouse): void {
    this._setupMousePosition(e.position, mouse)

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

  public onMouseMove (e: MouseEvent, mouse: Mouse): void {
    e.preventDefault()

    this.onMove({ button: e.button, position: { x: e.offsetX, y: e.offsetY } }, mouse)
  }

  public onTouchMove (e: TouchEvent, mouse: Mouse): void {
    if (e.cancelable) {
      e.preventDefault()
    }

    if (this._touchesLocked) {
      if (CheckRange(
        this._touchPosition(
          {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }), { x: 0, y: 0 }, {
          x: this._drawApp.canvas.width,
          y: this._drawApp.canvas.height
        })) {
        if (this._lastTouchButton === MouseButton.LEFT) {
          mouse.button = this._lastTouchButton

          this._lastTouchPosition = this._touchPosition({
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          })

          this.onMove({ button: this._lastTouchButton, position: this._lastTouchPosition }, mouse)
        } else if (this._lastTouchButton === MouseButton.NONE) {
          if (e.touches.length === 2) {
            const positions: Array<Vector> = []
            for (let i = 0; i < 2; i++) {
              positions[i] = this._touchPosition({ x: e.touches[i].pageX, y: e.touches[i].pageY })
            }

            const distanceFirstPosition: number = HypotVector(this._touches[0], this._touches[1])
            const distanceSecondPosition: number = HypotVector(positions[0], positions[1])

            if (this._touchAction === TouchAction.NONE) {
              this._distancePoints[this._distancePointsIndex] = distanceSecondPosition - distanceFirstPosition
              this._distancePointsIndex++

              if (this._distancePointsIndex > 2) {
                const threshold = 20
                let result = 0
                for (let i = 0; i < 3; i++) {
                  result += this._distancePoints[i]
                }

                if (Math.abs(result) < threshold) {
                  this._touchAction = TouchAction.MOVE
                } else {
                  this._touchAction = TouchAction.ZOOM
                }
              }
            } else if (this._touchAction === TouchAction.MOVE) {
              mouse.mouseWheelButtonDown()
              this.onMove({ position: this._lastTouchPosition, button: MouseButton.MIDDLE }, mouse)
              this._touchAction = TouchAction.NONE
              mouse.button = MouseButton.NONE
            } else if (this._touchAction === TouchAction.ZOOM) {
              let direction: number

              if (this._distancePoints[0] > distanceSecondPosition) {
                direction = 1
              } else {
                direction = -1
              }

              mouse.button = MouseButton.NONE

              this.onZoom({ scroll: direction, position: VectorMidPoint(positions[0], positions[1]) }, mouse)

              this._distancePoints[0] = distanceSecondPosition
              this._touchAction = TouchAction.NONE
            }
          }
        }
      } else {
        mouse.mouseLeave()
        this._dispatchEvent()
      }

      this._lastTouchPosition = this._touchPosition(
        {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        })
    }
  }

  public onMove (e: EventButton, mouse: Mouse): void {
    mouse.moving = true
    this._setupMousePosition(e.position, mouse)

    if (mouse.button !== MouseButton.NONE) {
      this._dispatchEvent()
    } else {
      this._drawApp.gui.mouseCheck()
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

  public onResizeWindow (drawApp: DrawApp): void {
    drawApp.resizeWindow()
  }

  private _setupMousePosition (e: Vector, mouse: Mouse): void {
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
