<script lang="ts" setup>
import Settings from './components/entities/settings.vue'
import Workspace from './components/entities/workspace.vue'
import PrimeToast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
</script>

<template>
  <div class="h-full flex">
    <workspace />

    <settings />
  </div>

  <prime-toast position="bottom-center" />
  <confirm-popup />
</template>

<style lang="postcss">
@import "./assets/css/index.pcss";
</style>
