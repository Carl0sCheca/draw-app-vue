import { ITool } from '@/libs/DrawApp/ITool'
import { PencilTool } from '@/libs/DrawApp/PencilTool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { BucketTool } from '@/libs/DrawApp/BucketTool'

export enum Tool {
  NONE = -1,
  PENCIL = 0,
  BUCKET = 1
}

export class ToolSelector {
  public readonly tools: ITool[]
  private selected: number

  public constructor (canvas: Canvas) {
    this.selected = 0

    this.tools = []
    this.tools.push(new PencilTool(canvas))
    this.tools.push(new BucketTool(canvas))
  }

  public get tool (): ITool {
    return this.tools[this.selected]
  }
}
