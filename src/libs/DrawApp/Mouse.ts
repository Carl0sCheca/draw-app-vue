import { DiscretizationDataPosition, DiscretizationPosition, Vector } from '@/libs/DrawApp/Utils'
import { Canvas } from '@/libs/DrawApp/Canvas'

export enum MouseButton {
  NONE = -1,
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export class Mouse {
  public realPosition: Vector
  public lastPosition: Vector
  public clicked: MouseButton

  private readonly _canvas: Canvas

  public constructor (canvas: Canvas) {
    this._canvas = canvas
    this.clicked = MouseButton.NONE
    this.realPosition = { x: 0, y: 0 }
    this.lastPosition = { x: 0, y: 0 }
  }

  public get position (): Vector {
    return DiscretizationPosition(this.dataPosition, this._canvas)
  }

  public get relativeRealPosition (): Vector {
    const position: Vector = { x: this.realPosition.x, y: this.realPosition.y }
    position.x -= this._canvas.settings.zoom.offset.x
    position.x /= this._canvas.settings.zoom.level

    position.y -= this._canvas.settings.zoom.offset.y
    position.y /= this._canvas.settings.zoom.level
    return position
  }

  public get dataPosition (): Vector {
    return DiscretizationDataPosition(this.relativeRealPosition, this._canvas)
  }

  public mouseDownLeft (): void {
    this.clicked = MouseButton.LEFT
  }

  public mouseDownRight (): void {
    this.clicked = MouseButton.RIGHT
  }

  public mouseUpLeft (): void {
    this.clicked = MouseButton.NONE
  }

  public mouseUpRight (): void {
    this.clicked = MouseButton.NONE
  }

  public mouseWheelDown (): void {
    this._canvas.zoomOut()
  }

  public mouseWheelUp (): void {
    this._canvas.zoomIn()
  }

  public mouseMove (position: Vector): void {
    this.realPosition = position
  }

  public mouseLeave (): void {
    this.clicked = MouseButton.NONE
  }
}
