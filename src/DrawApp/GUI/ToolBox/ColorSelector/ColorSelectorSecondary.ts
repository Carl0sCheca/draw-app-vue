import { GUIElement } from '../../GUIElement'
import { HSLtoString, HSVtoHSL } from '../../../Utils/Color'
import { CheckRange, Clamp, RandomNumber, Vector } from '../../../Utils/Math'
import { ColorSelectorButton } from './ColorSelectorButton'

export class ColorSelectorSecondary extends GUIElement {
  private _imageData: ImageData

  private hueSelectorPosition: Vector
  private hueSelectorSize: Vector

  private readonly numColours: number = 20

  private colorPickedSize: number

  private _sizeHueSelector (n = 1): number {
    return this.hueSelectorSize.x / this.numColours * n
  }

  private _hue (n: number): number {
    return Math.trunc(360 / this.numColours * n)
  }

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

    for (let i = 0; i < this.numColours; i++) {
      this.drawApp.ctx.fillStyle = HSLtoString(HSVtoHSL({ H: this._hue(i), S: 100, V: 100 }))
      this.drawApp.ctx.fillRect(this.hueSelectorPosition.x + this._sizeHueSelector(i), this.hueSelectorPosition.y, this._sizeHueSelector(), this.hueSelectorSize.y)
    }

    (this.parent as ColorSelectorButton).hue = this._hue(RandomNumber(0, 19))

    this.drawApp.toolSelector.colorSelected = HSLtoString(HSVtoHSL({
      H: (this.parent as ColorSelectorButton).hue,
      S: 100,
      V: 100
    }))

    this._imageData = this.drawApp.ctx.getImageData(this.hueSelectorPosition.x, this.hueSelectorPosition.y, this.hueSelectorSize.x, this.hueSelectorSize.y)
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
    const position: Vector = this.drawApp.mouse.realPosition
    const hue: number = this._hue(Math.floor(Clamp(position.x - this.hueSelectorPosition.x, 0, this.hueSelectorSize.x) / this._sizeHueSelector()))
    const parent: ColorSelectorButton = this.parent as ColorSelectorButton
    parent.hue = hue
    parent.change = true
  }

  public ui (): void {
    this.drawApp.ctx.fillStyle = this.drawApp.toolSelector.colorSelected
    this.drawApp.ctx.fillRect(this.position.x, this.position.y, this.colorPickedSize, this.hueSelectorSize.y)

    this.drawApp.ctx.putImageData(this._imageData, this.hueSelectorPosition.x, this.hueSelectorPosition.y)
  }
}
