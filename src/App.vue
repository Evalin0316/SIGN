<template>
  <div>
    <!-- <Header/> -->
   <!-- <router-view /> -->
   <FileUpload/>
  </div>
</template>

<script>
// import Header from './components/Header.vue';
import FileUpload from './page/FileUpload.vue'

export default {
  components:{
    // homePage,
    // UploadPage,
    // SignPage,
    // FileReview,
    // Header,
    FileUpload
  }
}
</script>


<style lang="scss">
@import './assets/css/all.scss';
</style>
