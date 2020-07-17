import { DiscretizationDataPosition, DiscretizationPosition, Vector, VectorZero } from '@/libs/DrawApp/Utils'
import { IZoom } from '@/libs/DrawApp/Interfaces'
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
  private _position: Vector
  private _dataPosition: Vector
  public clicked: MouseButton

  private readonly _canvas: Canvas

  public constructor (canvas: Canvas) {
    this._canvas = canvas
    this.clicked = MouseButton.NONE
    this.realPosition = VectorZero
    this._position = VectorZero
    this._dataPosition = VectorZero
    this.lastPosition = VectorZero
  }

  public get position (): Vector {
    return DiscretizationPosition(this.dataPosition, this._canvas)
  }

  public get dataPosition (): Vector {
    const position: Vector = { x: this.realPosition.x, y: this.realPosition.y }
    position.x -= this._canvas.settings.zoom.offset.x
    position.x /= this._canvas.settings.zoom.level

    position.y -= this._canvas.settings.zoom.offset.y
    position.y /= this._canvas.settings.zoom.level

    return DiscretizationDataPosition(position, this._canvas)
  }

  public mouseDownLeft (): void {
    this.clicked = MouseButton.LEFT
    // console.log('izq abajo')
  }

  public mouseDownRight (): void {
    this.clicked = MouseButton.RIGHT
    // console.log('derecha abajo')
  }

  public mouseUpLeft (): void {
    this.clicked = MouseButton.NONE
    // console.log('izq arriba')
  }

  public mouseUpRight (): void {
    this.clicked = MouseButton.NONE
    // console.log('derecha abajp')
  }

  public mouseWheelDown (): void {
    // console.log('rueda abajo')
    this._canvas.zoomOut()
  }

  public mouseWheelUp (): void {
    // console.log('rueda arriba')
    this._canvas.zoomIn()
  }

  public mouseMove (position: Vector): void {
    this.realPosition = position
    // console.log('mouse move', this.position)
  }

  public mouseLeave (): void {
    this.clicked = MouseButton.NONE
    // console.log('mouse leave')
  }
}
