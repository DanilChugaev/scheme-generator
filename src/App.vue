<script lang="ts" setup>
import { ref, inject } from 'vue'

import UiInput from '~/components/ui-input.vue'
import UiButton from '~/components/ui-button.vue'
import UiSwitch from './components/ui-switch.vue'

const toggleDarkMode = inject('toggleDarkMode')

const text = ref('')
const isDark = ref(toggleDarkMode())
const log = () => console.log(text.value)
</script>

<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />

    <ui-switch v-model="isDark" @change="toggleDarkMode"/>
    <div> isDark - {{ isDark }} </div>

    <div>
      <ui-input
        v-focus
        v-model="text"
        @keyup.enter="log"
      />
      <ui-button
        @click="log"
      >
        Кнопка
      </ui-button>
    </div>

    <div>
      {{ text }}
    </div>

    <router-link :to="`${$basePath}/`">Index</router-link>
    <br>
    <router-link :to="`${$basePath}/home`">Go to Home</router-link>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import "./assets/scss/index.scss";
</style>
