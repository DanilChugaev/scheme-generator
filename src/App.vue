<script lang="ts" setup>
import { ref, inject } from 'vue'

import UiSwitch from './components/ui-switch.vue'

const toggleDarkMode = inject('toggleDarkMode')

const text = ref('')
const isDark = ref(toggleDarkMode())
const log = () => console.log(text.value)
</script>

<template>
  <div class="flex gap-4">
    <div class="w-full">
sd
    </div>

    <div class="w-[300px]">
      <ui-switch v-model="isDark" @change="toggleDarkMode"/>
    </div>
  </div>
</template>

<style lang="postcss">
@import "./assets/css/index.pcss";
</style>
