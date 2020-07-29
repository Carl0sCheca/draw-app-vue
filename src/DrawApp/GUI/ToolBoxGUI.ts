import { GUIElement } from './GUIElement'
import { PencilButton } from './ToolBox/PencilButton'
import { FetchSVG } from '../Utils/Util'
import { CircleButton } from './ToolBox/CircleButton'

export class ToolBoxGUI extends GUIElement {
  public init (guiElements: Array<GUIElement>): void {
    this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height }
    this.position = {
      x: 0,
      y: 0
    }
    this.loadImages().then(() => guiElements.push(this))
  }

  public async loadImages (): Promise<void> {
    await FetchSVG('pencil').then(img => GUIElement.AddElement(this.child, this.drawApp, new PencilButton(this.drawApp, 'Pencil'), img, {
      x: this._position.x,
      y: this._position.y
    }))
    await FetchSVG('circle').then(img => GUIElement.AddElement(this.child, this.drawApp, new CircleButton(this.drawApp, 'Circle'), img, {
      x: this._position.x + 68,
      y: this._position.y
    }))

    this.child.find(element => element.name === 'Pencil').active = true
  }

  public toggle (): void {
    if (this.enabled) {
      this.hide()
    } else {
      this.show()
    }
  }

  public show (): void {
    this.enabled = true

    this.child.forEach(element => element.show())

    this.ui()
  }

  public hide (): void {
    this.enabled = false
    this.drawApp.gui.reloadGUI()
    this.drawApp.reloadCanvas()
  }

  public ui (): void {
    this.drawApp.ctx.fillStyle = 'gray'
    this.drawApp.ctx.globalAlpha = 0.6
    this.drawApp.ctx.fillRect(this._position.x, this._position.y, this.size.x, this.size.y)
    this.drawApp.ctx.globalAlpha = 1

    this.child.forEach(button => button.ui())
  }

  public action () {
    // console.log(`mouse button left up inside ${this.name}`)
  }
}
