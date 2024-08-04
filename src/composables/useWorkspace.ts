import { ref } from 'vue'
import { INITIAL_GROUP_POSITION, INITIAL_STAGE_SCALE } from '../constants'
import { useStorage } from '@vueuse/core'

const stage = ref(null)

export function useWorkspace() {
  const scaleBy = 1.2

  const groupConfig = useStorage('group-config', {
    x: INITIAL_GROUP_POSITION,
    y: INITIAL_GROUP_POSITION,
    draggable: true,
  })

  function scaling(event) {
    // TODO: добавить здесь кэширование
    // stop default scrolling
    event.evt.preventDefault()

    const oldScale = stage.value.scaleX()
    const pointer = stage.value.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.value.x()) / oldScale,
      y: (pointer.y - stage.value.y()) / oldScale,
    }

    // how to scale? Zoom in? Or zoom out?
    const direction = event.evt.deltaY > 0 ? -1 : 1
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    stage.value.scale({ x: newScale, y: newScale })
    stage.value.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }

  function setCursorPointer() {
    stage.value.container().style.cursor = 'pointer'
  }

  function setCursorDefault() {
    stage.value.container().style.cursor = 'default'
  }

  function setCursorMove() {
    stage.value.container().style.cursor = 'move'
  }

  function saveWorkspacePosition({ x, y }) {
    if (groupConfig.value.draggable) {
      groupConfig.value.x = x
      groupConfig.value.y = y
    }
  }

  function clearWorkspacePosition() {
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

  return {
    stage,
    groupConfig,
    scaling,
    setCursorPointer,
    setCursorDefault,
    setCursorMove,
    saveWorkspacePosition,
    clearWorkspacePosition,
  }
}
