<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDateFormat, useNow, useMagicKeys } from '@vueuse/core'

import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import InputText from 'primevue/inputtext'
import PrimeButton from 'primevue/button'
import InputIcon from 'primevue/inputicon'
import ContextMenu from 'primevue/contextmenu'
import Slider from 'primevue/slider'
import PrimeSelect from 'primevue/select'
import FileUpload from 'primevue/fileupload'

import { useConfirm } from 'primevue/useconfirm'
import { useSettings } from '../../composables/useSettings'
import { useNotifications } from '../../composables/useNotifications'
import EnterNameModal from '../modals/enter-name.vue'
import { useWorkspace } from '../../composables/useWorkspace'

const confirm = useConfirm()

const {
  clearWorkspacePosition,
} = useWorkspace()
const {
  isDark,
  hasCellOffset,
  schemeWidth,
  schemeHeight,
  cellColor,
  cellWidth,
  colorHistory,
  toggleDarkMode,
  favorites,
  selectedScheme,
  saveSchemeToFavoriteStorage,
  restoreSchemeFromFavoriteStorage,
  removeColorFromHistory,
  clearColorHistory,
  clearScheme,
  exportImage,
  setColorAsBackground,
  shareScheme,
  parseScheme,
  updateSelectedSchemeName,
  updateScheme,
  setCellColor,
  getCorrectColor,
  clearComments,
} = useSettings()
const { successNotify, warnNotify } = useNotifications()

const { current } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'ы') && e.type === 'keydown')
      e.preventDefault()
  },
})

const menu = ref(null)
const selectedColor = ref('')
const schemeName = ref('')
const isVisibleModalForSaveToFavorite = ref(false)
const isVisibleModalForShare = ref(false)
const isVisibleModalForExport = ref(false)
const fileupload = ref()

const filteredContextMenuItems = computed(() => [
  {
    label: 'Удалить этот цвет',
    command: () => removeColorFromHistory(selectedColor.value),
    isVisible: colorHistory.value.length > 1,
  },
  {
    label: 'Использовать как фон',
    command: () => setColorAsBackground(selectedColor.value),
    isVisible: true,
  },
].filter(item => item.isVisible))

function onColorRightClick(event, color) {
  selectedColor.value = color

  menu.value?.show(event)
}

function checkClearScheme(event) {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите очистить всю схему?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    accept: () => clearScheme(),
  })
}

function checkClearComments(event) {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите удалить все комментарии?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    accept: () => clearComments(),
  })
}

function checkSaveSchemeIfExist(event) {
  confirm.require({
    target: event.currentTarget,
    message: 'Схема с таким названием существует, хотите перезаписать?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    accept: () => handlerAfterAcceptSaveSchemeToFavorite('Схема перезаписана'),
  })
}

async function checkParseBeforeUploadScheme(event) {
  return new Promise(resolve => {
    confirm.require({
      target: event.originalEvent.currentTarget,
      message: 'Прежде чем загрузить новую схему, хотите ли сохранить текущую?',
      icon: 'pi pi-info-circle',
      rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
      acceptClass: 'p-button-danger p-button-sm',
      rejectLabel: 'Нет',
      acceptLabel: 'Да',
      accept: () => {
        const formattedTime = useDateFormat(useNow(), 'DD-MM-YYYY HH-mm-ss')
        schemeName.value = formattedTime.value
        handlerAfterAcceptSaveSchemeToFavorite()
        resolve()
      },
      reject: () => resolve(),
    })
  })
}

function saveSchemeToFavorite(event) {
  if (!schemeName.value) return

  if (favorites.value.includes(schemeName.value)) {
    checkSaveSchemeIfExist(event)
  } else {
    handlerAfterAcceptSaveSchemeToFavorite()
  }
}

function handlerAfterAcceptSaveSchemeToFavorite(message?: string) {
  saveSchemeToFavoriteStorage(schemeName.value)
  successNotify(message || 'Схема добавлена в избранное', `Имя схемы: ${schemeName.value}`)

  isVisibleModalForSaveToFavorite.value = false
  updateSelectedSchemeName(schemeName.value)
  schemeName.value = ''
}

async function share() {
  try {
    await shareScheme(schemeName.value)

    isVisibleModalForShare.value = false
    schemeName.value = ''
  } catch (error) {
    warnNotify(error)
  }
}

async function parse(event) {
  try {
    await checkParseBeforeUploadScheme(event)
    await parseScheme(fileupload.value)

    fileupload.value.files = []

    successNotify('Схема успешно загружена')
  } catch (error) {
    warnNotify(error)
  }
}

async function exportImageToComputer() {
  try {
    exportImage(schemeName.value)

    isVisibleModalForExport.value = false
    schemeName.value = ''
  } catch (error) {
    warnNotify(error)
  }
}

function toggleTheme(event) {
  toggleDarkMode(event)
  updateScheme()
}

