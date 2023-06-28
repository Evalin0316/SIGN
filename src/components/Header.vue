<template>
  <div>
    <!-- 首頁狀態 -->
    <div
      class="flex items-center justify-center relative h-[66px]"
      v-if="headerStatus == 'homePage'"
    >
      <div class="absolute left-0 ml-5 py-3">
        <img src="../assets/images/sign_logo.svg" />
      </div>
    </div>
    <!-- 簽署狀態 -->
    <div
      class="container_tab flex justify-between items-center p-2.5"
      v-if="headerStatus == 'fileUpload'"
    >
      <Button
        :buttonText="'Previous'"
        :class="fileReview ? '' : 'hidden'"
        :textPosition="'ml-5'"
        :otherClass="'max-[594px]:hidden'"
        @click="prevPage"
      >
      <template v-slot:image>
        <img class="left-2 absolute max-[594px]:left-1"  src="../../src/assets/images/icon_arrows_left_n.svg" />
      </template>
      </Button>
      <router-link to="/" class="" :class="fileReview ? 'hidden' : ''">
        <Button
          :buttonText="'Cancel'"
          :class="fileReview ? 'hidden' : ''"
          :textPosition="'ml-5'"
        >
        <template v-slot:image>
          <img class="left-2 absolute" src="../../src/assets/images/icon_arrows_left_n.svg" />
        </template>
        </Button>
      </router-link>
      <div class="flex justify-between" :class="fileReview ? '' : 'hidden'">
        <a class="signBtn flex flex-col items-center w-20 cursor-pointer">
          <img src="../assets/images/Tab_sign.png" />
        </a>
        <a class="dateBtn flex flex-col items-center w-20 cursor-pointer">
          <img src="../assets/images/Tab_date.png" />
        </a>
        <a class="textBtn flex flex-col items-center w-20 cursor-pointer">
          <img src="../assets/images/Tab_text.png" />
        </a>
      </div>
      <div class="flex flex-wrap">
        <div class="flex max-[594px]:mb-3">
          <tooltip-link :tip-text="tooltipText">
            <Button
              :buttonText="'Draft'"
              :textPosition="'mr-6'"
              class="max-[560px]:m-0 mr-3"
              :class="fileReview ? '' : 'hidden'"
              @click="saveDraft"
            >
            <template v-slot:image>
              <img class="right-4 top-2 absolute" src="../../src/assets/images/icon_arrows_right_n.svg" />
            </template>
            </Button>
          </tooltip-link>
        </div>
        <Button
          :buttonText="fileReview ? 'Save' : 'Next'"
          :textPosition="'mr-6'"
          @click="nextStep"
        >
          <template v-slot:image>
            <img class="right-4 top-2 absolute" src="../../src/assets/images/icon_arrows_right_n.svg" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import bus from "../srcipt/bus";
import tooltipLink from "../components/ToolTip.vue";
import Button from "../components/Button.vue";
var canvas = null;
export default {
  components: {
    tooltipLink,
    Button,
  },
  // emits:['status'],
  setup(props, ctx) {
    const signUrl = ref("");
    const headerStatus = ref("");
    const fileReview = ref("");
    const passStatus = ref("home");
    const tooltipText = ref(
      '<ol class="text-left"><li>1.檔案儲存草稿後可再更換檔案及檔名</li><li>2.需更換檔案才可以更改「簽名擋」</li></ol>'
    );
    // const emitter = inject('emitter')

    const nextStep = () => {
      ctx.emit("nextStep"); // = this.$emits
    };
    const prevPage = () => {
      ctx.emit("prevPage");
    };

    const saveDraft = () => {
      ctx.emit("saveDraft");
    };

    bus.on("headerStatus", (v) => {
      headerStatus.value = v;
    });

    bus.on("fileReview", (v) => {
      fileReview.value = v;
    });

    return {
      signUrl,
      nextStep,
      prevPage,
      headerStatus,
      fileReview,
      passStatus,
      saveDraft,
      tooltipText,
    };
  },
};
</script>

<style scoped lang="scss">
$main_color: #be8e55;
.container_tab {
  background: #ffffff;
}
.btn {
  @apply justify-center cursor-pointer rounded;
  color: $main_color;
  font-weight: 500;
  background-color: #efe3d4;
  max-width: 100px;
  height: 34px;
  max-height: 50px;
}
.prevBtn {
  max-width: 99px;
}
</style>