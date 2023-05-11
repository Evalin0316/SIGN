<template>
  <div class='container_pdf w-screen h-screen relative overflow-x-hidden'>
    <div class="styledCreate__WrapperRight-sc-1i4fuzv-10 cKAFxH">
      <div id="viewer" tabindex="10" scale="1" class="styled__Wrapper-sc-cpx59f-1 gKmbon overflow-x-hidden">
        <div class="react-pdf__Document">
          <div id="pageContainer1" class="styled__WrapperPage-sc-cpx59f-2 cFGXRm page" width="1101.6000000000001" height="1425.6000000000001" style="">
            <div class="react-pdf__Page" data-page-number="1" style="position: relative;">
              <canvas id="canvas" class="react-pdf__Page__canvas block select-none" :style="`width: ${width}% !important`"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="file" class="form-control hidden pdf_upload" ref="upload-file"/>
  </div>
  <!-- 新增文字modal -->
  <add-text 
    :showModal="showText"
    @hideTextModal="hideModal"
    @saveText="inputText"
  ></add-text>
  <!-- 新增簽名modal -->
  <SelectSign
  :showSignModal="showSignModal"
  @closeWarning="closeWarning" 
  @selectedSign="selectedSign" />
</template>

<script>
/* eslint-disable */
import { onMounted, ref, reactive, onBeforeUnmount, onUnmounted } from 'vue';
import bus from '../srcipt/bus';
import jsPDF from "jspdf";
import SelectSign from '../components/ChoiceSign.vue';
import AddText from '../components/AddText.vue';
import {uploadFile,uploadSignInfo,uploadFileInfo} from '../srcipt/api';
import { useRouter } from 'vue-router';
var canvas = null
export default {
  name: 'pdfShow',
  components: {
    SelectSign,
    AddText
  },
  setup (props, ctx) {
    const signUrl = ref('')
    const isSelectSign = ref(false)
    const pageNum = ref(1)
    const pageCount = ref(1)
    const width = ref(100)
    const pageNumPending = ref(null)
    const pageRendering = ref(false)
    const showText = ref(false)
    const getText = ref('')
    const getFileName = ref('');
    const getsignTitle = ref('');
    const router = useRouter();
    const getFile = ref('')
    const isFileNameChange = ref(false);
    const getFileId = ref('');
    const showSignModal = ref(false);
    const isFileChange = ref(false);
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js'
    canvas = new fabric.Canvas('canvas')
    
    bus.on('fileUpload', (v) => {
      pdfInit(v)
    })

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

    bus.on('fileName',(v)=>{
      getFileName.value = v;
    })

    bus.on('signTitle',(v)=>{
      getsignTitle.value = v;
    })

    bus.on('usedFile',(v)=>{
      getFile.value = v;
      if(getFile.value !==''){
        pdfInit(v);
      }
    })

    bus.on('isFileNameChange', (v)=>{
        console.log('uploadFile....',v);
        isFileNameChange.value = v;
    });

    bus.on('isFileChange', (v)=>{
        console.log('isFileChange.....',v)
        isFileChange.value = v;
    });

    bus.on('fileId',(v)=>{
      getFileId.value = v;
    });
    

    // 完成簽署 or 儲存草稿
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



    // 草搞-更新檔案
    const updateFileInfo = () => {
      uploadFileInfo(getFileId.value,fromData).then((res)=>{
              if(res.data.status){
                alert(res.data.data);
                bus.emit('page-loading',false);
                router.push(`/week2-F2E/`);
              }
          }).catch((err)=>{
            alert(err.message)
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
                if(updateStatus){
                  bus.emit('page-loading',false);
                  router.push(`/week2-F2E/`);
                  alert(res.data.data);
                }
              }
            }).catch((err)=>{
            alert(err.message)
          })
    }

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
              signData.isSigned = true;
            }
            
            uploadSignInfo(fileId,signData).then((res)=>{ // 更新檔名
              if(res.data.status == true) {
                router.push(`/week2-F2E/`);
                bus.emit('page-loading',false);
              }
            })
          }
        })
        .catch((err) => {
          alert(err.message)
          bus.emit('page-loading',false);
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

    onUnmounted(()=>{
      bus.off('saveDocument');
      bus.off('usedFile');
      // bus.off('fileUpload');
      bus.off('fileName');
      bus.off('signTitle');
      bus.off('saveText');
    })
    const pdfInit = (file) => {
      const Base64Prefix = 'data:application/pdf;base64,'
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js'
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
        const scale = 1
        return new fabric.Image(pdfData, {
          id: "renderPDF",
          scaleX: scale,
          scaleY: scale
        })
      }
      // 此處 canvas 套用 fabric.js
      canvas = new fabric.Canvas('canvas')
      console.log(canvas);
      const Init = async (index) => {
        canvas.requestRenderAll()
        const pdfData = await printPDF(file, index)
        const pdfImage = await pdfToImage(pdfData)
        // 透過比例設定canvas 尺寸
        // canvas.setWidth(pdfImage.width / window.devicePixelRatio)
        // canvas.setHeight(pdfImage.height / window.devicePixelRatio)
        canvas.setWidth(pdfImage.width)
        canvas.setHeight(pdfImage.height)

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

      /*------------加入文字-------------*/
      const textBtn = document.querySelector('.textBtn')
      textBtn.addEventListener('click', () => {
          showText.value = true;
      })

    }

    const closeWarning = (closeWarning) => {
      isSelectSign.value = closeWarning
      showSignModal.value = false;
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

    const hideModal = () => {
        showText.value = false;
    }

    return {
      pdfInit,
      closeWarning,
      selectedSign,
      signUrl,
      isSelectSign,
      pageNum,
      pageCount,
      width,
      pageRendering,
      pageNumPending,
      showText,
      hideModal,
      getText,
      getsignTitle,
      getFile,
      isFileNameChange,
      getFileId,
      showSignModal,
      isFileChange,
    }
  }
}
</script>
<style lang="scss">
.container_pdf {
  .react-pdf__Document {
    transform-origin: center top;
    transform: translate3d(0px, 0px, 0px) scale3d(0.883261, 0.883261, 1);
    height: calc(88.3261%);
  }
  .cKAFxH {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 70px);
    overflow-y: hidden;
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
      width: 90vw;
      @media (max-width: 1024px) {
        width: 95vw;
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
// canvas {
//   width: 100% !important;
// }
  .prePage-btn {
    width: 30px;
    height: 30px;
  }
  .nextPage-btn {
    width: 30px;
    height: 30px;
  }
.footer {
  box-shadow: 1px -1px 6px rgba(0, 0, 0, 0.11);
  @media (max-width: 1023px) {
    box-shadow: none;
    // padding-top: 90px;
  }
  .item {
    background: #FFFFFF;
    box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.11);
    border-radius: 16px;
    width: 200px;
  }
  .icon {
    width: 40px;
    height: 40px;
    background: #F0F0F0;
    border-radius: 9px;
    img {
      width: 19px;
      height: 19px;
    }
    p {
      color: #B7B7B7;
    }
  }
}
</style>
