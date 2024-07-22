<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import InputText from 'primevue/inputtext'
import { useSettings } from '../../composables/useSettings'

const {
  isDark,
  isSquare,
  hasCellOffset,
  schemeWidth,
  schemeHeight,
  toggleDarkMode,
} = useSettings()
</script>

<template>
  <div class="h-full w-full max-w-[400px] border-l border-sky-500 flex flex-col gap-4 p-6">
    <h2>Настройки</h2>

    <div class="flex justify-between items-center gap-4">
      <h3>Темная тема</h3>

      <toggle-switch v-model="isDark" @change="toggleDarkMode" />
    </div>

    <div class="flex justify-between items-center gap-4">
      <h3>Со смещением</h3>

      <checkbox v-model="hasCellOffset" :binary="true" />
    </div>

    <div class="flex justify-between items-center gap-4">
      <h3>Квадратные</h3>

      <checkbox v-model="isSquare" :binary="true" />
    </div>

    <div class="flex justify-between items-center gap-4">
      <h3>Ширина схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeWidth" />
    </div>

    <div class="flex justify-between items-center gap-4">
      <h3>Высота схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeHeight" />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
