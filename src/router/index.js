import { createRouter, createWebHistory } from 'vue-router'

let history = createWebHistory();
const routes = [
  {
    path: '/week2-F2E/',
    name: 'homePage',
    component: () => import('../page/HomePage.vue'),
  },
  {  
    path: '/week2-F2E/fileUpload',
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
