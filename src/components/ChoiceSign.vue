<template>
  <div class="draw_modal w-full left-0 top-0 fixed" v-if="showSignModal == true">
    <!-- 已有上傳簽名 -->
    <div class="card-inner absolute text-xl pop-container-choose w-full z-50" v-if="signArr.length > 0">
      <div class="relative mt-3" @click="closeWarning">
        <img class="absolute right-0 top-0 mr-4 mt-3 close_square" src="../assets/images/icon_Close_Square_n.png" />
      </div>
      <div class="bg rounded-3xl overflow-hidden shadow-lg w-full">
        <div class="px-4 py-6 flex flex-col justify-center w-full">
          <div class="font-bold text-lg mb-8 whitespace-nowrap text-center proj-text-primary">選擇簽名</div>
          <div class="selected-modal overflow-auto flex items-center justify-center flex-wrap">
            <div class="mb-2 flex justify-center" v-for="(item, idx) in signArr" :key="idx">
              <div class="h-auto bg-white w-4/5 rounded-3xl py-2" @click="selectedSign(item.url)">
                <img :src="item.url" class='sign mx-auto object-contain w-36 h-20' alt="" referrerpolicy="no-referrer"/>
              </div>
              <span @click="deleteImageBtn(item.id,item.hash,item.imageUrl)"><img class="mr-4 mt-2" src="../assets/images/icon_Close_Square_n.png" /></span>
            </div>
          </div>
          <label class="flex justify-center proj-text-primary block mt-4 font-bold text-lg whitespace-nowrap" @click="isSelectMode = false">
            <img src="../assets/images/icon_add_new_sign_n.svg"/>
            <a class="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</a>
          </label>
          <label class="flex justify-center mt-4">
            <img src="../assets/images/icon_add_new_img_n.svg"/>
            <a class="text-[#8C5D19] font-[700] text-[14px] ml-1">上傳簽名圖檔</a>
            <input
                class="form-control hidden"
                ref="fileElement"
                type="file"
                accept="image/*"
                @change="uploadImageBtn()"
              />
          </label>
        </div>
      </div>
    </div>
    <!-- 無簽名檔 -->
    <div class="card-inner absolute text-xl pop-container-choose w-full z-50" v-if="signArr.length == 0">
            <div class="relative mt-3" @click="closeWarning">
              <img class="absolute right-0 top-0 mr-4 mt-3 close_square" src="../assets/images/icon_Close_Square_n.png" />
            </div>
          <div class="bg rounded-3xl overflow-hidden shadow-lg w-full">
            <div class="px-4 py-6 flex flex-col justify-center w-full">
              <div class="font-bold text-lg mb-8 whitespace-nowrap text-center">目前還沒有簽名喔~</div>
              <div class="text-sm">請創建新的簽名檔，可上傳圖片或線上簽名</div>
              <label class="flex justify-center proj-text-primary block mt-4 whitespace-nowrap bg-white rounded" @click="isSelectMode = false">
                <img src="../assets/images/icon_add_new_sign_n.svg"/>
                <a class="text-[#8C5D19] font-[700] text-[14px] ml-1">建立簽名</a>
            </label>
            <label class="flex justify-center mt-4 bg-white rounded">
              <img src="../assets/images/icon_add_new_img_n.svg"/>
              <a class="text-[#8C5D19] font-[700] text-[14px] ml-1">上傳簽名圖檔</a>
                <input
                  class="form-control hidden"
                  ref="fileElement"
                  type="file"
                  accept="image/*"
                  @change="uploadImageBtn()"
                />
            </label>
            </div>
          </div>
    </div>
    <!-- 簽名組件 -->
    <div class="card-inner absolute text-xl w-[500px] z-50 pop-container max-[768px]:w-[343px]" v-if="!isSelectMode">
        <div class="bg rounded-3xl overflow-hidden shadow-lg w-full">
          <div class="relative mt-3" @click="isSelectMode = true">
              <img class="absolute right-0 top-0 mr-4" src="../assets/images/icon_Close_Square_n.png" />
          </div>
          <div class="index_Sign flex flex-col items-center w-full py-4 px-2">
            <CanvasDraw :isSignSelf="isSignSelf" v-on:closeWarning="closeWarning" v-on:getStroke="getStroke" 
            @sign="getSign()"/>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import CanvasDraw from './CanvasDraw.vue'
