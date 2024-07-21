import { createRouter, createWebHistory } from 'vue-router';

import Index from './pages/index.vue';
import Home from './pages/home.vue';

const BASE_PATH = import.meta.env.VITE_BASE_PATH;

const routes = [
  { path: `${BASE_PATH}/`, component: Index },
  { path: `${BASE_PATH}/home`, component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;