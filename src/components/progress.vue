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
<script></script>
<script>
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import finish from "../assets/img/finish.svg";
import sign from "../assets/img/sign.svg";
import upload from "../assets/img/upload.svg";
export default {
  props: {
    arrStatus: {
      type: Array,
      default: [1, 2, 2],
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
    return {progressData};
},

};
</script>

<style lang="scss" scoped>
$main_color: #be8e55;
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
      @apply absolute bottom-0;
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
</style>
