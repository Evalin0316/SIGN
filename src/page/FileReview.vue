<template>
  <div class='container_pdf  h-screen relative overflow-x-hidden'>
    <div class="styledCreate__WrapperRight-sc-1i4fuzv-10 cKAFxH">
      <div id="viewer" tabindex="10" scale="1" class="styled__Wrapper-sc-cpx59f-1 gKmbon overflow-x-hidden">
        <div class="react-pdf__Document">
          <div id="pageContainer1" class="styled__WrapperPage-sc-cpx59f-2 cFGXRm page">
            <div class="react-pdf__Page" data-page-number="1" style="position: relative;">
              <canvas id="canvas" class="react-pdf__Page__canvas block select-none"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="file" class="form-control hidden pdf_upload" ref="upload-file"/>
  <!-- 新增文字modal -->
  <add-text 
    :showModal="showText"
    @hideTextModal="showText = false"
    @saveText="inputText"
  ></add-text>
  <!-- 新增簽名modal -->
  <SelectSign
  :showSignModal="showSignModal"
  @closeWarning="showSignModal = false" 
  @selectedSign="selectedSign" />
<!-- 新增簽名modal -->
  <AlertMessage 
  :show-alert="isshowAlert"
  :text-content="alertText"
  :uploadStatus="uploadStatus"
  />
  </div>
</template>

