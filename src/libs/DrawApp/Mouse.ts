import { Vector, VectorZero } from '@/libs/DrawApp/Utils'
import { IZoom } from '@/libs/DrawApp/Interfaces'

export enum MouseButton {
  NONE = -1,
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export class Mouse {
  public position: Vector
  public lastPosition: Vector
  public offset: Vector
  public zoom: IZoom

  public clicked: MouseButton

  public constructor () {
    this.clicked = MouseButton.NONE
    this.position = VectorZero
    this.lastPosition = VectorZero
    this.offset = VectorZero
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
  }

  public mouseWheelUp (): void {
    // console.log('rueda arriba')
  }

  public mouseMove (position: Vector): void {
    this.position = position
    // console.log('mouse move', this.position)
  }

  public mouseLeave (): void {
    this.clicked = MouseButton.NONE
    // console.log('mouse leave')
  }
}
