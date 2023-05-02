<template>
  <div class="Upload_progress">
    <ul class="progress_content">
      <li
        v-for="(item, i) in progressData"
        :key="i"
        class="progress_content__item"
        :class="{
          'progress_content__item--alreadyDo': item.upload_status == 'alreadyDo',
          'progress_content__item--nowDo': item.upload_status == 'nowDo',
          'progress_content__item--willDo': item.upload_status == 'willDo',
        }"
      >
        <img :src="item.img" alt="progress" />
        <div class="progress_content__item__text">{{ item.text }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import finish from "../assets/img/finish.svg";
import sign from "../assets/img/sign.svg";
import upload from "../assets/img/upload.svg";
export default {
  props: {
    arrStatus: {
      type: Array,
      default: [true,false,false],
    },
  },
  setup(props) {
    const progressData = computed(() => {
      return [
        {
          img: upload,
          text: "上傳簽署檔案",
          upload_status: props.arrStatus[0],
        },
        {
          img: sign,
          text: "進行簽署",
          upload_status: props.arrStatus[1],
        },
        {
          img: finish,
          text: "簽署完成（下載）",
          upload_status: props.arrStatus[2],
        },
      ];
    });
    return {props,progressData};
}, 

};
</script>

<style>
.progress_content__item{
    width:60%
}


</style>