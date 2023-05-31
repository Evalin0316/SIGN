<template>
  <router-view/>
      <PageLoading/>
</template>

<script>
// import Header from './components/Header.vue';
import FileUpload from './page/FileUpload.vue'
import PageLoading from './components/PageLoading.vue'
import HomePage from './page/HomePage.vue'

export default {
  components:{
    FileUpload,
    PageLoading,
    HomePage
  },
  setup(){
  }
}
</script>


<style lang="scss">
@import './assets/css/all.scss';
</style>
