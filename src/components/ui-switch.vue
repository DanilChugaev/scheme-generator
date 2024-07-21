<script lang="ts" setup>
import UiIcon from '~/components/ui-icon.vue'

const model = defineModel()
</script>

<template>
    <label class="ui-switch">
        <input
            v-model="model"
            class="ui-switch__checkbox"
            type="checkbox"
        />

        <span class="ui-switch__slider">
            <ui-icon class="ui-switch__icon" name="moon" />
        </span>
    </label>
</template>

<style lang="scss">
.ui-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: lightblue;
    border-radius: 34px;
    transition: 0.6s;

    &::before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      border-radius: 50%;
      transition: 0.4s;
    }
  }

  &__checkbox {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .ui-switch__slider {
      background-color: #1e2ea8;
    }

    &:checked + .ui-switch__slider::before {
      transform: translateX(26px);
    }
  }

  &__icon {
    transform: rotate(250deg);
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
</style>
