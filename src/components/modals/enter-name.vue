<script setup lang="ts">
import { ref } from 'vue'
import PrimeDialog from 'primevue/dialog'
import PrimeButton from 'primevue/button'
import InputText from 'primevue/inputtext'

const isVisible = defineModel('isVisible', {
  type: Boolean,
  default: false,
})
const model = defineModel()

defineProps({
  title: {
    type: String,
    default: 'Введите имя схемы',
  },
  saveLabel: {
    type: String,
    default: 'Сохранить',
  },
  cancelLabel: {
    type: String,
    default: 'Отмена',
  },
})

const emit = defineEmits(['save'])

const isValid = ref(true)

function validateBeforeSave(event) {
  if (!model.value) {
    isValid.value = false
  } else {
    emit('save', event)
  }
}
</script>

<template>
  <prime-dialog
      v-model:visible="isVisible"
      modal
      :header="title"
      :style="{ width: '25rem' }"
  >
    <input-text
        v-model="model"
        class="w-full"
        autocomplete="off"
        autofocus
        :invalid="!isValid"
        @update:model-value="isValid = true"
        @keydown.enter="$emit('save', $event)"
    />

    <div class="flex justify-end gap-2 mt-3">
      <prime-button
          type="button"
          severity="secondary"
          :label="cancelLabel"
          @click="isVisible = false"
      />
      <prime-button
          type="button"
          :label="saveLabel"
          @click="validateBeforeSave($event)"
      />
    </div>
  </prime-dialog>
</template>
