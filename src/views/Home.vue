<template lang="pug">
  div#main
    div.columns.is-centered
      DrawCanvas(canvas-id="drawCanvas", max-size="824" grid-size="32").column.is-half
</template>

<script lang="ts">
// @ is an alias to /src
import DrawCanvas from '@/components/DrawCanvas.vue'

export default {
  name: 'Home',
  components: {
    DrawCanvas
  },
  created () {
    document.title = 'Inicio'
  }
}
</script>

<style scoped lang="sass"></style>
