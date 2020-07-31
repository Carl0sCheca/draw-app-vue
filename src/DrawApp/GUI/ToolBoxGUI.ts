import { GUIElement } from './GUIElement'
import { PencilButton } from './ToolBox/PencilButton'
import { FetchSVG } from '../Utils/Util'
import { CircleButton } from './ToolBox/CircleButton'
import { GridButton } from './ToolBox/GridButton'
import { ClearButton } from './ToolBox/ClearButton'
import { BucketButton } from './ToolBox/BucketButton'
import { ColorPickerButton } from './ToolBox/ColorPickerButton'
import { ColorSelectorButton } from './ToolBox/ColorSelector/ColorSelectorButton'
import { GUI } from './GUI'

export class ToolBoxGUI extends GUIElement {
  public windowResize () {
    this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height }
    this.child.forEach(element => {
      if (element.windowResize) {
        element.windowResize()
      }
    })
  }

  public init (guiElements: Array<GUIElement>): void {
    this.drawApp.setSizeCanvas()
    this.size = { x: this.drawApp.canvas.width, y: this.drawApp.canvas.height }
    this.position = {
      x: 0,
      y: 0
    }
    this.loadImagesAndButtons().then(() => {
      guiElements.push(this)
      setTimeout(() => {
        this.loaded = true
      }, 100)
    })
  }

  public async loadImagesAndButtons (): Promise<void> {
    await FetchSVG('pencil').then(img => GUIElement.AddElement(this.child, this.drawApp, new PencilButton(this.drawApp, 'Pencil'), img, {
      x: this.position.x,
      y: this.position.y
    }))
    await FetchSVG('circle').then(img => {
      const circleButton: CircleButton = new CircleButton(this.drawApp, 'Circle')

      GUIElement.AddElement(this.child, this.drawApp, circleButton, img, {
        x: this.position.x,
        y: this.position.y + 68 * this.child.length
      })
      FetchSVG('circle_filled').then(img2 => {
        circleButton.imgFilled = img2
      })
    })

    await FetchSVG('grid').then(img => {
      const circleButton: CircleButton = new GridButton(this.drawApp, 'Grid')
      circleButton.selectable = false
      GUIElement.AddElement(this.child, this.drawApp, circleButton, img, {
        x: this.position.x,
        y: this.position.y + 68 * this.child.length
      })
      FetchSVG('grid_disabled').then(img2 => {
        circleButton.imgFilled = img2
      })
    })

    await FetchSVG('clear').then(img => {
      const clearButton: ClearButton = new ClearButton(this.drawApp, 'Clear')
      clearButton.selectable = false
      GUIElement.AddElement(this.child, this.drawApp, clearButton, img, {
        x: this.position.x,
        y: this.position.y + 68 * this.child.length
      })
    })

    await FetchSVG('bucket').then(img => GUIElement.AddElement(this.child, this.drawApp, new BucketButton(this.drawApp, 'Bucket'), img, {
      x: this.position.x,
      y: this.position.y + 68 * this.child.length
    }))

    await FetchSVG('colorpicker').then(img => GUIElement.AddElement(this.child, this.drawApp, new ColorPickerButton(this.drawApp, 'ColorPicker'), img, {
      x: this.position.x,
      y: this.position.y + 68 * this.child.length
    }))

    const colorSelector: ColorSelectorButton = new ColorSelectorButton(this.drawApp, 'Color Selector')
    colorSelector.selectable = false
    colorSelector.change = true
    colorSelector.hoverable = false
    colorSelector.size = {
      x: 300,
      y: 250
    }
    colorSelector.position = {
      x: this.drawApp.canvas.width - colorSelector.size.x - 5,
      y: this.drawApp.canvas.height - colorSelector.size.y - 5
    }
    colorSelector.init()
    this.child.push(colorSelector)

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
    this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    this.drawApp.ctx.globalAlpha = 1

    this.child.forEach(button => button.ui())
  }

  public mouseUp () {
    this.child.forEach(child => {
      if (GUI.CheckInsideGUIElement(this.drawApp, child)) {
        if (!child.selectable) {
          if (child.mouseUp) {
            child.mouseUp()
          }
          child.ui()
          this.drawApp.reloadCanvas()
          this.drawApp.gui.reloadGUI()
          return
        }

        this.child.filter(c => c.name !== child.name).forEach(c => {
          c.active = false
          c.ui()
        })

        child.mouseUp()
        child.setActive()
        child.ui()

        this.drawApp.reloadCanvas()
        this.drawApp.gui.reloadGUI()
      }
    })
  }
}
