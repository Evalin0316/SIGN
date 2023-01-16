<template>
  <div class="Upload_progress">
    <ul class="progress_content">
      <!-- 控制步驟，動態控制 progressData item.status , 0 已經做， 1正在做 ，2還沒做 -->
      <li
        v-for="(item, i) in progressData"
        :key="i"
        class="progress_content__item"
        :class="{
          'progress_content__item--alreadyDo': item.status == 0,
          'progress_content__item--nowDo': item.status == 1,
          'progress_content__item--willDo': item.status == 2,
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
      default: [1,2,2],
    },
  },
  setup(props) {
    const progressData = computed(() => {
      return [
        {
          img: upload,
          text: "上傳簽署檔案",
          status: props.arrStatus[0], // 0 已經做 1 正在做 2 還沒做
        },
        {
          img: sign,
          text: "進行簽署",
          status: props.arrStatus[1],
        },
        {
          img: finish,
          text: "簽署完成（下載）",
          status: props.arrStatus[2],
        },
      ];
    });
    return {props,progressData};
}, 

};
</script>