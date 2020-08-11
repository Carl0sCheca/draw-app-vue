import { DrawApp } from '../DrawApp'
import { GUIElement } from './GUIElement'
import { ToolBoxGUI } from './ToolBoxGUI'
import { MouseButton } from '../Mouse'
import { CheckRange, DiscretizationPosition, Vector } from '../Utils/Math'
import { TouchAction } from '../Touch'

export class GUI {
  public toolbox: ToolBoxGUI

  private _clickIn: boolean

  public guiElements: GUIElement[]

  public constructor (private readonly _drawApp: DrawApp) {
    this._clickIn = true

    this.guiElements = []
  }

  public initToolBox (): void {
    this.toolbox = new ToolBoxGUI(this._drawApp, 'toolboxGUI')
    this.toolbox.init(this.guiElements)
  }

  public reloadGUI (): void {
    this.guiElements.filter(element => element.enabled).forEach(element => {
      if (!element.enabled) {
        return
      }
      element.ui()
    })
  }

  public reloadRelativeGUI (): void {
    if (this._drawApp.settings.showGrid) {
      this._centerLines()
      this._gridLines()
    }
  }

  private _gridLines (): void {
    if (this._drawApp.mouse.moving && (this._drawApp.mouse.button === MouseButton.MIDDLE || this._drawApp.touch.touchAction === TouchAction.MOVEZOOM)) {
      const ctx: CanvasRenderingContext2D = this._drawApp.ctx

      ctx.beginPath()
      ctx.lineWidth = this._drawApp.zoom.level
      ctx.moveTo(0, 0)
      for (let i = 1; i < this._drawApp.settings.gridSize; i++) {
        const position: Vector = DiscretizationPosition({ x: i, y: i }, this._drawApp)

        const point: Vector = {
          x: position.x * this._drawApp.zoom.level + this._drawApp.zoom.offset.x,
          y: position.y * this._drawApp.zoom.level + this._drawApp.zoom.offset.y
        }

        ctx.moveTo(0, point.y)
        ctx.lineTo(this._drawApp.canvas.width, point.y)
        ctx.moveTo(point.x, 0)
        ctx.lineTo(point.x, this._drawApp.canvas.height)
      }
      ctx.stroke()
    }
  }

  private _centerLines (lineSize = 6): void {
    this._drawApp.paintCanvas(
      { x: 0, y: (this._drawApp.canvas.height / 2) - (lineSize / 2) },
      false,
      this._drawApp.settings.gridColor,
      this._drawApp.canvas.width,
      lineSize
    )
    this._drawApp.paintCanvas(
      { x: (this._drawApp.canvas.width / 2) - (lineSize / 2), y: 0 },
      false,
      this._drawApp.settings.gridColor,
      lineSize,
      this._drawApp.canvas.height
    )
  }

  public mouseCheck () {
    this.guiElements.forEach(element => {
      if (!element.enabled) {
        return
      }

      if (!element.clickIn && !this._drawApp.mouse.moving) {
        element.clickIn = true
        if (GUI.CheckInsideGUIElement(this._drawApp, element)) {
          // mouse button left up inside element
          if (element.mouseUp) {
            element.mouseUp()
          }
        }
      }

      if (this._drawApp.mouse.button === MouseButton.NONE) {
        this._drawApp.reloadCanvas()
        this.reloadGUI()
        element.child.forEach(child => {
          if (!child.hoverable) {
            return
          }
          if (GUI.CheckInsideGUIElement(this._drawApp, child)) {
            child.hover()
          }
        })
      }
    })

    this.guiElements.forEach(element => {
      if (GUI.CheckInsideGUIElement(this._drawApp, element)) {
        if (!element.enabled) {
          return
        }
        this._drawApp.toolSelector.tool.event.stopImmediatePropagation()

        if (element.clickIn && this._drawApp.mouse.button === MouseButton.LEFT && !this._drawApp.mouse.moving) {
          // mouse button left down inside element
          element.clickIn = false
          if (element.mouseDown) {
            element.mouseDown()
          }
        }
      }
    })
  }

  public static CheckInsideGUIElement (drawApp: DrawApp, element: GUIElement): boolean {
    return element.enabled && CheckRange(drawApp.mouse.realPosition, element.position, {
      x: element.position.x + element.size.x,
      y: element.position.y + element.size.y
    })
  }
}
