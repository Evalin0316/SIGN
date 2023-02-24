<template>
  <div>
    <!-- <Header/> -->
   <!-- <router-view /> -->
   <FileUpload/>
    <!-- <PageLoading/> -->
  </div>
</template>

<script>
// import Header from './components/Header.vue';
import FileUpload from './page/FileUpload.vue'
import PageLoading from './components/PageLoading.vue'

export default {
  components:{
    // homePage,
    // UploadPage,
    // SignPage,
    // FileReview,
    // Header,
    FileUpload,
    PageLoading
  }
}
</script>


<style lang="scss">
@import './assets/css/all.scss';
</style>