<script>
/* eslint-disable */
import { onMounted, ref, reactive, onBeforeUnmount, onUnmounted } from 'vue';
import { fabric } from 'fabric';
import bus from '../srcipt/bus';
import jsPDF from "jspdf";
import SelectSign from '../components/ChoiceSign.vue';
import AddText from '../components/AddText.vue';
import AlertMessage from '../components/AlertMessage.vue';
import {uploadFile,uploadSignInfo,uploadFileInfo} from '../srcipt/api/uploadFile';
import { useRouter } from 'vue-router';
var canvas = null
export default {
  name: 'pdfShow',
  components: {
    SelectSign,
    AddText,
    AlertMessage
  },
  setup (props, ctx) {
    // const pageNum = ref(1)
    // const pageCount = ref(1)
  
    // 取得新的檔案轉畫布
    bus.on('fileUpload', (v) => {
      pdfInit(v)
    })

    // 編輯檔案(取得既有檔案)轉畫布
    const getFile = ref('');
    bus.on('usedFile',(v)=>{
      getFile.value = v;
      if(getFile.value !==''){
        pdfInit(v);
      }
    })

    
    /*
     * 完成簽署 or 儲存草稿
    */
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';
    canvas = new fabric.Canvas('canvas');
    const isFileChange = ref(false);
    const getFileName = ref('');
    const getsignTitle = ref('');
    const isFileNameChange = ref(false);
    const getFileId = ref('');
    const isshowAlert = ref(false);
    const uploadStatus = ref(false);
    const router = useRouter();
    const alertText = ref('');

    bus.on('fileName',(v)=>{ // 取得檔名
      getFileName.value = v;
    })


    bus.on('signTitle',(v)=>{ // 取得文件命名
      getsignTitle.value = v;
    })

    bus.on('isFileChange', (v)=>{ //取得檔案更新狀態
        isFileChange.value = v;
    });


    bus.on('isFileNameChange', (v)=>{ //取得檔名更新狀態
        isFileNameChange.value = v;
    });


    bus.on('fileId',(v)=>{ //取得檔案ID
      getFileId.value = v;
    });

    // 回首頁
    const goHomePage = function(){
      return new Promise(function(resolve,reject){
      setTimeout(()=>{
      resolve(router.push(`/`))
      },2000)
      })
    }

    /*--------save start----------*/
    bus.on('saveDocument',(sign_status)=>{
      const pdf = new jsPDF();
      const image = canvas.toDataURL("image/png")
        // 設定背景在 PDF 中的位置及大小
        const width = pdf.internal.pageSize.width;
        const height = pdf.internal.pageSize.height
        pdf.addImage(image, "png", 0, 0, width, height)

      const blobPDF = new Blob([pdf.output('blob')],{type: 'application/pdf'})
      const fromData = new FormData();
      fromData.append('file',blobPDF,getFileName.value);
      fromData.append('fileName',getFileName.value);

      bus.emit('page-loading',true);

    /*
     * 檔案更新項目 function
    */


    // 草搞-更新檔案
    const updateFileInfo = () => {
      uploadFileInfo(getFileId.value,fromData).then((res)=>{
              if(res.data.status){
                bus.emit('page-loading',false);
                isshowAlert.value = true;
                alertText.value = res.data.data;
                uploadStatus.value = true;
                goHomePage()
              }
          }).catch((err)=>{
            alertText.value = err.message
            uploadStatus.value = false;
          })
    }

    // 草稿-更新檔名
    const updateSignInfo = (updateStatus) => { 
        let signData = {
          title: getsignTitle.value,
        }

        if(sign_status == 'complete') {
          signData.isSigned = true;
        }

      // 檔名有更新時
      uploadSignInfo(getFileId.value,signData).then((res)=>{ 
              if(res.data.status == true) {
                if(updateStatus){ // 判斷是否回到首頁
                  bus.emit('page-loading',false);
                  isshowAlert.value = true;
                  alertText.value = res.data.data;
                  goHomePage()
                }
                uploadStatus.value = true;
              }
            }).catch((err)=>{
            alertText.value = err.message
            uploadStatus.value = false;
          })
    }


    /*
     * 判斷更新內容
    */

    // 判斷檔案更新狀態
    if(getFileId.value == ''){ // 初次上傳檔案
      uploadFile(fromData)
        .then((res) => {
          if (res.data.status == true) {
            let fileId = res.data.data.id;
            let signData = {
              title: getsignTitle.value,
              }
            if(sign_status == 'complete') {
              signData.isSigned = true; // 預設為 fasle
            }
            
            uploadSignInfo(fileId,signData).then((res)=>{ // 更新檔名
              isshowAlert.value = true;
              if(res.data.status == true) {
                bus.emit('page-loading',false);
                alertText.value = res.data.data;
                uploadStatus.value = true;
                goHomePage()
              }
            }).catch((err) => {
              bus.emit('page-loading',false);
              isshowAlert.value = true;
              alertText.value = err.message;
              uploadStatus.value = false;
              });
          }
        })
        .catch((err) => {
          bus.emit('page-loading',false);
          isshowAlert.value = true;
          alertText.value = err.message
          uploadStatus.value = false;
        });
      }else if(isFileNameChange.value && sign_status !== 'complete' && !isFileChange.value){ // 更新檔名
          updateSignInfo(true);
      }else if(isFileChange.value && sign_status !== 'complete' && !isFileNameChange.value){ // 更新檔案
          updateFileInfo();
      }else if(isFileChange.value && isFileNameChange.value && sign_status !== 'complete'){ // 更新檔案&檔名
          updateSignInfo(false);
          updateFileInfo();
      }else if(sign_status == 'complete'){
          updateSignInfo(false);
          updateFileInfo();
      }

    })

    /*--------save end----------*/

    const showSignModal = ref(false);
    const showText = ref(false)

    const pdfInit = (file) => {
      const Base64Prefix = 'data:application/pdf;base64,'
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs'
      // 使用原生 FileReader 轉檔
      const readBlob = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result))
          reader.addEventListener('error', reject)
          reader.readAsDataURL(blob)
        })
      }
      const printPDF = async(pdfData, index) => {
        let data = '';
        // 將檔案處理成 base64
        pdfData = await readBlob(pdfData)
        // 將base64 中的前綴刪除，並進行解碼
        data = atob(pdfData.substring(Base64Prefix.length))
        // 利用解碼的檔案，載入PDF檔及第一頁
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise
        const pdfPage = await pdfDoc.getPage(index ?? 1)
        // pageCount.value = pdfDoc.numPages
        const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })

        // 設定尺寸及產生canvas
        // const viewport = pdfPage.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // 設定PDF 所要顯示的寬高及渲染
        canvas.height = viewport.height
        canvas.width = viewport.width
        const renderContext = {
          canvasContext: context,
          viewport
        }
        const renderTask = pdfPage.render(renderContext)
        // 回傳做好的PAF canvas
        return renderTask.promise.then(() => canvas)
      }
      const pdfToImage = async(pdfData) => {

        // 設定 PDF 轉為圖片時的比例
        const scale = 1 / window.devicePixelRatio;
        return new fabric.Image(pdfData, {
          id: "renderPDF",
          scaleX: scale,
          scaleY: scale
        })
      }
      // 此處 canvas 套用 fabric.js
      canvas = new fabric.Canvas('canvas')
      const Init = async (index) => {
        canvas.requestRenderAll()
        const pdfData = await printPDF(file, index)
        const pdfImage = await pdfToImage(pdfData)
        // 透過比例設定canvas 尺寸
        canvas.setWidth(pdfImage.width / window.devicePixelRatio)
        canvas.setHeight(pdfImage.height / window.devicePixelRatio)
        // canvas.setWidth(pdfImage.width)
        // canvas.setHeight(pdfImage.height)

        // 將 PDF 畫面設定為背景
        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas))
      }
      Init(1);

      /*------------加入簽名-------------*/
      const sign = document.querySelector('.signBtn')
      sign.addEventListener('click', () => {
      bus.emit('addCanvas',canvas);
      showSignModal.value = true;
      })

      /*------------加入日期-------------*/
      const dateBtn = document.querySelector('.dateBtn')
      let day = new Date();
      const today = day.getFullYear() + '/' + (day.getMonth() +1) + '/' + day.getDate();

      dateBtn.addEventListener('click', () => {
        var text = new fabric.Text(today, (image) => {
          image.top = 10
          image.left = 10
          image.scaleX = 0.5
          image.scaleY = 0.5
        })
        canvas.add(text)
      })

      /*------------開啟新增文字dialog-------------*/
      const textBtn = document.querySelector('.textBtn')
      textBtn.addEventListener('click', () => {
          showText.value = true;
      })

    }

    // 新增文字
    bus.on('saveText', (v) => {
          var addText = new fabric.Text(v, (image) => {
          image.top = 10
          image.left = 10
          image.scaleX = 0.5
          image.scaleY = 0.5
        })
        canvas.add(addText);
    })

    const selectedSign = (selectedSign) => { // 選擇簽名
      fabric.Image.fromURL(selectedSign, (image) => {
        image.top = 100
        image.left = 100
        image.scaleX = 0.5
        image.scaleY = 0.5
        canvas.add(image)
      })
    }

    onUnmounted(()=>{
      bus.off('saveDocument');
      bus.off('usedFile');
      // bus.off('fileUpload');
      bus.off('fileName');
      bus.off('signTitle');
      bus.off('saveText');
    })

    return {
      pdfInit,
      selectedSign,
      // pageNum,
      // pageCount,
      showText,
      getsignTitle,
      getFile,
      isFileNameChange,
      getFileId,
      showSignModal,
      isFileChange,
      isshowAlert,
      alertText,
      uploadStatus
    }
  }
}
</script>
<style lang="scss" scoped>
.container_pdf {
  .react-pdf__Document {
    transform-origin: center top;
    transform: translate3d(0px, 0px, 0px) scale3d(0.883261, 0.883261, 1);
    height: calc(88.3261%);

    overflow:auto;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: #DEC7AA;
      border: 1px solid #DEC7AA;
    }

    &::-webkit-scrollbar-track {
      box-shadow: transparent;
      background:#EFE3D4;
    }
    
  }
  .cKAFxH {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    // width: 100%;
    height: calc(100% - 70px);
    // overflow-y: hidden;
    padding: 48px 100px;
    @media (max-width: 1440px) {
      // padding: 100px 1rem;
      height: calc(100% - 10px);
    }
    @media (max-width: 768px) {
      padding: 100px 0.5rem;
      height: calc(100% - 10px);
    }
  }
  .gKmbon {
      width: 100%;
      height: 100%;
      overflow: auto;
      margin-top: -10px;
      margin-bottom: -10px;
      display: flex;
      flex-direction: column;
      -webkit-box-align: center;
      align-items: center;
  }
  .gKmbon .react-pdf__Document {
      transform-origin: center top;
      transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
      height: calc(100%);
  }
  .cFGXRm {
      position: relative;
      width: 30vw;
      @media (max-width: 1200px) {
        width: 50vw;
      }
      @media (max-width: 540px) {
        width: 90vw;
      }
      min-height: 80vh;
      margin: 0px auto 20px;
  }
  .react-pdf__Page {
    width: 100%;
  }
  .gKmbon canvas {
    height: auto !important;
    width: 100% !important;
    object-fit: cover;
  }
}
.canvas-container {
  width: 100% !important;
}
</style>
