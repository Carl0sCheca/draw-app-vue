import { GUIElement } from './GUIElement'

export class ToolBoxGUI extends GUIElement {
  public show (): void {
    this.enabled = true
    this.ui()
  }

  public hide (): void {
    this.enabled = false
  }

  public ui (): void {
    this.size = { x: 200, y: 200 }
    this.position = { x: this.canvas.canvas.width / 2 - (this.size.x / 2), y: this.canvas.canvas.height / 2 - (this.size.y / 2) }
    this.canvas.ctx.fillStyle = 'red'
    this.canvas.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
