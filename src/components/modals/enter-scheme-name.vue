<script setup lang="ts">
import PrimeDialog from 'primevue/dialog'
import PrimeButton from 'primevue/button'
import InputText from 'primevue/inputtext'

const isVisible = defineModel('isVisible', {
  type: Boolean,
  default: false,
})
const model = defineModel()

defineProps({
  name: {
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

defineEmits(['save'])
</script>

<template>
  <prime-dialog
      v-model:visible="isVisible"
      modal
      :header="name"
      :style="{ width: '25rem' }"
  >
    <input-text
        v-model="model"
        class="w-full"
        autocomplete="off"
        autofocus
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
          @click="$emit('save', $event)"
      />
    </div>
  </prime-dialog>
</template>
