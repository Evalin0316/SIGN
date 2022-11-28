import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'app',
    component: () => import('../App.vue')
  },
  {
    path: '/fileUpload',
    name: 'FileUpload',
    component: () => import('../page/FileUpload.vue')
  },
  {
    path: '/FileReview',
    name: 'FileReview',
    component: () => import('../page/FileReview.vue')
  },
  {
    path: '/pdfview',
    name: 'pdfview',
    component: () => import('../components/pdfview.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: 'active',
  routes,
})

export default router
