<template>
  <div>
    <Header @nextStep="nextStep" @prevPage="prevPage" @saveDraft="saveDraft"></Header>
    <div class="container_sign">
      <div class="flex justify-center pt-10 pb-10">
        <ProgressLine :arrStatus="arrStatus" />
      </div>
      <div :class="nextPage == '' ? '' : 'hidden'" class="flex justify-center">
        <div
          class="upload_content rounded-md flex items-center justify-center my-4 flex flex-col"
          @drop="ondrop"
          @dragleave="dragleave"
          @dragover="ondragover"
        >
          <div
            class="border rounded-md border-dashed flex justify-center items-center flex-col"
            :class="status == 0 ? 'upload_inneer1' : 'upload_inneer2'"
          >
            {{ status == 1 ? filename : "" }}
            <label v-if="status == 0" class="mb-2 upload mt-1">
              <input
                class="form-control hidden"
                type="file"
                ref="fileElement"
                accept="application/pdf"
                @change="uploadFile()"
              />
            </label>
            <label v-if="status == 1" class="mb-2 reupload mt-1">
              <input
                class="form-control hidden"
                ref="fileElement"
                type="file"
                accept="application/pdf"
                @change="uploadFile()"
              />
            </label>
            <div v-if="status == 0">
                  <div class="mb-2 font-bold">
                  或直接拖放檔案進來
                </div>
                <div class="font-bold">檔案限制格式：pdf，大小200mb以下</div>
            </div>
          </div>
          <div
            v-if="step == 2 && status == 1"
            :class="nextPage == '' ? '' : 'hidden'"
            class="mt-8 upload_inneer2 border rounded-md border-dashed flex justify-center items-center flex-col"
          >
            <p class="text-left file_title">文件命名</p>
            <input type="text" class="file_name bg-white file_name_input" v-model="signfileName"/>
          </div>
        </div>
      </div>
      <div :class="nextPage == '' ? 'hidden' : ''">
        <FileReview :fileName="filename"/>
      </div>
        <SaveConfirm 
        :showConfirmModal="showConfirmModal"
        @hideConfirmModal="hideConfirmModal"
        />
    </div>
  </div>
</template>

