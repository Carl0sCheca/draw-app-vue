import { DrawApp } from '../DrawApp'
import { Vector } from '../Utils/Math'

export abstract class GUIElement {
  protected drawApp: DrawApp

  public loaded: boolean

  public enabled: boolean
  public clickIn: boolean
  public name: string
  public _position: Vector
  private _size: Vector

  public selectable: boolean
  public active: boolean

  public child: Array<GUIElement>

  public img?: HTMLImageElement

  public constructor (drawApp: DrawApp, name: string) {
    this.drawApp = drawApp
    this.enabled = false
    this.name = name
    this.clickIn = true
    this.child = []

    this.active = false
    this.loaded = false
    this.selectable = true
  }

  public set size (size: Vector) {
    this._size = size
  }

  public get size () {
    return this._size
  }

  public set position (position: Vector) {
    this._position = position
  }

  public get position () {
    return this._position
  }

  public hide (): void {
    this.enabled = false
  }

  public show (): void {
    this.enabled = true
  }

  public abstract ui (): void

  public static AddElement (collection: Array<GUIElement>, drawApp: DrawApp, element: GUIElement, img: HTMLImageElement, position?: Vector, size?: number): void {
    if (position !== undefined) {
      element._position = position
    } else {
      element._position = { x: 0, y: 0 }
    }

    if (size !== undefined) {
      img.width = size
      img.height = size
    } else {
      const defaultSize = 68
      img.width = defaultSize
      img.height = defaultSize
    }

    element.size = { x: img.width, y: img.height }

    element.img = img

    collection.push(element)
  }

  public action (): void {
    // console.log(`click on ${this.name}`)
  }

  public setActive (image: HTMLImageElement = this.img): void {
    this.active = true
    this.drawApp.ctx.filter = 'hue-rotate(90deg)'
    this.drawApp.ctx.drawImage(image, this._position.x, this._position.y, this.size.x, this.size.y)
    this.drawApp.ctx.filter = 'none'
  }
}
