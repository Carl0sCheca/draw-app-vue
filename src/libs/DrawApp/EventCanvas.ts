import { Mouse, MouseButton } from '@/libs/DrawApp/Mouse'

export class EventCanvas {
  public onMouseDown (this: Mouse, e: MouseEvent): void {
    if (e.button === MouseButton.LEFT) {
      this.mouseDownLeft()
    } else if (e.button === MouseButton.RIGHT) {
      this.mouseDownRight()
    }
  }

  public onMouseUp (this: Mouse, e: MouseEvent): void {
    if (e.button === MouseButton.LEFT) {
      this.mouseUpLeft()
    } else if (e.button === MouseButton.RIGHT) {
      this.mouseUpRight()
    }
  }

  public onMouseWheel (this: Mouse, e: WheelEvent): void {
    e.preventDefault()
    if (e.deltaY > 0) {
      this.mouseWheelDown()
    } else if (e.deltaY < 0) {
      this.mouseWheelUp()
    }
  }

  public onMouseMove (this: Mouse, e: MouseEvent): void {
    this.mouseMove({ x: e.offsetX, y: e.offsetY })
  }

  public onMouseLeave (this: Mouse): void {
    this.mouseLeave()
  }

  public onContextMenu (e: MouseEvent): void {
    e.preventDefault()
  }
}
