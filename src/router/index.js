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
]

export default createRouter({ history,routes })
