import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/reception',
    component: () => import('../views/ReceptionView.vue')
  },
  {
    path: '/login',
    component: () => import('../views/backstage/LoginView.vue')
  },
  {
    path: '/product',
    component: () => import('../views/backstage/ProductsView.vue')
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
});

export default router;
