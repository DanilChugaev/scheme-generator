<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useWorkspace } from '../../composables/useWorkspace'
import { useSettings } from '../../composables/useSettings'
import ContextMenu from 'primevue/contextmenu'
import EnterNameModal from '../modals/enter-name.vue'
import { INITIAL_CELL_WIDTH } from '../../constants'

const container = ref(null)
const { width, height } = useElementSize(container)
const {
  stage,
  groupConfig,
  scaling,
  setCursorPointer,
  setCursorDefault,
  setCursorMove,
  saveWorkspacePosition,
} = useWorkspace()
const {
  scheme,
  comments,
  cellWidth,
  isVisibleComments,
  paintCell,
  addComment,
  saveCommentPosition,
  removeComment,
} = useSettings()

const configKonva = reactive({
  width,
  height,
})
const group = ref(null)
const workspaceMenu = ref(null)
const labelMenu = ref(null)
const isCacheEnabled = ref(true)
const isVisibleModalForAddComment = ref(false)
const isVisibleLabelContextMenu = ref(false)
const commentText = ref('')
const commentPositionX = ref(0)
const commentPositionY = ref(0)
const selectedCommentId = ref('')

const contextMenuItems = computed(() => [
  {
    label: 'Добавить комментарий',
    icon: 'pi pi-plus',
    command: () => isVisibleModalForAddComment.value = true,
  },
])

const contextMenuLabelItems = computed(() => [
  {
    label: 'Удалить комментарий',
    icon: 'pi pi-trash',
    command: () => removeComment(selectedCommentId.value),
  },
])

function onDragGroupStart() {
  if (isCacheEnabled.value) {
    group.value.getNode().cache()
  }

  setCursorMove()
}

function onDragGroupEnd(event) {
  if (isCacheEnabled.value) {
    group.value.getNode().clearCache()

    saveWorkspacePosition({
      x: event.target.attrs.x,
      y: event.target.attrs.y,
    })
  }

  setCursorPointer()
}

function onDragLabelStart() {
  disableCache()
}

function onDragLabelEnd(event, id) {
  enableCache()

  saveCommentPosition({
    id,
    x: event.target.attrs.x,
    y: event.target.attrs.y,
  })
}

function disableCache() {
  isCacheEnabled.value = false
}

function enableCache() {
  setTimeout(() => isCacheEnabled.value = true, 0)
}

function addNewComment() {
  addComment(commentText.value, commentPositionX.value, commentPositionY.value)

  isVisibleModalForAddComment.value = false

  commentText.value = ''
  commentPositionX.value = 0
  commentPositionY.value = 0
}

function viewWorkspaceContextMenu(event) {
  event.evt.preventDefault()

  if (isVisibleLabelContextMenu.value) return

  // данная проверка позволяет избежать проблем, когда внутри группы есть пустые области,
  // которые как будто к области не относятся и пытаемся там установить комментарий
  if (event.target.attrs.x >= 0 && event.target.attrs.y >= 0) {
    // если нажали внутри области группы
    commentPositionX.value = event.target.attrs.x + cellWidth.value / 2
    commentPositionY.value = event.target.attrs.y + INITIAL_CELL_WIDTH / 2
  } else {
    // если нажали вне области группы
    commentPositionX.value = event.evt.x - groupConfig.value.x
    commentPositionY.value = event.evt.y - groupConfig.value.y
  }

  workspaceMenu.value?.show(event.evt)
}

function viewLabelContextMenu(event, id) {
  selectedCommentId.value = id
  labelMenu.value?.show(event.evt)
}

async function paint(event, id: string) {
  // если не правая кнопка мыши
  if (event.evt.button !== 2) {
    await paintCell(id)
  }
}

onMounted(() => {
  stage.value = window.Konva.stages[0]

  stage.value.on('wheel', scaling)
})
</script>

<template>
  <enter-name-modal
      v-model="commentText"
      v-model:is-visible="isVisibleModalForAddComment"
      title="Введите комментарий"
      @save="addNewComment"
  />

  <div
      ref="container"
      class="h-full w-full"
  >
    <v-stage
        :config="configKonva"
        aria-haspopup="true"
        @contextmenu="viewWorkspaceContextMenu($event)"
    >
      <v-layer>
        <v-group
            ref="group"
            :config="groupConfig"
            @dragstart="onDragGroupStart"
            @dragend="onDragGroupEnd"
            @mouseover="setCursorPointer"
            @mouseleave="setCursorDefault"
        >
          <template v-for="cell of scheme.values()">
            <template v-if="cell.type === 'text'">
              <v-text
                  v-if="cell.text != '0'"
                  :key="cell.id"
                  :config="cell"
              />
            </template>
            <v-rect
                v-else
                :key="cell.id"
                :config="cell"
                @click="paint($event, cell.id)"
            />
          </template>

          <template v-if="isVisibleComments">
            <template
                v-for="comment of comments.values()"
                :key="comment.id"
            >
              <v-label
                  :config="comment.label"
                  aria-haspopup="true"
                  @contextmenu="viewLabelContextMenu($event, comment.id)"
                  @dragstart="onDragLabelStart"
                  @dragend="onDragLabelEnd($event, comment.id)"
              >
                <v-tag :config="comment.tag" />
                <v-text :config="comment.text" />
              </v-label>
            </template>
          </template>
        </v-group>
      </v-layer>
    </v-stage>

    <context-menu
        ref="workspaceMenu"
        :model="contextMenuItems"
    />

    <context-menu
        ref="labelMenu"
        :model="contextMenuLabelItems"
        @before-show="isVisibleLabelContextMenu = true"
        @before-hide="isVisibleLabelContextMenu = false"
    />
  </div>
</template>
