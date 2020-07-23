import { Tool } from '@/libs/DrawApp/Tools/Tool'
import { Canvas } from '@/libs/DrawApp/Canvas'
import { ToolType } from '@/libs/DrawApp/Tools/ToolSelector'

export class BucketTool extends Tool {
  public onAction (): void {
    console.log('bucket tool')
  }
}
