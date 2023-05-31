import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'homePage',
    component: () => import('../page/HomePage.vue'),
    meta:{
      activeMenuName: "homePage"
    }
  },
  {  
    path: '/fileUpload',
    name: 'fileUpload',
    component: () => import('../page/FileUpload.vue'),
    meta:{
      activeMenuName: "fileUpload"
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../page/ErrorPage.vue'),
    meta:{
      activeMenuName: "errorPage"
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkExactActiveClass: 'active',
  routes,
});

export default router;
