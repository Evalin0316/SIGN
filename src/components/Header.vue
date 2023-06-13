<template>
    <div>
      <!-- 首頁狀態 -->
      <div class="flex items-center justify-center relative h-[66px]" v-if="headerStatus == 'homePage'">
          <div class="absolute left-0 ml-5 py-3"><img src="../assets/images/sign_logo.svg" /></div>
      </div>
      <!-- 簽署狀態 -->
      <div class="container_tab flex justify-between items-center p-2.5" v-if="headerStatus == 'fileUpload'">
      <div @click="prevPage" class="btn flex items-center w-24 py-4 ml-4 cursor-pointer" :class="fileReview ? '' : 'hidden'">
        <img src="../assets/images/icon_arrows_left_n.svg" class="prevBtn" alt="previcon">
        <a class="block max-[540px]:hidden">Previous</a>
      </div>
      <router-link to="/" class="" :class="fileReview ? 'hidden' : ''">
        <div class="btn flex items-center w-24 py-4 ml-4 cursor-pointer">
          <img src="../assets/images/icon_arrows_left_n.svg" alt="previcon">
          <a class="block max-[540px]:hidden">Cancel</a>
        </div>
      </router-link>
        <div class="flex justify-between" :class="fileReview ? '' : 'hidden'">
            <a class="signBtn flex flex-col items-center w-20 cursor-pointer">
            <img src="../assets/images/Tab_sign.png" />
            </a>
            <a class="dateBtn flex flex-col items-center w-20 cursor-pointer">
              <img src="../assets/images/Tab_date.png"/>
            </a>
            <a class="textBtn flex flex-col items-center w-20 cursor-pointer">
              <img src="../assets/images/Tab_text.png"/>
            </a>
        </div>
      <div class="flex">
        <div @click.stop="saveDraft" class="btn nextBtn flex  items-center py-4 px-3 cursor-not-allowed mr-3" :class="fileReview ? '' : 'hidden'">
          Draft<img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
        <div @click="nextStep" class="btn nextBtn flex items-center w-20 py-4 cursor-not-allowed">
            <a class="block max-[540px]:hidden" :class="fileReview ? 'hidden' : ''">Next</a>
            <a :class="fileReview ? '' : 'hidden'">Save</a>
            <img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
      </div>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue';
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
  
    return {
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
  max-width: 99px;
}

</style>