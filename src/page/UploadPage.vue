<template>
  <div id="Upload" style="height: 1440px">
    <div class="Upload__nav"></div>
    <div class="Upload_progress">
      <ul class="progress_content">
        <!-- 控制步驟，動態控制 progressData item.status , 0 已經做， 1正在做 ，2還沒做 -->
        <li
          v-for="(item, i) in progressData"
          :key="i"
          class="progress_content__item"
          :class="{'progress_content__item--alreadyDo':item.status == 0,
          'progress_content__item--nowDo':item.status == 1,
          'progress_content__item--willDo':item.status == 2,
        }"
        >
          <img :src="item.img" alt="progress" />
          <div class="progress_content__item__text">{{ item.text }}</div>
        </li>
      </ul>
    </div>
    <div v-if="uploadMode" class="Upload_content_wrapper">
      <div class="Upload_content" 
        @drop="ondrop" 
        @dragleave="dragleave"
        @dragenter="ondragenter"
        @dragover="ondragover"
        >
      </div>

    </div>
    <!-- <div v-else class="Upload_pdf">
      <pdfview/>
    </div> -->
  </div>
</template>
<script>
import {ref, reactive, onMounted} from 'vue';
import finish from '../assets/img/finish.svg';
import sign from '../assets/img/sign.svg';
import upload from '../assets/img/upload.svg';
import pdfview from '../components/pdfview.vue';
import fileReview from '../page/FileReview.vue';
import axios from 'axios';
export default {
  components: {
    pdfview,
    fileReview
  }
}
</script>
<script setup>
const progressData = reactive([
  {
    img: upload,
    text: "上傳簽署檔案",
    status: 1 // 0 已經做 1 正在做 2 還沒做
  },
  {
    img: sign,
    text: "進行簽署",
    status: 2
  },
  {
    img: finish,
    text: "簽署完成（下載）",
    status: 2
  },
]);
var fileList = [];
var uploadMode = ref(true); // dev for false
// const drag_upload = ref(null) // vue3 使用  ref 的方式
onMounted(()=>{
})
function dragleave (e){
  console.log('拖出');
  e.preventDefault();  //阻止離開時的瀏覽器預設行為
}
function ondragenter (e){
  e.preventDefault();  //阻止拖入時的瀏覽器預設行為
  console.log('拖入')
}
function ondragover(e){
  console.log('正在拖')
  e.preventDefault();
}
function ondrop (e){
  console.log('拖曳結束')
  e.preventDefault(); //阻止拖放後的瀏覽器預設行為
    const data = e.dataTransfer.files // 取得檔案
    if(data.length < 1){
      return; // 檢查檔案是否有拖曳進來
    }
    if(data.size >= 2000000){ // 超過2mb不可上傳
      alert('不可超過2mb');
      return;
    }
    console.log(e.dataTransfer.files); 
    const formData = new FormData(); // 建立一個 newForm
    for(var i=0;e.dataTransfer.files.length-1;i++){
      console.log(e.dataTransfer.files.length);
      if(e.dataTransfer.files[i].name.indexOf('pdf') === -1){ // 檢查是否上傳的檔案不符合格式
        alert('請上傳pdf檔案')
        return;
      }
      formData.append('uploadFile', e.dataTransfer.files[i], e.dataTransfer.files[i].name);
    }
    // fileList = fileList.concat.dataTransfer.files[0];
    // console.log(formData, fileList, e.dataTransfer.files[0]);
    console.log(formData)

  axios.post('http://localhost:8080/uploadFile', formData({
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
    ).then(res => {
        if (res.data !== null && res.data.length > 1) {
            console.log(res.data)
        }
    }).catch(err=>{
        console.log(err);
    })
}

</script>

<style lang="scss" scoped>
$main_color: #be8e55;
#Upload {
  @apply h-screen w-full flex flex-col items-center;
  max-width: 1440px;
  background-color: #f5f5f5;
}
.Upload_content_wrapper {
  @apply rounded-md flex items-center justify-center my-4;
  padding: 40px;
  background-color: #efe3d4;
  width: 600px;
  height: 600px;
  .Upload_content {
    @apply border rounded-md border-dashed flex flex-col items-center justify-center;
    border-color: $main_color;
    width: 536px;
    height: 536px;
    color: $main_color;
    .file {
      @apply border rounded px-2 py-1 flex flex-nowrap items-center;
      border-color: $main_color;
      margin-bottom: 8px;
      > img {
        margin-right: 4px;
      }
    }
    .file,
    .text {
      margin-bottom: 8px;
      font-weight: 700px;
      font-size: 16px;
      line-height: 23px;
    }
    &--uploaded {
      @apply border-none;
    }
  }
}
.Upload_progress {
  margin: 60px 0;
  fill: $main_color;
  .progress_content__item {
    @apply relative flex flex-col justify-center items-center whitespace-nowrap border rounded-full;
    width: 60px;
    height: 60px;
    border-color: $main_color;
    &:nth-last-child(1) {
      &::before {
        display: none;
      }
    }
    &::before {
      @apply absolute;
      top: 29px;
      left: 59px;
      display: block;
      content: "";
      height: 2px;
      width: 96px;
      background-color: $main_color;
    }
    &--alreadyDo {
      @apply border;
      opacity: 1;
      &::before {
        opacity: 1;
      }
    }
    &--nowDo {
      @apply border-dashed;
      &::before {
        opacity: 0.5;
      }
    }
    &--willDo {
      @apply border-dashed;
      opacity: 0.5;
      &::before {
        opacity: 0.5;
      }
    }
    > img {
      width: 32px;
      height: 32px;
    }
    .progress_content__item__text {
      @apply absolute bottom-0 ;
      top: 70px;
    }
  }
  .progress_content {
    @apply flex flex-nowrap items-center justify-between;
    color: $main_color;
    &__item {
      margin: 0 47.5px;
      &__line {
      }
    }
  }
}
.Upload_content_section {
  @apply border rounded-md border-dashed flex flex-col items-center justify-center w-full;
  height: 240px;
  margin: 15px;
  width: 536px;
  border-color: $main_color;
.Upload_pdf{
  @apply overflow-scroll;
  width: 1160px;
  height: 2106px;
}

}

</style>
