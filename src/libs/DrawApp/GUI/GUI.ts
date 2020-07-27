import { Canvas } from '@/libs/DrawApp/Canvas'
import { EventGUI } from '@/libs/DrawApp/GUI/EventGUI'
import { GUIElement } from '@/libs/DrawApp/GUI/GUIElement'
import { ToolBoxGUI } from '@/libs/DrawApp/GUI/ToolBoxGUI'
import { MouseButton } from '@/libs/DrawApp/Mouse'
import { CheckRange } from '@/libs/DrawApp/Utils'

export class GUI {
  private readonly _canvas: Canvas
  public readonly eventGUI: EventGUI

  public guiElements: GUIElement[]

  private enabled: boolean

  public constructor (canvas: Canvas) {
    this._canvas = canvas
    this.enabled = false

    this.guiElements = []
    this.guiElements.push(new ToolBoxGUI(canvas, 'toolboxGUI'))

    this.eventGUI = new EventGUI(this._canvas)
  }

  public reloadGUI (): void {
    this.guiElements.filter(element => element.enabled).forEach(element => element.ui())
  }

  public reloadRelativeGUI (): void {
    this._centerLines()
  }

  public toggleGUI (): void {
    this.enabled = !this.enabled
    if (this.enabled) {
      this._canvas.canvas.dispatchEvent(this.eventGUI.events.guiEnable)
    } else {
      this._canvas.canvas.dispatchEvent(this.eventGUI.events.guiDisable)
      this._canvas.reloadCanvas()
    }
  }

  private _centerLines (lineSize = 6): void {
    if (this._canvas.settings.showGrid) {
      this._canvas.paintCanvas(
        { x: 0, y: (this._canvas.canvas.height / 2) - (lineSize / 2) },
        false,
        this._canvas.settings.gridColor,
        this._canvas.canvas.width,
        lineSize
      )
      this._canvas.paintCanvas(
        { x: (this._canvas.canvas.width / 2) - (lineSize / 2), y: 0 },
        false,
        this._canvas.settings.gridColor,
        lineSize,
        this._canvas.canvas.height
      )
    }
  }

  public mouseCheck () {
    if (!this.enabled) {
      return
    }

    if (this._canvas.mouse.button === MouseButton.LEFT) {
      this.guiElements.forEach(element => {
        if (element.enabled && CheckRange(this._canvas.mouse.realPosition, element.position, {
          x: element.position.x + element.size.x,
          y: element.position.y + element.size.y
        })) {
          this._canvas.toolSelector.tool.event.stopImmediatePropagation()
          if (!this._canvas.mouse.moving) {
            console.log('click on gui')
          }
        }
      })
    }
  }
}
