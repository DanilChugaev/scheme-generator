import { computed, inject, reactive, watch, ref, watchEffect } from 'vue'
import { useStorage, useDateFormat, useNow, useDebounceFn } from '@vueuse/core'
import { useWorkspace } from './useWorkspace'

const groupConfig = reactive({
  x: 20,
  y: 20,
  draggable: true,
})

export function useSettings() {
  const toggleDarkMode = inject('toggleDarkMode')
  const { stage } = useWorkspace()

  const hasCellOffset = useStorage('has-cell-offset', false)
  const schemeWidth = useStorage('scheme-width', 30)
  const schemeHeight = useStorage('scheme-height', 10)
  const cellColor = useStorage('cell-color', '6466f1')
  const colorHistory = useStorage('color-history', [cellColor.value])

  const list = ref([])

  const isDark = ref(toggleDarkMode())
  const cellSize = ref(50)
  const initialCellFill = ref('#add8e6')
  const strokeColor = ref('black')
  const strokeWidth = ref(1)
  const cornerRadius = ref(5)

  const cellWidth = computed(() => cellSize.value)
  const cellHeight = computed(() => cellSize.value)
  const cellOffset = computed(() => hasCellOffset.value ? cellSize.value / 2 : 0)
  const textColor = computed(() => isDark.value ? '#adbac7' : '#1F2328')

  watch(cellColor, useDebounceFn(_updateColorHistory, 300))

  watchEffect(() => {
    const result = []

    for (let h = 0; h <= schemeHeight.value; h++) {
      const resultOffset = h % 2 === 0 ? cellOffset.value : 0

      for (let w = 0; w <= schemeWidth.value; w++) {
        const id = `h_${h}-w_${w}`

        if (w === 0 || h === 0) {
          result.push({
            type: 'text',
            id,
            x: cellWidth.value * w - 10,
            y: h + cellHeight.value * h,
            text: w + h,
            fontSize: 18,
            fontFamily: 'sans-serif',
            fill: textColor.value,
            width: 70,
            padding: 15,
            align: 'center',
          })
        } else {
          result.push({
            type: 'rect',
            id,
            x: cellWidth.value * w + resultOffset,
            y: h + cellHeight.value * h,
            width: cellWidth.value,
            height: cellHeight.value,
            fill: initialCellFill.value,
            stroke: strokeColor.value,
            strokeWidth: strokeWidth.value,
            cornerRadius: cornerRadius.value,
          })
        }
      }
    }

    list.value = result
  })

  function _updateColorHistory(color: string) {
    colorHistory.value = [...new Set([...colorHistory.value, color])]
  }

  const paintCell = async (id: string) => {
    const cell = list.value.find(item => item.id === id)

    if (!cell) {
      return
    }

    const newColor = `#${cellColor.value}`

    cell.fill = cell.fill === newColor ? initialCellFill.value : newColor
  }

  function downloadURI(uri, name) {
    const link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // delete link
  }

  const exportImage = () => {
    const dataURL = stage.value.toDataURL({ pixelRatio: 3 })
    const formattedTime = useDateFormat(useNow(), 'DD-MM-YYYY HH-mm-ss')

    downloadURI(dataURL, `${formattedTime.value}.png`)
  }

  return {
    list,
    isDark,
    hasCellOffset,
    groupConfig,
    schemeWidth,
    schemeHeight,
    cellColor,
    colorHistory,
    toggleDarkMode,
    paintCell,
    exportImage,
  }
}
