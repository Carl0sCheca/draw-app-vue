import { DrawApp } from '../DrawApp'
import { GUIElement } from './GUIElement'
import { ToolBoxGUI } from './ToolBoxGUI'
import { MouseButton } from '../Mouse'
import { CheckRange } from '../Utils/Math'

export class GUI {
  private readonly _drawApp: DrawApp

  public toolbox: ToolBoxGUI

  private _clickIn: boolean

  public guiElements: GUIElement[]

  public constructor (drawApp: DrawApp) {
    this._drawApp = drawApp
    this._clickIn = true

    this.guiElements = []
    this.toolbox = new ToolBoxGUI(drawApp, 'toolboxGUI')
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
    this._centerLines()
  }

  private _centerLines (lineSize = 6): void {
    if (this._drawApp.settings.showGrid) {
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
  }

  public mouseCheck () {
    this.guiElements.forEach(element => {
      if (!element.enabled) {
        return
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
            element.child.filter(c => c.name !== child.name).forEach(c => {
              c.ui()
            })
          }
        })
      }

      if (!element.clickIn && !this._drawApp.mouse.moving) {
        element.clickIn = true

        this._drawApp.reloadCanvas()
        this.reloadGUI()

        if (GUI.CheckInsideGUIElement(this._drawApp, element)) {
          // mouse button left up inside element
          element.action()

          element.child.forEach(child => {
            if (GUI.CheckInsideGUIElement(this._drawApp, child)) {
              if (!child.selectable) {
                child.action()
                child.ui()
                this._drawApp.reloadCanvas()
                this.reloadGUI()
                return
              }

              element.child.filter(c => c.name !== child.name).forEach(c => {
                c.active = false
                c.ui()
              })

              child.action()
              child.setActive()
              child.ui()

              this._drawApp.reloadCanvas()
              this.reloadGUI()
            }
          })
        }
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
