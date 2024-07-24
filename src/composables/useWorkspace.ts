import { ref } from 'vue'

const stage = ref(null)

export function useWorkspace() {
  const scaleBy = 1.2

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

  return {
    stage,
    scaling,
    setCursorPointer,
    setCursorDefault,
    setCursorMove,
  }
}
