import { computed, inject, watch, ref, watchEffect } from 'vue'
import { useStorage, useDateFormat, useNow, useDebounceFn } from '@vueuse/core'
import { useWorkspace } from './useWorkspace'
import {
  INITIAL_CELL_FILL,
  INITIAL_STROKE_COLOR,
  INITIAL_SCHEME_WIDTH,
  INITIAL_SCHEME_HEIGHT,
  TEXT_COLOR_FOR_DARK_THEME,
  TEXT_COLOR_FOR_LIGHT_THEME,
  INITIAL_CELL_WIDTH,
  INITIAL_GROUP_POSITION,
  INITIAL_STAGE_SCALE,
  STROKE_WIDTH,
  CORNER_RADIUS,
} from '../constants'

export function useSettings() {
  const toggleDarkMode = inject('toggleDarkMode')
  const { stage } = useWorkspace()

  const groupConfig = useStorage('group-config', {
    x: INITIAL_GROUP_POSITION,
    y: INITIAL_GROUP_POSITION,
    draggable: true,
  })
  const hasCellOffset = useStorage('has-cell-offset', false)
  // TODO: после восстановления схемы из урла делать кнопку активной
  const isSaveToFavoriteButtonVisible = useStorage('is-save-to-favorite-button-visible', false)
  const schemeWidth = useStorage('scheme-width', INITIAL_SCHEME_WIDTH)
  const schemeHeight = useStorage('scheme-height', INITIAL_SCHEME_HEIGHT)
  const cellColor = useStorage('cell-color', '6466f1')
  const colorHistory = useStorage('color-history', [cellColor.value])
  const cellWidth = useStorage('color-width', INITIAL_CELL_WIDTH)
  const scheme = useStorage('scheme', new Map())
  const cellFill = useStorage('cell-fill', INITIAL_CELL_FILL)
  const strokeColor = useStorage('stroke-color', INITIAL_STROKE_COLOR)
  const favorites = useStorage<string[]>('favorites', [])

  const isDark = ref(toggleDarkMode())
  const cellHeight = ref(INITIAL_CELL_WIDTH)
  const strokeWidth = ref(STROKE_WIDTH)
  const cornerRadius = ref(CORNER_RADIUS)
  const selectedScheme = ref('')

  const cellOffset = computed(() => hasCellOffset.value ? cellWidth.value / 2 : 0)
  const textColor = computed(() => isDark.value ? TEXT_COLOR_FOR_DARK_THEME : TEXT_COLOR_FOR_LIGHT_THEME)

  watch(cellColor, useDebounceFn(_updateColorHistory, 300))

  watchEffect(() => {
    const result = new Map()

    for (let h = 0; h <= schemeHeight.value; h++) {
      const resultOffset = h % 2 === 0 ? cellOffset.value : 0

      for (let w = 0; w <= schemeWidth.value; w++) {
        const id = `h_${h}-w_${w}`

        if (w === 0 || h === 0) {
          if (scheme.value.get(id)) {
            result.set(id, {
              ...scheme.value.get(id),
              x: cellWidth.value * w,
              y: h + cellHeight.value * h + 5,
              width: cellWidth.value,
              fill: textColor.value,
            })
          } else {
            result.set(id, {
              type: 'text',
              id,
              x: cellWidth.value * w,
              y: h + cellHeight.value * h + 5,
              text: w + h,
              fontSize: 16,
              fontFamily: 'sans-serif',
              fill: textColor.value,
              width: cellWidth.value,
              padding: 10,
              align: 'center',
            })
          }
        } else {
          if (scheme.value.get(id)) {
            result.set(id, {
              ...scheme.value.get(id),
              x: cellWidth.value * w + resultOffset,
              y: h + cellHeight.value * h,
              width: cellWidth.value,
              fill: scheme.value.get(id).isFilled ? scheme.value.get(id).fill : cellFill.value,
              stroke: strokeColor.value,
            })
          } else {
            result.set(id, {
              type: 'rect',
              id,
              x: cellWidth.value * w + resultOffset,
              y: h + cellHeight.value * h,
              width: cellWidth.value,
              height: cellHeight.value,
              fill: cellFill.value,
              stroke: strokeColor.value,
              strokeWidth: strokeWidth.value,
              cornerRadius: cornerRadius.value,
              isFilled: false,
            })
          }
        }
      }
    }

    scheme.value = result
  })

  function _updateColorHistory(color: string) {
    colorHistory.value = [...new Set([...colorHistory.value, color])]
  }

  function removeColorFromHistory(color: string) {
    if (colorHistory.value.length > 2) {
      colorHistory.value = colorHistory.value.filter(item => item !== color)
    } else {
      clearColorHistory()
    }
  }

  function clearColorHistory() {
    colorHistory.value = []
    colorHistory.value.push(cellColor.value)
    clearSelectedSchemeName()
  }

  function clearSelectedSchemeName() {
    selectedScheme.value = ''
  }

  async function paintCell(id: string) {
    const cell = scheme.value.get(id)

    if (!cell) {
      return
    }

    const newColor = `#${cellColor.value}`

    cell.fill = cell.fill === newColor ? cellFill.value : newColor
    cell.isFilled = true
    isSaveToFavoriteButtonVisible.value = true
    clearSelectedSchemeName()
  }

  function downloadURI(uri, name) {
    const link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function exportImage() {
    const dataURL = stage.value.toDataURL({ pixelRatio: 3 })
    const formattedTime = useDateFormat(useNow(), 'DD-MM-YYYY HH-mm-ss')

    downloadURI(dataURL, `${formattedTime.value}.png`)
  }

  function saveSchemePosition({ x, y }) {
    groupConfig.value.x = x
    groupConfig.value.y = y
  }

  function clearScheme() {
    scheme.value.clear()
    schemeWidth.value = INITIAL_SCHEME_WIDTH
    schemeHeight.value = INITIAL_SCHEME_HEIGHT
    cellFill.value = INITIAL_CELL_FILL
    strokeColor.value = INITIAL_STROKE_COLOR
    isSaveToFavoriteButtonVisible.value = false
    clearSelectedSchemeName()
  }

  function clearSchemePosition() {
    const position = INITIAL_GROUP_POSITION

    stage.value.scale({
      x: INITIAL_STAGE_SCALE,
      y: INITIAL_STAGE_SCALE,
    })
    stage.value.position({
      x: position,
      y: position,
    })
    groupConfig.value.x = position
    groupConfig.value.y = position
  }

  function setAsBackground(color: string) {
    cellFill.value = `#${color}`
    // инвертируем границы ячеек
    strokeColor.value = `#${(parseInt(color, 16) ^ 0xFFFFFF | 0x1000000).toString(16).substring(1)}`
  }

  function saveSchemeToFavoriteStorage(name: string) {
    favorites.value = [...new Set([...favorites.value, name])]
    useStorage(name, {
      scheme: [...scheme.value],
      hasCellOffset: hasCellOffset.value,
      cellWidth: cellWidth.value,
      schemeWidth: schemeWidth.value,
      schemeHeight: schemeHeight.value,
      cellColor: cellColor.value,
      colorHistory: colorHistory.value,
    })
  }

  function restoreSchemeFromStorage(name) {
    const schemeData = useStorage(name, {})

    scheme.value = new Map(schemeData.value.scheme)
    hasCellOffset.value = schemeData.value.hasCellOffset
    cellWidth.value = schemeData.value.cellWidth
    schemeWidth.value = schemeData.value.schemeWidth
    schemeHeight.value = schemeData.value.schemeHeight
    cellColor.value = schemeData.value.cellColor
    colorHistory.value = schemeData.value.colorHistory
  }

  return {
    scheme,
    isDark,
    hasCellOffset,
    groupConfig,
    schemeWidth,
    schemeHeight,
    cellWidth,
    cellHeight,
    cellColor,
    colorHistory,
    toggleDarkMode,
    isSaveToFavoriteButtonVisible,
    favorites,
    selectedScheme,
    saveSchemeToFavoriteStorage,
    restoreSchemeFromStorage,
    paintCell,
    clearColorHistory,
    exportImage,
    removeColorFromHistory,
    saveSchemePosition,
    clearScheme,
    clearSchemePosition,
    setAsBackground,
  }
}
