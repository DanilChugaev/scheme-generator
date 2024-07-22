import { computed, inject, reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const groupConfig = reactive({
  x: 20,
  y: 20,
  draggable: true,
})

export function useSettings() {
  const toggleDarkMode = inject('toggleDarkMode')

  const hasCellOffset = useStorage('has-cell-offset', false)
  const isSquare = useStorage('is-square', true)
  const schemeWidth = useStorage('scheme-width', 20)
  const schemeHeight = useStorage('scheme-height', 40)

  const isDark = ref(toggleDarkMode())
  const squareSize = ref(50)
  const rectSize = ref(75)
  const initialCellFill = ref('lightblue')
  const strokeColor = ref('black')
  const strokeWidth = ref(1)
  const cornerRadius = ref(5)

  // учесть вертикальная ли схема или горизонатальная

  const cellWidth = computed(() => squareSize.value)
  const cellHeight = computed(() => isSquare.value ? squareSize.value : rectSize.value)

  const list = computed(() => {
    const result = []

    for (let h = 0; h < schemeHeight.value; h++) {
      for (let w = 0; w < schemeWidth.value; w++) {
        result.push({
          id: `h_${h}-w_${w}`,
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

    return result
  })

  return {
    list,
    isDark,
    isSquare,
    hasCellOffset,
    groupConfig,
    schemeWidth,
    schemeHeight,
    toggleDarkMode,
  }
}
