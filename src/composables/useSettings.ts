import { computed, inject, watch, ref } from 'vue'
import { useStorage, useDebounceFn, useDateFormat, useNow } from '@vueuse/core'
import { useWorkspace } from './useWorkspace'
import {
  INITIAL_CELL_FILL,
  INITIAL_STROKE_COLOR,
  INITIAL_SCHEME_WIDTH,
  INITIAL_SCHEME_HEIGHT,
  TEXT_COLOR_FOR_DARK_THEME,
  TEXT_COLOR_FOR_LIGHT_THEME,
  INITIAL_CELL_WIDTH,
  STROKE_WIDTH,
  CORNER_RADIUS,
  INITIAL_CELL_COLOR,
  WORKSPACE_FONT_SIZE,
  WORKSPACE_FONT_FAMILY,
} from '../constants'
import { ISavedParams } from '../types'
import { useFileLoader } from './useFileLoader'

export function useSettings() {
  const toggleDarkMode = inject('toggleDarkMode')
  const { stage } = useWorkspace()
  const { downloadJSON, downloadURI, readFile } = useFileLoader()

  const hasCellOffset = useStorage('has-cell-offset', false)
  const schemeWidth = useStorage('scheme-width', INITIAL_SCHEME_WIDTH)
  const schemeHeight = useStorage('scheme-height', INITIAL_SCHEME_HEIGHT)
  const cellColor = useStorage('cell-color', INITIAL_CELL_COLOR)
  const colorHistory = useStorage('color-history', [cellColor.value])
  const cellWidth = useStorage('color-width', INITIAL_CELL_WIDTH)
  const scheme = useStorage('scheme', new Map())
  const cellFill = useStorage('cell-fill', INITIAL_CELL_FILL)
  const strokeColor = useStorage('stroke-color', INITIAL_STROKE_COLOR)
  const favorites = useStorage<string[]>('favorites', [])
  const comments = useStorage('comments', new Map())
  const isVisibleComments = useStorage('is-visible-comments', true)

  const isDark = ref(toggleDarkMode())
  const cellHeight = ref(INITIAL_CELL_WIDTH)
  const strokeWidth = ref(STROKE_WIDTH)
  const cornerRadius = ref(CORNER_RADIUS)
  const selectedScheme = ref('')

  const cellOffset = computed(() => hasCellOffset.value ? cellWidth.value / 2 : 0)
  const textColor = computed(() => isDark.value ? TEXT_COLOR_FOR_DARK_THEME : TEXT_COLOR_FOR_LIGHT_THEME)

  watch(cellColor, useDebounceFn(_updateColorHistory, 300))

  function updateScheme() {
    const result = new Map()
    // с обеих сторон схемы добавляем доп пространство для цифр
    const sizeY = schemeHeight.value + 2
    const sizeX = schemeHeight.value + 2

    for (let h = 0; h < sizeY; h++) {
      const resultOffset = h % 2 === 0 ? cellOffset.value : 0

      for (let w = 0; w < sizeX; w++) {
        const id = `h_${h}-w_${w}`
        const isEdgeX = w === 0 || w === sizeX - 1
        const isEdgeY = h === 0 || h === sizeY - 1

        if (isEdgeX || isEdgeY) {
          if (scheme.value.get(id)) {
            let textOffset = 0

            if (w === sizeX - 1 || h === sizeY - 1) {
              textOffset = cellOffset.value
            }

            result.set(id, {
              ...scheme.value.get(id),
              x: cellWidth.value * w + textOffset,
              y: h + cellHeight.value * h + 7,
              width: cellWidth.value,
              fill: textColor.value,
            })
          } else {
            let text = 0

            if (isEdgeX) {
              text = h
            } else if (isEdgeY) {
              text = w
            }

            if (w === 0 && h === sizeY - 1) {
              text = 0
            } else if (w === sizeX - 1 && h === sizeY - 1) {
              text = 0
            }

            result.set(id, {
              type: 'text',
              id,
              x: cellWidth.value * w,
              y: h + cellHeight.value * h + 5,
              text,
              fontSize: WORKSPACE_FONT_SIZE,
              fontFamily: WORKSPACE_FONT_FAMILY,
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
  }

  function _updateColorHistory(color: string) {
    colorHistory.value = [...new Set([...colorHistory.value, getCorrectColor(color)])]
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
    colorHistory.value.push(getCorrectColor(cellColor.value))
    updateSelectedSchemeName()
  }

  function updateSelectedSchemeName(name?: string) {
    selectedScheme.value = name || ''
  }

  async function paintCell(id: string) {
    const cell = scheme.value.get(id)

    if (!cell) {
      return
    }

    const newColor = getCorrectColor(cellColor.value)

    cell.fill = cell.fill === newColor ? cellFill.value : newColor
    cell.isFilled = cell.fill !== INITIAL_CELL_FILL

    updateSelectedSchemeName()
  }

  function exportImage(schemeName) {
    const dataURL = stage.value.toDataURL({ pixelRatio: 3 })

    downloadURI(dataURL, `${schemeName}.png`)
  }

  function clearScheme() {
    scheme.value.clear()
    schemeWidth.value = INITIAL_SCHEME_WIDTH
    schemeHeight.value = INITIAL_SCHEME_HEIGHT
    cellFill.value = INITIAL_CELL_FILL
    strokeColor.value = INITIAL_STROKE_COLOR
    updateSelectedSchemeName()
    clearComments()

    updateScheme()
  }

  function setColorAsBackground(color: string) {
    cellFill.value = getCorrectColor(color)
    // инвертируем границы ячеек
    strokeColor.value = `#${(parseInt(color.substring(1), 16) ^ 0xFFFFFF | 0x1000000).toString(16).substring(1)}`

    updateScheme()
  }

  function saveSchemeToFavoriteStorage(name: string) {
    const schemeData = useStorage<ISavedParams>(name, {})

    favorites.value = [...new Set([...favorites.value, name])]

    if (schemeData.value) {
      schemeData.value = {}
    }

    schemeData.value = {
      scheme: [...scheme.value],
      hasCellOffset: hasCellOffset.value,
      cellFill: cellFill.value,
      strokeColor: strokeColor.value,
      cellWidth: cellWidth.value,
      schemeWidth: schemeWidth.value,
      schemeHeight: schemeHeight.value,
      cellColor: getCorrectColor(cellColor.value),
      colorHistory: [...new Set(colorHistory.value)],
      isVisibleComments: isVisibleComments.value,
      comments: [...comments.value],
    }

    updateSelectedSchemeName(name)
  }

  async function restoreSchemeFromFavoriteStorage(name: string) {
    const schemeData = useStorage<ISavedParams>(name, {})

    schemeHeight.value = schemeData.value.schemeHeight
    schemeWidth.value = schemeData.value.schemeWidth
    hasCellOffset.value = schemeData.value.hasCellOffset
    cellFill.value = schemeData.value.cellFill
    strokeColor.value = schemeData.value.strokeColor
    cellWidth.value = schemeData.value.cellWidth
    cellColor.value = getCorrectColor(schemeData.value.cellColor)
    colorHistory.value = [...new Set(schemeData.value.colorHistory)] as string[]
    scheme.value = new Map(schemeData.value.scheme)
    isVisibleComments.value = schemeData.value.isVisibleComments ?? true
    comments.value = new Map(schemeData.value.comments || [])

    updateScheme()
  }

  function shareScheme(schemeName: string) {
    downloadJSON({
      scheme: [...scheme.value],
      hasCellOffset: hasCellOffset.value,
      cellFill: cellFill.value,
      strokeColor: strokeColor.value,
      cellWidth: cellWidth.value,
      schemeWidth: schemeWidth.value,
      schemeHeight: schemeHeight.value,
      cellColor: getCorrectColor(cellColor.value),
      colorHistory: [...new Set(colorHistory.value)],
      isVisibleComments: isVisibleComments.value,
      comments: [...comments.value],
    }, schemeName)
  }

  async function parseScheme(fileupload) {
    const params: ISavedParams = await readFile(fileupload)

    schemeHeight.value = params.schemeHeight
    schemeWidth.value = params.schemeWidth
    hasCellOffset.value = params.hasCellOffset
    cellFill.value = params.cellFill
    strokeColor.value = params.strokeColor
    cellWidth.value = params.cellWidth
    cellColor.value = getCorrectColor(params.cellColor)
    colorHistory.value = [...new Set(params.colorHistory)]
    scheme.value = new Map(params.scheme)
    isVisibleComments.value = params.isVisibleComments ?? true
    comments.value = new Map(params.comments || [])

    updateScheme()
  }

  // для обратной совместимости (удалить через какое то время)
  function getCorrectColor(color: string) {
    return color.includes('#') ? color : `#${color}`
  }

  function setCellColor(color: string) {
    cellColor.value = getCorrectColor(color)
  }

  function addComment(comment, x, y) {
    const id = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')

    comments.value.set(id.value, {
      id: id.value,
      label: {
        x,
        y,
        opacity: 0.75,
        draggable: true,
      },
      tag: {
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {
          x: 10,
          y: 10,
        },
        shadowOpacity: 0.5,
        cornerRadius: cornerRadius.value,
      },
      text: {
        text: comment,
        fontSize: WORKSPACE_FONT_SIZE,
        fontFamily: WORKSPACE_FONT_FAMILY,
        padding: 5,
        fill: 'white',
      },
    })
  }

  function saveCommentPosition({ id, x, y }) {
    const comment = comments.value.get(id)

    comment.label.x = x
    comment.label.y = y
  }

  function clearComments() {
    comments.value.clear()
  }

  function removeComment(id) {
    comments.value.delete(id)
  }

  return {
    scheme,
    comments,
    isDark,
    hasCellOffset,
    schemeWidth,
    schemeHeight,
    cellWidth,
    cellHeight,
    cellColor,
    colorHistory,
    toggleDarkMode,
    favorites,
    selectedScheme,
    isVisibleComments,
    saveSchemeToFavoriteStorage,
    restoreSchemeFromFavoriteStorage,
    paintCell,
    clearColorHistory,
    exportImage,
    removeColorFromHistory,
    clearScheme,
    setColorAsBackground,
    shareScheme,
    parseScheme,
    updateSelectedSchemeName,
    setCellColor,
    getCorrectColor,
    addComment,
    saveCommentPosition,
    clearComments,
    removeComment,

    updateScheme,
  }
}
