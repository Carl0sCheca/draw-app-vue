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
  CIRCLE = 5,
  GRID = 6,
  CLEAR = 7
}

export class ToolSelector {
  public readonly tools: Tool[]
  private selected: number
  private previousSelected: number

  public readonly startTool: ToolType = ToolType.PENCIL

  public colorSelected: string

  public constructor (drawApp: DrawApp) {
    this.selected = -1
    this.previousSelected = -1

    this.colorSelected = '000000'

    this.tools = []
    this.tools.push(new PencilTool(drawApp, ToolType.PENCIL))
    this.tools.push(new BucketTool(drawApp, ToolType.BUCKET))
    this.tools.push(new ColourPickerTool(drawApp, ToolType.COLOUR_PICKER))
    this.tools.push(new MoveTool(drawApp, ToolType.MOVE))
    this.tools.push(new ZoomTool(drawApp, ToolType.ZOOM, {
      level: 1.1,
      minLevel: 1,
      maxLevel: 8,
      stepsMouseWheel: 0.1
    }))
    this.tools.push(new CircleTool(drawApp, ToolType.CIRCLE))
  }

  public get tool (): Tool {
    return this.selected >= 0 ? this.tools[this.selected] : undefined
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
