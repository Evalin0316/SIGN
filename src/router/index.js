import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'homePage',
    component: () => import('@/page/HomePage.vue'),
  },
  {  
    path: '/fileUpload',
    name: 'fileUpload',
    component: () => import('@/page/FileUpload.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/page/ErrorPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkExactActiveClass: 'active',
  routes,
});

export default router;
