<script lang="ts" setup>
import Settings from './components/entities/settings.vue'
import Workspace from './components/entities/workspace.vue'
</script>

<template>
  <div class="h-full flex">
    <workspace />

    <settings />
  </div>
</template>

<style lang="postcss">
@import "./assets/css/index.pcss";
</style>
