import { Canvas } from '@/libs/DrawApp/Canvas'
import { Vector } from '@/libs/DrawApp/Utils'

export abstract class GUIElement {
  protected canvas: Canvas

  public enabled: boolean
  public clickIn: boolean
  public name: string
  public position: Vector
  public size: Vector

  public constructor (canvas: Canvas, name: string) {
    this.canvas = canvas
    this.enabled = false
    this.name = name
    this.clickIn = true
  }

  public abstract show (): void
  public abstract hide (): void
  public abstract ui (): void
}
