import { ITool } from '@/libs/DrawApp/Tools/ITool'
import { Mouse } from '@/libs/DrawApp/Mouse'
import { Canvas } from '@/libs/DrawApp/Canvas'

export class BucketTool extends ITool {
  public event: Event
  public name: string

  public constructor (canvas: Canvas) {
    super(canvas)

    this.name = 'Bucket'
    this.event = new Event(this.name)
    canvas.canvas.addEventListener(this.name, () => this.onClick(canvas.mouse))
  }

  public onClick (mouse: Mouse): void {
    console.log('bucket tool')
  }
}
