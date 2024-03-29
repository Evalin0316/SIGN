<template>
  <div class="flex flex-col items-center">
    <div class="source px-2" v-show="isSignSelf">
      <div class="signTitle">建立簽名</div>
      <div class="bg-white rounded-3xl max-w-xs md:max-w-none overflow-hidden">
        <vue-drawing-canvas
          ref="VueCanvasDrawing"
          v-model:image="image"
          :width="400"
          :height="400"
          :stroke-type="strokeType"
          :line-cap="lineCap"
          :line-join="lineJoin"
          :fill-shape="fillShape"
          :eraser="eraser"
          :lineWidth="line"
          :color="color"
          :background-color="backgroundColor"
          :background-image="backgroundImage"
          :watermark="watermark"
          :initial-image="initialImage"
          saveAs="png"
          :styles="{
            'border-radius': '26px',
          }"
          :lock="disabled"
          :additional-images="additionalImages"
        />
      </div>
    </div>

    <div class="flex items-center justify-between mb-6 w-full" :class="{ invisible: !isSignSelf }">
      <div class="p-2">
        <button
          type="button"
          @click.prevent="removeSavedStrokes()"
          class="
            py-3
            px-3
            w-[80px]
            rounded-lg
            border-2
          "
          style="background:#FFFFFF"
        >
          clear
        </button>
      </div>
      <div>
        <a
          class="h-8 w-8 rounded-full inline-block bg-black m-2 relative"
          @click="getColor('#000000')"
        >
          <div
            class="
              h-7
              w-7
              rounded-full
              inline-block
              bg-black
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2 -translate-y-1/2
            "
            :class="{ 'border-2 border-white': color === '#000000' }"
          ></div>
        </a>
        <a
          class="h-8 w-8 rounded-full inline-block bg-blue-700 m-2 relative"
          @click="getColor('#0014C7')"
        >
          <div
            class="
              h-7
              w-7
              rounded-full
              inline-block
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2 -translate-y-1/2
            "
            :class="{ 'border-2 border-white': color === '#0014C7' }"
          ></div>
        </a>
        <a
          class="h-8 w-8 rounded-full inline-block bg-red-700 m-2 relative"
          @click="getColor('#CA0000')"
        >
          <div
            class="
              h-7
              w-7
              rounded-full
              inline-block
              bg-red-700
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2 -translate-y-1/2
            "
            :class="{ 'border-2 border-white': color === '#CA0000' }"
          ></div>
        </a>
      </div>
      <div class="p-2">
        <button
          type="button"
          @click.prevent="getStrokes()"
          class="
            py-3
            px-3
            w-[80px]
            rounded-lg
            border-2
          "
          style="background:#FFFFFF"
        >
          save
        </button>
      </div>
    </div>

    <!-- 上傳簽名檔 -->
    <div class="output" v-show="!isSignSelf">
      <div
        v-if="isFile"
        style="width: 600px; height: 400px"
        class="bg-white round"
      >
        <img :src="image" style="border-radius: 26px" />
      </div>
      <div v-else style="width: 600px; height: 400px" class="bg-white round">
        <label
          for="file-upload"
          class="custom-file-upload w-full flex items-center justify-center"
        >
          <span>請選擇檔案</span>
        </label>
        <input
          type="file"
          @change="setWatermarkImage($event)"
          accept="image/*"
          id="file-upload"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueDrawingCanvas from "vue-drawing-canvas";
import bus from "../srcipt/bus";
import {uploadImage} from "../srcipt/api/uploadImage"
export default {
  name: "CanvasModule",
  components: {
    VueDrawingCanvas,
  },
  props: {
    isSignSelf: {
      type: Boolean,
      default: false,
    },
  },
  emits:['page-loading'],
  data() {
    return {
      initialImage: [
        {
          type: "dash",
          from: {
            x: 262,
            y: 154,
          },
          coordinates: [],
          color: "#000000",
          width: 5,
          fill: false,
        },
      ],
      x: 0,
      y: 0,
      image: "",
      eraser: false, //將畫筆更改為擦布
      disabled: false,
      fillShape: false,
      line: 5,
      color: "#000000",
      strokeType: "dash",  // 筆畫類型
      lineCap: "square",   //繪製線的端點形狀
      lineJoin: "round",   // 兩條線交界的形狀
      backgroundColor: "transparent", 
      backgroundImage: null,
      watermark: null,
      additionalImages: [],
      isFile: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initialImage = [
        {
          type: "dash",
          from: {
            x: 262,
            y: 154,
          },
          coordinates: [],
          color: "#000000",
          width: 5,
          fill: false,
        },
      ];
    },
    async setImage(event) {
      let URL = window.URL;
      console.log(event.target.files[0]);
      this.backgroundImage = URL.createObjectURL(event.target.files[0]);
      await this.$refs.VueCanvasDrawing.redraw();
    },
    async setWatermarkImage(event) {
      let URL = window.URL;
      this.watermark = {
        type: "Image",
        source: URL.createObjectURL(event.target.files[0]),
        x: 0,
        y: 0,
        imageStyle: {
          width: 600,
          height: 400,
        },
      };
      await this.$refs.VueCanvasDrawing.redraw();
      this.isFile = true;
    },
    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },
    getStrokes() { // 儲存簽名檔
      // dataURL轉成blob格式
      const getimage = this.dataURItoBlob(this.image);
      const fromData = new FormData();
      fromData.append('image',getimage,'image'+ Math.round(Math.random()*1000));

      // 上傳檔案
      uploadImage(fromData)
      .then((res)=>{
        bus.emit('page-loading',true);
        if(res.data.status == true){
          // alert(res.data.data)
          this.$emit("sign")
          bus.emit('page-loading',false);
        }
      })
      .catch((err)=>{
        alert(err.message);
        bus.emit('page-loading',false);
      })
    },
    removeSavedStrokes() {
      this.$refs.VueCanvasDrawing.reset();
    },
    getColor(color) {
      this.color = color;
    },
    dataURItoBlob(dataURI) {
    console.log(dataURI);
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:'image/png'});
  }
  },
};
</script>

<style lang="scss" scoped>
.signTitle{
  font-size: 19px;
  color:#8C5D19;
  font-weight: 700;
}
.button-container > * {
  margin-top: 15px;
  margin-right: 10px;
}
.output input[type="file"] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.round {
  border-radius: 26px;
}
label {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  font-family: sans-serif;
  cursor: pointer;
  /* display: inline-block; */
  overflow: hidden;
  color: #b7b7b7;
  background: none;
}
</style>