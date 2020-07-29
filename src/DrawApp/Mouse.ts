import { DrawApp } from './DrawApp'
import { ToolType } from './Tools/ToolSelector'
import { DiscretizationDataPosition, DiscretizationPosition, Vector } from './Utils/Math'

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

  private readonly _drawApp: DrawApp

  public constructor (drawApp: DrawApp) {
    this._drawApp = drawApp
    this.button = MouseButton.NONE
    this.scroll = MouseScroll.NONE
    this.moving = false
    this.realPosition = { x: 0, y: 0 }
    this.lastPosition = null
  }

  public get position (): Vector {
    return DiscretizationPosition(this.dataPosition, this._drawApp)
  }

  public get relativeRealPosition (): Vector {
    const position: Vector = { x: this.realPosition.x, y: this.realPosition.y }
    position.x -= this._drawApp.zoom.offset.x
    position.x /= this._drawApp.zoom.level

    position.y -= this._drawApp.zoom.offset.y
    position.y /= this._drawApp.zoom.level
    return position
  }

  public get dataPosition (): Vector {
    return DiscretizationDataPosition(this.relativeRealPosition, this._drawApp)
  }

  public mouseDownLeft (): void {
    this.button = MouseButton.LEFT
  }

  public mouseDownRight (): void {
    this.button = MouseButton.RIGHT
    this._drawApp.gui.toolbox.toggle()
  }

  public mouseUpLeft (): void {
    this.button = MouseButton.NONE
  }

  public mouseUpRight (): void {
    this.button = MouseButton.NONE
  }

  public mouseWheelButtonDown (): void {
    this.button = MouseButton.MIDDLE
    this._drawApp.toolSelector.selectTool = ToolType.MOVE
  }

  public mouseWheelButtonUp (): void {
    this.button = MouseButton.NONE
  }

  public mouseWheelDown (): void {
    if (this.button !== MouseButton.NONE) {
      return
    }

    this.scroll = MouseScroll.DOWN
    this._drawApp.toolSelector.selectTool = ToolType.ZOOM
  }

  public mouseWheelUp (): void {
    if (this.button !== MouseButton.NONE) {
      return
    }

    this.scroll = MouseScroll.UP
    this._drawApp.toolSelector.selectTool = ToolType.ZOOM
  }

  public mouseMove (position: Vector): void {
    this.realPosition = position
  }

  public mouseLeave (): void {
    this.button = MouseButton.NONE
  }
}
