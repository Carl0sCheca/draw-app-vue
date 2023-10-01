import { GUIElement } from '../GUIElement'

export class GridButton extends GUIElement {
  public imgFilled!: HTMLImageElement

  public mouseUp (): void {
    this.drawApp.toggleGrid()
  }

  public ui (): void {
    const image: HTMLImageElement = this.drawApp.settings.showGrid ? this.imgFilled : this.img!
    this.drawApp.ctx.drawImage(image, this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
