import { computed, inject, reactive, ref, watchEffect } from 'vue'
import { useStorage, useDateFormat, useNow } from '@vueuse/core'
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
  const isSquare = useStorage('is-square', true)
  const schemeWidth = useStorage('scheme-width', 20)
  const schemeHeight = useStorage('scheme-height', 40)
  const cellColor = useStorage('cell-color', '6466f1')

  const list = ref([])

  const isDark = ref(toggleDarkMode())
  const squareSize = ref(50)
  const rectSize = ref(75)
  const initialCellFill = ref('#add8e6')
  const strokeColor = ref('black')
  const strokeWidth = ref(1)
  const cornerRadius = ref(5)

  // учесть вертикальная ли схема или горизонатальная

  const cellWidth = computed(() => squareSize.value)
  const cellHeight = computed(() => isSquare.value ? squareSize.value : rectSize.value)
  const textColor = computed(() => isDark.value ? '#adbac7' : '#1F2328')
  const textOffset = computed(() => isSquare.value ? 0 : 10)

  watchEffect(() => {
    const result = []

    for (let h = 0; h <= schemeHeight.value; h++) {
      for (let w = 0; w <= schemeWidth.value; w++) {
        const id = `h_${h}-w_${w}`

        if (w === 0 || h === 0) {
          result.push({
            type: 'text',
            id,
            x: cellWidth.value * w - 10,
            y: h + cellHeight.value * h + textOffset.value,
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
            x: cellWidth.value * w,
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
    isSquare,
    hasCellOffset,
    groupConfig,
    schemeWidth,
    schemeHeight,
    cellColor,
    toggleDarkMode,
    paintCell,
    exportImage,
  }
}
