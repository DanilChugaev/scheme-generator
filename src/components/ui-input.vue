<script lang="ts" setup>
const model = defineModel()
</script>

<template>
  <input
    v-model="model"
    class="ui-input"
    type="text"
  >
</template>

<style scoped lang="scss">
.ui-input {
  width: 300px;
  height: var(--ui-height);
  padding: 0 var(--spacer-mini);
  border: 1px solid var(--color-border);
}
</style>
