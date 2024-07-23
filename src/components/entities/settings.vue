<script setup lang="ts">
import { ref } from 'vue'

import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import InputText from 'primevue/inputtext'
import ColorPicker from 'primevue/colorpicker'
import PrimeButton from 'primevue/button'
import InputIcon from 'primevue/inputicon'
import ContextMenu from 'primevue/contextmenu'
import Slider from 'primevue/slider'

import { useSettings } from '../../composables/useSettings'

const {
  isDark,
  hasCellOffset,
  schemeWidth,
  schemeHeight,
  cellColor,
  cellWidth,
  colorHistory,
  toggleDarkMode,
  removeColorFromHistory,
  clearColorHistory,
  exportImage,
} = useSettings()

const menu = ref(null)
const selectedColor = ref('')
const items = ref([
  {
    label: 'Удалить этот цвет',
    command: () => removeColorFromHistory(selectedColor.value),
  },
])

function onColorRightClick(event, color) {
  selectedColor.value = color

  menu.value?.show(event)
}
</script>

<template>
  <div class="h-full w-full max-w-[400px] border-l border-sky-500 flex flex-col gap-4 p-6">
    <h2>Настройки</h2>

    <div class="item">
      <h3>Темная тема</h3>

      <toggle-switch v-model="isDark" @change="toggleDarkMode" />
    </div>

    <div class="item">
      <h3>Со смещением</h3>

      <checkbox v-model="hasCellOffset" :binary="true" />
    </div>

    <div class="item">
      <h3>Внешний вид ({{ cellWidth }})</h3>

      <slider class="w-[10rem]" v-model="cellWidth" :step="5" :min="50" :max="100" />
    </div>

    <div class="item">
      <h3>Ширина схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeWidth" />
    </div>

    <div class="item">
      <h3>Высота схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeHeight" />
    </div>

    <div class="item">
      <h3>Выбрать цвет</h3>

      <color-picker
          v-model="cellColor"
          inputId="cp-hex"
          format="hex"
      />
    </div>

    <div class="item item--vertical">
      <h3>История цветов</h3>

      <div class="flex flex-wrap gap-4">
        <span
            v-for="color in colorHistory"
            :key="color"
            class="p-colorpicker-preview"
            :data-color="color"
            :style="[
                `background-color: #${color}`
            ]"
            @contextmenu="onColorRightClick($event, color)"
            aria-haspopup="true"
            @click="cellColor = color"
        ></span>
        <input-icon
            v-if="colorHistory.length > 1"
            class="icon pi pi-times"
            title="Очистить историю"
            @click="clearColorHistory"
        />
        <context-menu v-if="colorHistory.length > 1" ref="menu" :model="items" />
      </div>
    </div>

    <prime-button
        label="Скачать схему картинкой"
        class="mt-auto"
        @click="exportImage"
    />
  </div>
</template>

<style scoped lang="postcss">
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  &--vertical {
    flex-direction: column;
    align-items: start;
  }
}

.icon {
  display: flex;

  &::before {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    cursor: pointer;
  }
}
</style>
