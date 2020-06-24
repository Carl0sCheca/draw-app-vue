<template lang="pug">
  div#main
    div.columns
      div.column algo
      div.column alg2
      div.column algo3
      div.column algo4
      DrawCanvas
</template>

<script lang="ts">
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import DrawCanvas from '@/components/DrawCanvas.vue'

export default {
  name: 'Home',
  components: {
    DrawCanvas
  }
}
</script>

<style lang="sass">
  @import ../styles/variables
  .column
    color: white
    background-color: $primary-colour1
</style>
