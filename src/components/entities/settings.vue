<script setup lang="ts">
import { ref, inject } from 'vue'
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'

const toggleDarkMode = inject('toggleDarkMode')

const isDark = ref(toggleDarkMode())
const hasOffset = ref(false)
</script>

<template>
  <div class="h-full w-full max-w-[400px] border-l border-sky-500 flex flex-col gap-4 p-6">
    <h2>Настройки</h2>

    <div class="flex justify-between items-center gap-4">
      <h3>Тема</h3>

      <toggle-switch v-model="isDark" @change="toggleDarkMode" />
    </div>

    <div class="flex justify-between items-center gap-4">
      <h3>Со смещением</h3>

      <checkbox v-model="hasOffset" :binary="true" />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