import bus from '../srcipt/bus';
import { getImage , deleteImage , uploadImage } from '../srcipt/api/uploadImage';
export default {
  name: 'selectSign',
  components: {
    CanvasDraw
  },
  props:['showSignModal'],
  setup (props, ctx) {
    const signArr = ref([])
    const isSignSelf = ref(true)
    const getUrl = ref('')
    const getSignData = ref([]);
    
    onMounted(() => {
      init()
    })

    const init = () => {
      // 取得所有簽名檔
      getImage().then((res)=>{
        if(res.data.status == true){
          const allData = res.data.data;
          if(allData.length > 0){
            signArr.value = [];
            allData.forEach((e)=>{
            getBase64FromUrl(e.imageUrl,e._id,e.imageDeleteHash);
          })
          }else{
            signArr.value = [];
          }
        
        }
      }).catch((err)=>{
          alert(err.message);
      })
    }


    // 刪除圖片
    const deleteImageBtn = (id,hash,url) =>{
        // let sendData = {'hash':data,'imageUrl':url};
        let getUrl = url.split('/');
        let imageName = getUrl[3];
        deleteImage(id,hash,imageName).then((res)=>{
          if(res.data.status == true){
            alert(res.data.data);
            init();
          }
        }).catch((err)=>{
            alert(err.message);
        })
    }

    // 關閉dialog
    const closeWarning = () => {
      ctx.emit('closeWarning')
    }

    const getCanvas = ref('')
    bus.on('addCanvas',(v)=>{
      getCanvas.value = v;
    })

    const getStroke = ref('')
    const selectedSign = (url) => {
      getStroke.value = url;
      // bus.emit('addImage',getStroke.value);
      fabric.Image.fromURL(getStroke.value, (image) => {
          image.top = 100
          image.left = 100
          image.scaleX = 0.5
          image.scaleY = 0.5
          getCanvas.value.add(image)
        })
      closeWarning()
    }
    
    const signStatus = ref(null);
    const isSelectMode = ref(true);
    const getSign = () => { // 取得新增的圖檔
      // closeWarning();
      signStatus.value != null;
      isSelectMode.value = true;
      init();
    }

    const getBase64FromUrl = (imgUrl,id,hash) => {
    const image = new Image();
    image.crossOrigin='anonymous';
    image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL();
    getUrl.value = dataUrl;
    // 取得所有 sign 
    signArr.value.push({'id':id,'url':getUrl.value,'hash':String(hash),'imageUrl':String(imgUrl)});
    getSignData.value = [...signArr.value];

    // callback && callback(dataUrl)
    }
    image.src = imgUrl;
    }

    const fileElement = ref('');
    const uploadImageBtn = () => {
      let fromData = new FormData();
      fromData.append('image',fileElement.value.files[0]);
      if(fileElement.value.files[0].size > 0){
        uploadImage(fromData).then((res) => {
            if(res.data.status == true){
              alert(res.data.data)
              init()
            }
        }).catch((err)=>{
          alert(err.message)
      })
    }
  }

    return {
      // url,
      signArr,
      closeWarning,
      selectedSign,
      init,
      isSelectMode,
      isSignSelf,
      getStroke,
      signStatus,
      getSign,
      getCanvas,
      getUrl,
      getBase64FromUrl,
      deleteImageBtn,
      uploadImageBtn,
      fileElement,
      getSignData,
    }
  }
}
</script>
