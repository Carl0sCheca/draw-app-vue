import { DrawApp } from '@/libs/DrawApp/DrawApp'

export interface EventsGUI {
  guiEnable: Event;
  guiDisable: Event;
}

export class EventGUI {
  private _canvas: DrawApp

  public events: EventsGUI

  public constructor (canvas: DrawApp) {
    this._canvas = canvas

    this.events = {
      guiEnable: new Event('guiEnable'),
      guiDisable: new Event('guiDisable')
    }

    canvas.canvas.addEventListener('guiEnable', () => this.onCanvasEnable())
    canvas.canvas.addEventListener('guiDisable', () => this.onCanvasDisable())
  }

  public onCanvasEnable (): void {
    this._canvas.gui.guiElements.find(element => element.name === 'toolboxGUI').show()
  }

  public onCanvasDisable (): void {
    this._canvas.gui.guiElements.find(element => element.name === 'toolboxGUI').hide()
  }
}
