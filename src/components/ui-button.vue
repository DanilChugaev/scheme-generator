<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'button' | 'submit' | 'reset' | undefined>,
    default: 'button',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    class="ui-button"
    :type="type"
    :disabled="disabled"
  >
    <slot>кнопка</slot>
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  padding: 10px 15px;
  height: var(--ui-height);
  background-color: var(--color-bg-button);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-button-hover);
  }

  &:active {
    background-color: var(--color-bg-button-active);
  }
}
</style>
