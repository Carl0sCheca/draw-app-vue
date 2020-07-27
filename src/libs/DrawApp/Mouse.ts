import { DiscretizationDataPosition, DiscretizationPosition, Vector } from '@/libs/DrawApp/Utils'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'

export enum MouseButton {
  NONE = -1,
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export enum MouseScroll {
  NONE = -1,
  UP = 0,
  DOWN = 1
}

export class Mouse {
  public realPosition: Vector
  public lastPosition: Vector
  public button: MouseButton
  public scroll: MouseScroll
  public moving: boolean

  private readonly _canvas: Canvas

  public constructor (canvas: Canvas) {
    this._canvas = canvas
    this.button = MouseButton.NONE
    this.scroll = MouseScroll.NONE
    this.moving = false
    this.realPosition = { x: 0, y: 0 }
    this.lastPosition = null
  }

  public get position (): Vector {
    return DiscretizationPosition(this.dataPosition, this._canvas)
  }

  public get relativeRealPosition (): Vector {
    const position: Vector = { x: this.realPosition.x, y: this.realPosition.y }
    position.x -= this._canvas.zoom.offset.x
    position.x /= this._canvas.zoom.level

    position.y -= this._canvas.zoom.offset.y
    position.y /= this._canvas.zoom.level
    return position
  }

  public get dataPosition (): Vector {
    return DiscretizationDataPosition(this.relativeRealPosition, this._canvas)
  }

  public mouseDownLeft (): void {
    this.button = MouseButton.LEFT
  }

  public mouseDownRight (): void {
    this.button = MouseButton.RIGHT
    this._canvas.gui.toggleGUI()
    // this._canvas.toggleGrid()
  }

  public mouseUpLeft (): void {
    this.button = MouseButton.NONE
  }

  public mouseUpRight (): void {
    this.button = MouseButton.NONE
  }

  public mouseWheelButtonDown (): void {
    this.button = MouseButton.MIDDLE
    this._canvas.toolSelector.selectTool = ToolType.MOVE
  }

  public mouseWheelButtonUp (): void {
    this.button = MouseButton.NONE
  }

  public mouseWheelDown (): void {
    if (this.button !== MouseButton.NONE) {
      return
    }

    this.scroll = MouseScroll.DOWN
    this._canvas.toolSelector.selectTool = ToolType.ZOOM
  }

  public mouseWheelUp (): void {
    if (this.button !== MouseButton.NONE) {
      return
    }

    this.scroll = MouseScroll.UP
    this._canvas.toolSelector.selectTool = ToolType.ZOOM
  }

  public mouseMove (position: Vector): void {
    this.realPosition = position
  }

  public mouseLeave (): void {
    this.button = MouseButton.NONE
  }
}
