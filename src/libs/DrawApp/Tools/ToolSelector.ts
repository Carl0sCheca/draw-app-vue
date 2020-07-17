import { ITool } from '@/libs/DrawApp/Tools/ITool'
import { PencilTool } from '@/libs/DrawApp/Tools/PencilTool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { BucketTool } from '@/libs/DrawApp/Tools/BucketTool'

export enum Tool {
  NONE = -1,
  PENCIL = 0,
  BUCKET = 1
}

export class ToolSelector {
  public readonly tools: ITool[]
  private selected: number

  public colorSelected: string

  public showGrid: boolean

  public constructor (canvas: Canvas) {
    this.selected = 0
    this.colorSelected = 'red'
    this.showGrid = true

    this.tools = []
    this.tools.push(new PencilTool(canvas))
    this.tools.push(new BucketTool(canvas))
  }

  public get tool (): ITool {
    return this.tools[this.selected]
  }
}
