<template lang="pug">
div.canvasDrawingWrapper(:style="maxSizeCanvasCSS")
  div.canvasDrawingContainer
    canvas.canvasDrawing(:id="this.canvasId") Canvas
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DrawApp } from '@/libs/DrawApp'

@Component
export default class DrawCanvas extends Vue {
  @Prop({ required: true }) canvasId!: string
  @Prop({ required: false, default: 600 }) maxSize!: number
  @Prop({ required: false, default: 16 }) gridSize!: number

  drawApp: DrawApp

  get maxSizeCanvasCSS (): { 'max-height': string; 'max-width': string } {
    return {
      'max-width': `${this.maxSize}px`,
      'max-height': `${this.maxSize}px`
    }
  }

  mounted (): void {
    this.drawApp = new DrawApp((document.getElementById(this.canvasId) as HTMLCanvasElement), { gridSize: this.gridSize, gridColor: 'black' })
  }
}
</script>

<style scoped lang="sass">
@import ../styles/variables
.canvasDrawing
  position:  absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  text-align: center
  font-size: 20px
  color: white
  width: 100%
  height: 100%
  image-rendering: optimizeSpeed             /* Older versions of FF          */
  image-rendering: -moz-crisp-edges          /* FF 6.0+                       */
  image-rendering: -o-crisp-edges            /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated                 /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor   /* IE                            */
.canvasDrawingContainer
  display: table
  margin: 0 auto
  position: relative
  width: 100%
  padding-top: 100% /* 1:1 Aspect Ratio */
.canvasDrawingWrapper
  margin-top: 10px
  max-width: 480px
  max-height: 480px
</style>
