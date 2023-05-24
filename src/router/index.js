import { createRouter, createWebHistory } from 'vue-router'

let history = createWebHistory();
const routes = [
  {
    path: '/',
    name: 'homePage',
    component: () => import('../page/HomePage.vue'),
  },
  {  
    path: '/fileUpload',
    name: 'fileUpload',
    component: () => import('../page/FileUpload.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../page/ErrorPage.vue')
  }
]

export default createRouter({ history,routes })
