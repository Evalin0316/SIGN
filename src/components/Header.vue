<template>
    <div class="container_tab flex justify-between items-center px-1">
      <a @click="prevPage" class="btn prevBtn flex items-center w-20 py-4 ml-4 cursor-pointer">
        <!-- <img src="../assets/images/previous_btn.png"/> -->
        <img src="../assets/images/icon_arrows_left_n.svg" alt="previcon">
        Previous
       </a>
    <SelectSign v-if="isSelectSign" @closeWarning="closeWarning" @selectedSign="selectedSign"  />
        <div class="flex justify-between">
            <a class="signBtn flex flex-col items-center w-20 py-4 cursor-pointer" @click="isSelectSign = true">
            <img src="../assets/images/Tab_sign.png" @click="signModal"/>
            </a>
            <a class="dateBtn flex flex-col items-center w-20 py-4 cursor-pointer">
              <img src="../assets/images/Tab_date.png"/>
            </a>
           <a class="textBtn flex flex-col items-center w-20 py-4 cursor-pointer">
            <img src="../assets/images/Tab_text.png"/>
           </a>
        </div>
        <div @click="nextStep" class="btn nextBtn flex  items-center w-20 py-4 cursor-not-allowed">
            <!-- <img src="../assets/images/disabled-next.png"/> -->
            Next<img src="../assets/images/icon_arrows_right_n.svg" alt="nexticon">
        </div>
    </div>
</template>

<script>
import SelectSign from '../components/ChoiceSign.vue';
import { onMounted, ref, reactive } from 'vue';
var canvas = null;
export default {
    components: {
    // WarningAlert,
    SelectSign
  },
  setup (props, ctx ) {
    const isSelectSign = ref(false)
    const signUrl = ref('')
    const closeWarning = (closeWarning) => {
      isSelectSign.value = closeWarning
    }
    const nextStep = function(){
      ctx.emit('nextStep')
    }
    const prevPage = function(){
      ctx.emit('prevPage')
    }

  
    const selectedSign = (selectedSign) => {
      fabric.Image.fromURL(selectedSign, (image) => {
        image.top = 100
        image.left = 100
        image.scaleX = 0.5
        image.scaleY = 0.5
        canvas.add(image)
      })
    }
    return {
        isSelectSign,
        closeWarning,
        selectedSign,
        signUrl,
        nextStep
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
  width: 70px;
  height: 34px;

}
.prevBtn {
  width: 99px;
}

</style>