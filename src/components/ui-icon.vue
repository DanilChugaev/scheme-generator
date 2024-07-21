<script setup lang="ts">
import { computed, PropType } from 'vue'
import sprite from '~/assets/img/sprite.svg'
import { IconTypes } from './types/icon'

const props = defineProps({
  name: {
    type: String as PropType<keyof typeof IconTypes>,
    required: true,
    validator: (v: IconTypes): boolean => Object.values(IconTypes).includes(v),
  },
})

const iconPath = computed<string>(() => `${sprite}#${props.name}`)
</script>

<template>
  <svg
    class="ui-icon"
    viewBox="0 0 22 22"
  >
    <use
      :href="iconPath"
      :xlink-href="iconPath"
    />
  </svg>
</template>

<style scoped>
.ui-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  flex-shrink: 0;
  font-size: 22px;
}
</style>
