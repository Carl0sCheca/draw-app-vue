<template lang="pug">
  div.column Cosa de dibujar
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DrawCanvas extends Vue {
}
</script>

<style scoped lang="sass">
  @import ../styles/variables
  div
    background-color: $primary-colour2
</style>
