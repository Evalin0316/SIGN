<template>
  <div>
    <!-- <Header/> -->
   <router-view></router-view>
    <!-- <HomePage/>
    <FileUpload/> -->
      <!-- <PageLoading/> -->
    </div>
</template>

<script>
// import Header from './components/Header.vue';
import FileUpload from './page/FileUpload.vue'
import PageLoading from './components/PageLoading.vue'
import HomePage from './page/HomePage.vue'

export default {
  components:{
    // homePage,
    // UploadPage,
    // SignPage,
    // FileReview,
    // Header,
    FileUpload,
    PageLoading,
    HomePage
  },
  setup(){}
}
</script>


<style lang="scss">
@import './assets/css/all.scss';
</style>
