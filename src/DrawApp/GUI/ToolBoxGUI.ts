import { GUIElement } from './GUIElement'
import { PencilButton } from './ToolBox/PencilButton'
import { FetchSVG } from '../Utils/Util'
import { CircleButton } from './ToolBox/CircleButton'
import { DrawApp } from '../DrawApp'

export class ToolBoxGUI extends GUIElement {
  public constructor (drawApp: DrawApp, name: string) {
    super(drawApp, name)

    window.addEventListener('resize', () => {
      this.drawApp.setSizeCanvas()
      this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height }
      drawApp.resizeWindow()
      drawApp.gui.reloadGUI()
    })
  }

  public init (guiElements: Array<GUIElement>): void {
    this.drawApp.setSizeCanvas()
    this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height }
    this.position = {
      x: 0,
      y: 0
    }
    this.loadImages().then(() => {
      guiElements.push(this)
      setTimeout(() => {
        this.loaded = true
      }, 100)
    })
  }

  public async loadImages (): Promise<void> {
    await FetchSVG('pencil').then(img => GUIElement.AddElement(this.child, this.drawApp, new PencilButton(this.drawApp, 'Pencil'), img, {
      x: this._position.x,
      y: this._position.y
    }))
    await FetchSVG('circle').then(img => {
      const circleButton: CircleButton = new CircleButton(this.drawApp, 'Circle')

      GUIElement.AddElement(this.child, this.drawApp, circleButton, img, {
        x: this._position.x + 68,
        y: this._position.y
      })
      FetchSVG('circle_filled').then(img2 => {
        circleButton.imgFilled = img2
      })
    })

    this.child.find(element => element.name === 'Pencil').active = true
  }

  public toggle (): void {
    if (!this.loaded) {
      return
    }

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
