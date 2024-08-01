import { createApp } from 'vue'
import App from './App.vue'
import VFocus from './directives/v-focus'
import toggleDarkMode from './functions/toggleDarkMode'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import VueKonva from 'vue-konva'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const app = createApp(App);

app.config.globalProperties.$basePath = import.meta.env.VITE_BASE_PATH;
app.provide('toggleDarkMode', toggleDarkMode());

app.directive(VFocus.name, VFocus);

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}'
    },
  },
});

app
  .use(Vue3ColorPicker)
  .use(ToastService)
  .use(ConfirmationService)
  .use(VueKonva)
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
    },
  })
  .mount('#app');