<script>
import bus from "../srcipt/bus";
import FileReview from "../page/FileReview.vue";
import ProgressLine from "../components/progress.vue";
import pdfview from '../components/pdfview.vue';
import jsPDF from "jspdf";
import Header from '../components/Header.vue';
import SaveConfirm from '../components/SaveConfirm.vue'
import { onMounted, ref, reactive, onUpdated, watchEffect ,inject, onBeforeMount,onUnmounted } from 'vue';
import { getFileDetail } from '../srcipt/api';
var canvas = null
export default {
  name:'fileUpload',
  components: {
    FileReview,
    ProgressLine,
    pdfview,
    Header,
    SaveConfirm
  },
  emits:['page-loading'],
  setup(props, ctx){
    const filename = ref(''); // 上傳檔案名稱
    const status = ref('');
    const nextPage = ref('');
    const arrStatus = ref([1, 2, 2]);
    const step = ref(1)
    const pageCount = ref(1)
    const fileExist = ref(false)
    const showConfirmModal = ref(false)
    const fileElement = ref(null)
    const signfileName = ref(''); //文件名稱
    const getData = ref('')
    // const emitter = inject('emitter')

    bus.on('fileName_id',(id)=>{
      getFileDetail(id)
      .then((res)=>{
        if(res.data.status == true){
              filename.value = res.data.data.fileName;
              signfileName.value = res.data.data.signTitle;
              console.log('test......',filename.value)
              if(filename.value !== ''){
                status.value = 1;
                step.value = 2;
              }
            }
        }).catch((err)=>{
            alert(err.message);
        })
      })


    const uploadFile = (data) => {
        status.value = fileElement.value.files.length || data.length; // 手動上傳 || 拖拉 
        var filedata;
        if (status.value == 1) {
            if(data){ // 拖拉檔案
                filename.value = data[0].name;
                signfileName.value = data[0].name;
                filedata = data[0];
                bus.emit('fileUplaod',data[0]);
                bus.emit('fileName',filename.value);
                // bus.emit('signTitle',signfileName.value);
            } else { // 手動上傳檔案
                filename.value = fileElement.value.files[0].name;
                signfileName.value = fileElement.value.files[0].name;
                filedata = fileElement.value.files[0];
                console.log(filedata.size);
                  if (filedata.size >= 2000000) { // 超過2mb不可上傳
                    alert("不可超過2mb");
                    return;
                  }
                console.log(filename.value);
                bus.emit("fileUpload", fileElement.value.files[0]);
                bus.emit('fileName', filename.value);
                // bus.emit('signTitle',signfileName.value);
            }
        pdfInit(filedata);
        fileExist.value = true;
        step.value = 2;
      } else {
        step.value = 1;
        fileExist.value = true;
      }
    }

    watchEffect(()=>{
        bus.emit('signTitle',signfileName.value);
    })

    const pdfInit = (file) =>{
      const Base64Prefix = 'data:application/pdf;base64,'
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js'

      //使用原生 FileReader 轉檔
      const readBlob = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result))
          reader.addEventListener('error', reject)
          reader.readAsDataURL(blob)
        })
      }

      const printPDF = async(pdfData, index) => {
        // 將檔案處理成base64
        pdfData = await readBlob(pdfData)
        localStorage.setItem("pdfData", JSON.stringify(pdfData))
        // 將base64中的前綴刪去，並進行解碼
        const data = atob(pdfData.substring(Base64Prefix.length))
        // 利用解碼的檔案，載入 PDF檔及第一頁
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise
        const pdfPage = await pdfDoc.getPage(index ?? 1)
        pageCount.value = pdfDoc.numPages
        // const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })
        // 設定尺寸及產生 canvas
        const viewport = pdfPage.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // 設定 PDF 所要顯示的寬高及渲染
        canvas.height = viewport.height
        canvas.width = viewport.width
        const renderContext = {
          canvasContext: context,
          viewport
        }
        const renderTask = pdfPage.render(renderContext)
        // 回傳做好的canvas
        return renderTask.promise.then(() => canvas)
      }

      const pdfToImage = async(pdfData) => {
        // 設定PDF轉為圖片時的比例
        const scale = 1
        // 回傳圖片
        return new fabric.Image(pdfData, {
          scaleX: scale,
          scaleY: scale
        })
      }

      // 此處canvas套用 fabric.js
      canvas = new fabric.Canvas('canvas')
      const Init = async (index) => {
        canvas.requestRenderAll()
        const pdfData = await printPDF(file, index)
        const pdfImage = await pdfToImage(pdfData)
        // 調整canvas大小
        // canvas.setWidth(pdfImage.width / window.devicePixelRatio)
        // canvas.setHeight(pdfImage.height / window.devicePixelRatio)
        canvas.setWidth(pdfImage.width)
        canvas.setHeight(pdfImage.height)
        // 將PDF畫面設定為背景
        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas))
      }

      Init(1)
      const queueRenderPage = (num) => {
        if (pageRendering.value) {
          pageNumPending.value = num
          console.log(num)
        } else {
          renderPage(num)
        }
      }

      const renderPage = async(num) => {
        console.log(num)
        pageRendering.value = true
        const data = atob(JSON.parse(localStorage.getItem('pdfData')).substring(Base64Prefix.length))
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise
        pdfDoc.getPage(num.value).then((page) => {
          var viewport = page.getViewport({scale: scale})
          canvas.height = viewport.height
          canvas.width = viewport.width
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          var renderTask = page.render(renderContext)
          renderTask.promise.then(() =>{
            pageRendering.value = false
            if (pageNumPending.value !== null) {
              reRender(pageNumPending.value)
              pageNumPending.value = null
            }
          })
        })
      }
    }

    const nextStep = () => {
      if(window.localStorage.getItem('pdfData') && fileExist.value && nextPage.value == ''){
        nextPage.value = 1;
        arrStatus.value = [0,1,2]; //步驟二
        bus.emit('fileReview',true);
      } else if(window.localStorage.getItem('pdfData') && fileExist.value && nextPage.value == 1){
        showConfirmModal.value = true;
      } else{
        alert('請先上傳檔案')
      }
    }

    const prevPage = () =>{
      console.log('上一頁')
      arrStatus.value = [1,2,2];
      nextPage.value = "";
      showConfirmModal.value = false;
      localStorage.setItem("pdfData", '')
      status.value = 0;
      filename.value = '';
      bus.emit('fileReview', false);
    }

    const dragleave = (e) => {  // 拖出
      e.preventDefault(); //阻止離開時的瀏覽器預設行為
    }

    const ondragover = (e) => { // 正在拖
      e.preventDefault();
    }

    const ondrop = (e) =>{ // 拖曳結束
      e.preventDefault(); //阻止拖放後的瀏覽器預設行為
      const data = e.dataTransfer.files; // 取得檔案
      if (data.length < 1) {
        return; // 檢查檔案是否有拖曳進來
      }
      if (data.size >= 2000000) {
        // 超過2mb不可上傳
        alert("不可超過2mb");
        return;
      }
      uploadFile(data);
    //   const formData = new FormData(); // 建立一個 newForm
    //   for (var i = 0; e.dataTransfer.files.length - 1; i++) {
    //     // console.log(e.dataTransfer.files.length);
    //     if (e.dataTransfer.files[i].name.indexOf("pdf") === -1) {
    //       // 檢查是否上傳的檔案不符合格式
    //       alert("請上傳pdf檔案");
    //       return;
    //     }
    //     formData.append(
    //       "uploadFile",
    //       e.dataTransfer.files[i],
    //       e.dataTransfer.files[i].name
    //     );
    //   }
    }

    const hideConfirmModal = () => {
      showConfirmModal.value = false;
    }
    
    const saveDraft = () => {
      bus.emit("saveDocument",'draft');
    }

    onMounted(()=>{
      // status.value = '';
      bus.emit('page-loading',false);
      bus.emit('headerStatus','fileUpload');

      // setTimeout(()=>{
      //   console.log('mounted',filename.value)
      //   if(filename.value !== ''){
      //       status.value = 1;
      //   }
      // },1000)

    })

    return{
      uploadFile,
      pdfInit,
      nextStep,
      prevPage,
      dragleave,
      ondragover,
      ondrop,
      filename,
      status,
      nextPage,
      arrStatus,
      step,
      pageCount,
      fileExist,
      showConfirmModal,
      fileElement,
      hideConfirmModal,
      signfileName,
      getData,
      saveDraft,
    }
  }
}
</script>

<style scoped lang="scss">
$main_color: #be8e55;
.upload {
  background-image: url("../assets/images/Option.png");
  height: 40px;
  width: 100px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.reupload {
  background-image: url("../assets/images/reupload.png");
  height: 40px;
  width: 100px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.file_name_input {
    color: $main_color;
    padding: 5px 10px;
}
</style>