function openModalForEnterName(isVisible) {
  isVisible.value = true

  if (selectedScheme.value) {
    schemeName.value = selectedScheme.value
  }
}

function openExportModal() {
  openModalForEnterName(isVisibleModalForExport)
}

function openSaveToFavoriteModal() {
  openModalForEnterName(isVisibleModalForSaveToFavorite)
}

function openShareModal() {
  openModalForEnterName(isVisibleModalForShare)
}


watch(current, combination => {
  if (combination.size < 2) return

  if ((combination.has('control') || combination.has('meta')) && (combination.has('s') || combination.has('ы'))) {
    openSaveToFavoriteModal()
  }
})

onMounted(() => {
  colorHistory.value = colorHistory.value.map(color => getCorrectColor(color))
  updateScheme()
})
</script>

<template>
  <enter-name-modal
    v-model="schemeName"
    v-model:is-visible="isVisibleModalForSaveToFavorite"
    @save="saveSchemeToFavorite"
  />
  <enter-name-modal
    v-model="schemeName"
    v-model:is-visible="isVisibleModalForShare"
    @save="share"
  />
  <enter-name-modal
    v-model="schemeName"
    v-model:is-visible="isVisibleModalForExport"
    @save="exportImageToComputer"
  />

  <div class="h-full w-full max-w-[400px] border-l border-sky-500 flex flex-col gap-4 p-6">
    <h2><b>Настройки</b></h2>

    <div class="item">
      <h3>Темная тема</h3>

      <toggle-switch v-model="isDark" @change="toggleTheme" />
    </div>

    <div v-if="favorites.length" class="item item--vertical">
      <h3>Избранное</h3>

      <prime-select
          v-model="selectedScheme"
          :options="favorites"
          placeholder="Выберите схему"
          class="w-full md:w-14rem"
          @update:model-value="restoreSchemeFromFavoriteStorage($event)"
      />
    </div>

    <div class="item">
      <h3>Со смещением</h3>

      <checkbox v-model="hasCellOffset" :binary="true" @update:model-value="updateScheme" />
    </div>

    <div class="item">
      <h3>Внешний вид ({{ cellWidth }})</h3>

      <slider class="w-[10rem]" v-model="cellWidth" :step="5" :min="50" :max="100" @update:model-value="updateScheme" />
    </div>

    <div class="item">
      <h3>Ширина схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeWidth" @update:model-value="updateScheme" />
    </div>

    <div class="item">
      <h3>Высота схемы</h3>

      <input-text class="max-w-[100px]" type="number" v-model="schemeHeight" @update:model-value="updateScheme" />
    </div>

    <div class="item">
      <h3>Выбрать цвет</h3>

      <color-picker
          v-model:pureColor="cellColor"
          format="hex"
          shape="circle"
          disable-history
      />
    </div>

    <div class="item item--vertical">
      <h3>История цветов</h3>

      <div class="flex flex-wrap gap-4">
        <span
            v-for="color in colorHistory"
            :key="color"
            :class="[
                'colorpicker-preview',
                {
                  'colorpicker-preview--active': getCorrectColor(color) === getCorrectColor(cellColor)
                }
            ]"
            :data-color="color"
            :style="[
                `background-color: ${getCorrectColor(color)}`
            ]"
            @contextmenu="onColorRightClick($event, getCorrectColor(color))"
            aria-haspopup="true"
            @click="setCellColor(getCorrectColor(color))"
        ></span>
        <input-icon
            v-if="colorHistory.length > 1"
            class="icon pi pi-times"
            title="Очистить историю"
            @click="clearColorHistory"
        />
        <context-menu ref="menu" :model="filteredContextMenuItems" />
      </div>
    </div>

    <prime-button
        raised
        label="Скачать картинкой"
        @click="openExportModal"
    />

    <prime-button
        label="Сохранить в избранное"
        severity="secondary"
        @click="openSaveToFavoriteModal"
    />

    <prime-button
        label="Поделиться схемой"
        severity="secondary"
        @click="openShareModal"
    />

    <file-upload ref="fileupload" mode="basic" @select="parse" accept="application/json" chooseLabel="Загрузить схему"/>

    <div class="flex flex-col gap-4 mt-auto">
      <prime-button
          severity="secondary"
          label="Сбросить местоположение"
          @click="clearWorkspacePosition"
      />
      <prime-button
          severity="secondary"
          label="Удалить комментарии"
          @click="checkClearComments"
      />
      <prime-button
          severity="danger" outlined
          label="Сбросить всю схему"
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

.colorpicker-preview {
  cursor: pointer;
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-border) !important;
  border-radius: 50%;

  &--active {
    outline: 1px solid var(--color-text);
    outline-offset: 1px;
  }
}
</style>

<style>
.vc-color-wrap.round {
  border: 1px solid var(--color-border) !important;
}
</style>
