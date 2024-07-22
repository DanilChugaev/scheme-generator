<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'

const el = ref(null)
const isDragging = ref(false)
const { width, height } = useElementSize(el)

const configKonva = reactive({
  width,
  height,
})
const configCircle = reactive({
  x: 100,
  y: 100,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
})

const handleDragStart = () => {
  isDragging.value = true
}

const handleDragEnd = () => {
  isDragging.value = false
}

onMounted(() => {
  const stage = window.Konva.stages[0]
  var scaleBy = 1.3

  stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault()

    var oldScale = stage.scaleX()
    var pointer = stage.getPointerPosition()

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    stage.scale({ x: newScale, y: newScale })

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    stage.position(newPos)
  })
})
</script>

<template>
  <div ref="el" class="h-full w-full">
    <v-stage :config="configKonva">
      <v-layer>
        <v-circle :config="configCircle"
                  @dragstart="handleDragStart"
                  @dragend="handleDragEnd"
        ></v-circle>
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped lang="postcss">

</style>
