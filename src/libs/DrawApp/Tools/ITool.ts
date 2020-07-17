import { Mouse } from '@/libs/DrawApp/Mouse'
import { Canvas } from '@/libs/DrawApp/Canvas'

export abstract class ITool {
  public name: string
  public event: Event
  protected canvas: Canvas

  protected constructor (canvas: Canvas) {
    this.canvas = canvas
  }

  abstract onClick(mouse: Mouse): void
}
