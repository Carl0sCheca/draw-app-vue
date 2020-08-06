import { DrawApp } from './DrawApp'
import Hammer from 'hammerjs'
import { DiscretizationDataPosition, Vector, VectorZero } from './Utils/Math'
import { MouseButton } from './Mouse'
import { CheckIfSamePositionAsLast } from './Utils/Canvas'

enum TouchAction {
  NONE,
  LEFTBUTTON,
  MOVEZOOM
}

export class Touch {
  private readonly _drawApp: DrawApp
  public readonly mc: HammerManager

  private _touchAction: TouchAction
  private _touchLastPosition: Vector
  private limiting: number
  private lastScale: number

  public constructor (drawApp: DrawApp) {
    this._drawApp = drawApp
    this.mc = new Hammer.Manager(drawApp.canvas)

    this._touchAction = TouchAction.NONE

    this.mc.add(new Hammer.Press({ time: 25 }))
    this.mc.add(new Hammer.Pan({ event: 'move', pointers: 1 }))
    this.mc.add(new Hammer.Tap({ event: 'singletap' }))
    this.mc.add(new Hammer.Tap({ event: 'twofingerstap', pointers: 2 }))
    this.mc.add(new Hammer.Pan({ event: 'twofingerspan', pointers: 2 }))
    this.mc.add(new Hammer.Pinch({ event: 'twofingerspinch', pointers: 2 }))

    this.mc.get('twofingerspinch').recognizeWith('twofingerstap')
    this.mc.get('twofingerspan').recognizeWith('twofingerstap')
  }

  private _touchPosition (position: Vector): Vector {
    const rect: DOMRect = this._drawApp.canvas.getBoundingClientRect()
    return { x: position.x - rect.left, y: position.y - rect.top }
  }

  public touchEnd (onButtonUp: CallableFunction): void {
    this.mc.get('twofingerspan').set({ enable: true })
    this.mc.get('twofingerspinch').set({ enable: true })

    if (this._touchAction === TouchAction.LEFTBUTTON || this._touchAction === TouchAction.MOVEZOOM) {
      onButtonUp(this._touchLastPosition)
      this._touchAction = TouchAction.NONE
    }
  }

  public touchPress (e: HammerInput, onButtonDown: CallableFunction): void {
    if (e.pointerType === 'touch') {
      try {
        this._touchLastPosition = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y })
        onButtonDown(this._touchLastPosition)
        this._touchAction = TouchAction.LEFTBUTTON
      } catch (error) {
      }
    }
  }

  public touchMove (e: HammerInput, onMove: CallableFunction): void {
    if (e.pointerType === 'touch' && this._touchAction === TouchAction.LEFTBUTTON) {
      if (e.pointers !== null && e.pointers[0].x !== undefined && e.pointers[0].y !== undefined) {
        const newPos: Vector = this._touchPosition({ x: e.pointers[0].x, y: e.pointers[0].y })
        if (CheckIfSamePositionAsLast(DiscretizationDataPosition(newPos, this._drawApp), DiscretizationDataPosition(this._touchLastPosition, this._drawApp))) {
          this._touchLastPosition = newPos
          onMove(this._touchLastPosition)
        }
      }
    }
  }

  public touchTwoFingers (e: HammerInput, onButtonDown: CallableFunction, onZoom: CallableFunction): void {
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
            onZoom(this._touchLastPosition, zoomIn)
          } else { // Move
            onButtonDown(this._touchLastPosition)
          }

          this.lastScale = e.scale
          this.limiting = 0
        } else {
          this.limiting++
        }
      }
    }
  }

  public touchTwoFingersTap (e: HammerInput, onButtonDown: CallableFunction): void {
    if (e.pointerType === 'touch' && this._touchAction === TouchAction.NONE) {
      this.mc.get('twofingerspan').set({ enable: false })
      this.mc.get('twofingerspinch').set({ enable: false })
      onButtonDown()
    }
  }
}
