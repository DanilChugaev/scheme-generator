<script setup lang="ts">
import { ref, inject } from 'vue'

import UiSwitch from './../ui/ui-switch.vue'

const toggleDarkMode = inject('toggleDarkMode')

const isDark = ref(toggleDarkMode())
</script>

<template>
  <div class="h-full w-full max-w-[400px] border-l border-grey-200 flex flex-col gap-4 p-6">
    <h2>Настройки</h2>

    <div class="flex justify-between items-center gap-4">
      <span>Тема</span>

      <ui-switch v-model="isDark" @change="toggleDarkMode"/>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
