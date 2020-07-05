import { Component, Prop, Vue } from 'vue-property-decorator'
import { DrawApp } from './DrawApp'

@Component
export default class DrawCanvas extends Vue {
  @Prop({ required: true }) canvasId!: string
  @Prop({ required: false, default: 600 }) maxSize!: number
  @Prop({ required: false, default: 1280 }) canvasResolution!: number

  canvas: DrawApp

  get maxSizeCanvasCSS (): { 'max-height': string; 'max-width': string } {
    return {
      'max-width': `${this.maxSize}px`,
      'max-height': `${this.maxSize}px`
    }
  }

  mounted (): void {
    this.canvas = new DrawApp(document.getElementById(this.canvasId) as HTMLCanvasElement)
    this.canvas.init()
  }
}
