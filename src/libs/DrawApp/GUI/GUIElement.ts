import { DrawApp } from '@/libs/DrawApp/DrawApp'
import { Vector } from '@/libs/DrawApp/Utils/Math'

export abstract class GUIElement {
  protected canvas: DrawApp

  public enabled: boolean
  public clickIn: boolean
  public name: string
  public position: Vector
  public size: Vector

  public constructor (canvas: DrawApp, name: string) {
    this.canvas = canvas
    this.enabled = false
    this.name = name
    this.clickIn = true
  }

  public abstract show (): void
  public abstract hide (): void
  public abstract ui (): void
}
