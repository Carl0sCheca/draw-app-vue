import { Vector, VectorZero } from '@/libs/DrawApp/Utils'

export enum MouseButton {
  NONE = -1,
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export class Mouse {
  private position: Vector
  private lastPosition: Vector
  private offset: Vector

  public clicked: MouseButton

  public constructor () {
    console.log('Mouse constructor')

    this.clicked = MouseButton.NONE
    this.position = VectorZero
    this.lastPosition = VectorZero
    this.offset = VectorZero
  }

  public mouseDownLeft (): void {
    // TODO: this
    console.log('boton izquierdo abajo')
  }

  public mouseDownRight (): void {
    // TODO: this
    console.log('boton derecho abajo')
  }

  public mouseUpLeft (): void {
    // TODO: this
    console.log('boton izquierdo arriba')
  }

  public mouseUpRight (): void {
    // TODO: this
    console.log('boton derecho arriba')
  }

  public mouseWheelDown (): void {
    // TODO: this
    console.log('rueda abajo')
  }

  public mouseWheelUp (): void {
    // TODO: this
    console.log('rueda arriba')
  }

  public mouseMove (position: Vector): void {
    // TODO: this
    this.position = position
    console.log('mouse move', this.position)
  }

  public mouseLeave (): void {
    // TODO: this
    console.log('mouse leave')
  }
}
