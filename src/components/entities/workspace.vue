<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useWorkspace } from '../../composables/useWorkspace'
import { useSettings } from '../../composables/useSettings'

const container = ref(null)
const { width, height } = useElementSize(container)
const {
  stage,
  scaling,
  setCursorPointer,
  setCursorDefault,
  setCursorMove,
} = useWorkspace()
const {
  list,
  groupConfig,
  paintCell,
} = useSettings()

const configKonva = reactive({
  width,
  height,
})
const group = ref(null)

function onDragStart() {
  group.value.getNode().cache()
  setCursorMove()
}

function onDragEnd() {
  group.value.getNode().clearCache()
  setCursorPointer()
}

onMounted(() => {
  stage.value = window.Konva.stages[0]

  stage.value.on('wheel', scaling)
})
</script>

<template>
  <div ref="container" class="h-full w-full">
    <v-stage :config="configKonva">
      <v-layer>
        <v-group
            ref="group"
            :config="groupConfig"
            @dragstart="onDragStart"
            @dragend="onDragEnd"
            @dragover="console.log('dragover')"
            @dragenter="console.log('dragenter')"
            @dragleave="console.log('dragleave')"
            @drag="console.log('drag')"
            @drop="console.log('drop')"
            @mouseover="setCursorPointer"
            @mouseleave="setCursorDefault"
        >
          <template v-for="item in list">
            <template v-if="item.type === 'text'">
              <v-text
                  v-if="item.text != '0'"
                  :key="item.id"
                  :config="item"
              />
            </template>
            <v-rect
                v-else
                :key="item.id"
                :config="item"
                @click="paintCell(item.id)"
            />
          </template>
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped lang="postcss">

</style>
