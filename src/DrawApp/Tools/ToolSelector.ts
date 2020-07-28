import { Tool } from './Tool'
import { PencilTool } from './PencilTool'
import { DrawApp } from '../DrawApp'
import { BucketTool } from './BucketTool'
import { ColourPickerTool } from './ColourPickerTool'
import { MoveTool } from './MoveTool'
import { ZoomTool } from './ZoomTool'
import { CircleTool } from './CircleTool'

export enum ToolType {
  NONE = -1,
  PENCIL = 0,
  BUCKET = 1,
  COLOUR_PICKER = 2,
  MOVE = 3,
  ZOOM = 4,
  CIRCLE = 5
}

export class ToolSelector {
  public readonly tools: Tool[]
  private selected: number
  private previousSelected: number

  public colorSelected: string

  public constructor (canvas: DrawApp) {
    this.selected = 0
    this.previousSelected = -1

    this.colorSelected = 'red'

    this.tools = []
    this.tools.push(new PencilTool(canvas, ToolType.PENCIL))
    this.tools.push(new BucketTool(canvas, ToolType.BUCKET))
    this.tools.push(new ColourPickerTool(canvas, ToolType.COLOUR_PICKER))
    this.tools.push(new MoveTool(canvas, ToolType.MOVE))
    this.tools.push(new ZoomTool(canvas, ToolType.ZOOM, {
      level: 1,
      minLevel: 1,
      maxLevel: 8,
      steps: 0.1
    }))
    this.tools.push(new CircleTool(canvas, ToolType.CIRCLE))
  }

  public get tool (): Tool {
    return this.tools[this.selected]
  }

  public set selectTool (toolType: ToolType) {
    if (this.selected !== toolType.valueOf()) {
      this.previousSelected = this.selected
      this.selected = toolType.valueOf()
    }
  }

  public restoreTool (): void {
    if (this.previousSelected !== -1) {
      this.selected = this.previousSelected
      this.previousSelected = -1
    }
  }
}
