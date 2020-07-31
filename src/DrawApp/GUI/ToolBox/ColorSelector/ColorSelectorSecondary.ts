import { GUIElement } from '../../GUIElement'
import { HSLtoString, HSVtoHSL } from '../../../Utils/Color'
import { CheckRange, Vector } from '../../../Utils/Math'

export class ColorSelectorSecondary extends GUIElement {
  private _imageData: ImageData

  private hueSelectorPosition: Vector
  private hueSelectorSize: Vector

  private colorPickedSize: number

  public init () {
    this.colorPickedSize = 50

    this.hueSelectorSize = {
      x: this.size.x - this.colorPickedSize,
      y: this.size.y
    }

    this.hueSelectorPosition = {
      x: this.position.x + this.size.x - this.hueSelectorSize.x,
      y: this.position.y
    }

    const numColours = 20
    const size: number = 360 / numColours

    for (let i = 0; i <= numColours; i++) {
      this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({ H: i * numColours, S: 100, V: 100 }))
      this.drawApp.ctx.fillRect((i * size), this.hueSelectorPosition.y, size, this.hueSelectorSize.y)
      // console.log(i, size, i * size)
    }

    // this._imageData = this.drawApp.ctx.getImageData(this.hueSelectorPosition.x, this.hueSelectorPosition.y, this.hueSelectorSize.x, this.hueSelectorSize.y)
    this.drawApp.reloadCanvas()
  }

  public windowResize () {
    this.position = {
      x: this.parent.position.x,
      y: this.parent.position.y
    }
    this.hueSelectorPosition = {
      x: this.position.x + this.size.x - this.hueSelectorSize.x,
      y: this.position.y
    }
  }

  public mouseUp (): void {
    const position: Vector = this.drawApp.mouse.realPosition
    if (!CheckRange(position, this.position, {
      x: this.position.x + this.colorPickedSize,
      y: this.position.y + this.size.y
    })) {
      this.changeHue()
    }
  }

  public changeHue (): void {
    console.log('aa')
  }

  public ui (): void {
    // this.drawApp.ctx.fillStyle = 'yellow'
    // this.drawApp.ctx.fillRect(this.hueSelectorPosition.x, this.hueSelectorPosition.y, this.hueSelectorSize.x, this.hueSelectorSize.y)

    this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected
    this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.colorPickedSize, this.hueSelectorSize.y)

    const numColours = 20
    const size: number = 360 / numColours

    for (let i = 0; i < numColours - 2; i++) {
      this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({ H: i * numColours, S: 100, V: 100 }))
      this.drawApp.ctx.fillRect((this.hueSelectorPosition.x + (i * size)), this.hueSelectorPosition.y, size, this.hueSelectorSize.y)
      // console.log(i, size, i * size)
    }

    // this.drawApp.ctx.putImageData(this._imageData, this.hueSelectorPosition.x, this.hueSelectorPosition.y)
  }
}
