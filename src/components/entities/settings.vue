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
import ConfirmPopup from 'primevue/confirmpopup'

import { useConfirm } from 'primevue/useconfirm'
import { useSettings } from '../../composables/useSettings'

const confirm = useConfirm()

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
  clearScheme,
  clearSchemePosition,
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

const checkClearScheme = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите очистить всю схему',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    accept: () => clearScheme(),
  })
}
</script>

<template>
  <confirm-popup />

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
        raised
        label="Скачать схему картинкой"
        @click="exportImage"
    />

    <div class="flex flex-col gap-4 mt-auto">
      <prime-button
          severity="secondary"
          label="Сбросить местоположение схемы"
          @click="clearSchemePosition"
      />
      <prime-button
          severity="danger" outlined
          label="Сбросить схему"
          @click="checkClearScheme"
      />
    </div>
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
