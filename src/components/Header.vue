<template>
    <div>
      <!-- 首頁狀態 -->
      <!-- <SelectSign v-if="isSelectSign" @closeWarning="closeWarning" @selectedSign="selectedSign"  :passStatus="passStatus"/> -->
      <div class="flex items-center justify-center relative h-[66px]" v-if="headerStatus == 'homePage'">
          <div class="absolute left-0 ml-5 py-3"><img src="../assets/images/sign_logo.svg" /></div>
          <!-- <div class="flex justify-between w-56">
            <a class="signBtn flex items-center w-30 py-4 cursor-pointer tab-brown text-[#BE8E55] font-bold">
              <img src="../assets/images/icon_document_own_n.svg"/>
                待簽署
            </a>
            <a class="dateBtn flex items-center w-30 py-4 cursor-pointer text-[#BE8E55] font-bold" @click="manageSign()">
                <img src="../assets/images/icon_document_setting_n.svg"/>
                管理簽名
            </a>
          </div> -->
      </div>
      

      <!-- 上傳檔案 -->
      <!-- <div class="flex justify-between" v-if="headerStatus == 'fileUpload'">
      <div class="btn prevBtn flex items-center w-20 py-4 ml-4 cursor-pointer my-4">
        <img src="../assets/images/icon_arrows_left_n.svg" alt="previcon">
        <router-link to="/week2-F2E/">
        Cancel</router-link></div>
        <div @click="nextStep" class="btn nextBtn flex  items-center w-20 py-4 mr-4 cursor-not-allowed my-4">
        Next<img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
      </div> -->

      <!-- 簽署狀態 -->
     
      <div class="container_tab flex justify-between items-center px-1" v-if="headerStatus == 'fileUpload'">
      <a @click="prevPage" class="btn prevBtn flex items-center w-20 py-4 ml-4 cursor-pointer" :class="fileReview ? '' : 'hidden'">
        <img src="../assets/images/icon_arrows_left_n.svg" alt="previcon">
        Previous
      </a>
      <router-link to="/week2-F2E/" class="btn prevBtn flex items-center w-20 py-4 ml-4 cursor-pointer my-4" :class="fileReview ? 'hidden' : ''">
      <img src="../assets/images/icon_arrows_left_n.svg" alt="previcon">
        Cancel
      </router-link>
        <div class="flex justify-between" :class="fileReview ? '' : 'hidden'">
            <a class="signBtn flex flex-col items-center w-20 py-4 cursor-pointer">
            <img src="../assets/images/Tab_sign.png" />
            </a>
            <a class="dateBtn flex flex-col items-center w-20 py-4 cursor-pointer">
              <img src="../assets/images/Tab_date.png"/>
            </a>
            <a class="textBtn flex flex-col items-center w-20 py-4 cursor-pointer">
              <img src="../assets/images/Tab_text.png"/>
            </a>
        </div>
      <div class="flex">
        <div @click.stop="saveDraft" class="btn nextBtn flex  items-center py-4 px-3 cursor-not-allowed mr-3" :class="fileReview ? '' : 'hidden'">
          Draft<img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
        <div @click="nextStep" class="btn nextBtn flex  items-center w-20 py-4 cursor-not-allowed">
            Next<img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
      </div>
      </div>
    </div>
</template>

<script>
// import SelectSign from '../components/ChoiceSign.vue';
import { onMounted, ref, reactive,inject, onUpdated,onBeforeMount } from 'vue';
import bus from "../srcipt/bus";
var canvas = null;
export default {
    components: {},
  // emits:['status'],
  setup (props, ctx ) {
    const signUrl = ref('')
    const headerStatus = ref('')
    const fileReview = ref('')
    const passStatus = ref('home')
    // const emitter = inject('emitter')

    const nextStep = () => {
      ctx.emit('nextStep') // = this.$emits
    }
    const prevPage = () => {
      ctx.emit('prevPage')
    }

    const saveDraft = () => {
      ctx.emit('saveDraft');
    }

    bus.on('headerStatus', (v) => {
      headerStatus.value = v
    })

    bus.on('fileReview',(v) =>{
      fileReview.value = v;
    })
  

  // 圖片放在PDF上
    const selectedSign = (selectedSign) => {
      fabric.Image.fromURL(selectedSign, (image) => {
        image.top = 100
        image.left = 500
        image.scaleX = 0.5
        image.scaleY = 0.5
        canvas.add(image);
      })
    }

    return {
        selectedSign,
        signUrl,
        nextStep,
        prevPage,
        headerStatus,
        fileReview,
        passStatus,
        saveDraft
    }
  } 
}
</script>

<style scoped lang="scss">
$main_color: #be8e55;
.container_tab{
    background: #FFFFFF;
}
.btn {
  @apply justify-center cursor-pointer rounded;
  color: $main_color;
  font-weight: 500;
  background-color: #EFE3D4;
  // width: 70px;
  height: 34px;
  max-height: 50px;

}
.prevBtn {
  width: 99px;
}

</style>