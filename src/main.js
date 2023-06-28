import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router';
import mitt from 'mitt';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import { faGooglePlus } from '@fortawesome/free-brands-svg-icons'
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import PageLoading from './components/PageLoading.vue';

library.add(faSignature)
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.$emitter = emitter;

app.config.errorHandler = (err, vm, info) => {
   console.log('有錯誤');
   console.error(err,info);
}

app.component('font-awesome-icon', FontAwesomeIcon)
   .component('PageLoding', PageLoading)
   .use(router)
   .provide('emitter',emitter)
   .mount('#app');