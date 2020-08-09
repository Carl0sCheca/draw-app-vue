<template lang="pug">
  div.canvasDrawingWrapper(:style="maxSizeCanvasCSS")
    div.canvasDrawingContainer
      canvas.canvasDrawing(:id="this.canvasId") DrawApp
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DrawApp } from './DrawApp/DrawApp'

@Component
export default class DrawCanvas extends Vue {
  @Prop({ required: true }) canvasId!: string
  @Prop({ required: false, default: 600 }) maxSize!: number
  @Prop({ required: false, default: 16 }) gridSize!: number

  public drawApp: DrawApp

  get maxSizeCanvasCSS (): { 'max-height': string; 'max-width': string } {
    return {
      'max-width': `${this.maxSize}px`,
      'max-height': `${this.maxSize}px`
    }
  }

  mounted (): void {
    this.drawApp = new DrawApp((document.getElementById(this.canvasId) as HTMLCanvasElement), {
      gridSize: this.gridSize,
      gridColor: '000000',
      showGrid: true
    })
  }

  public Data (): string[][] {
    return this.drawApp.data.pixels
  }
}
</script>

<style scoped lang="sass">
.canvasDrawing
  position: absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  text-align: center
  font-size: 20px
  color: white
  width: 100%
  height: 100%
  image-rendering: optimizeSpeed
  image-rendering: -moz-crisp-edges
  image-rendering: -o-crisp-edges
  image-rendering: pixelated
  -ms-interpolation-mode: nearest-neighbor

.canvasDrawingContainer
  display: table
  margin: 0 auto
  position: relative
  width: 100%
  padding-top: 100%

.canvasDrawingWrapper
  margin-top: 10px
  max-width: 480px
  max-height: 480px
</style>
