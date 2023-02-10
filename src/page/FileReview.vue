<template>
<!-- 新增文字modal -->
  <add-text 
    :showModal="showText"
    @hideTextModal="hideModal"
    @saveText="inputText"
  ></add-text>
  <div class='container_pdf w-screen h-screen relative overflow-x-hidden'>
    <!-- <div class="downloadBtn cursor-pointer">完成</div> -->
    <!-- <SelectSign v-if="isSelectSign" @closeWarning="closeWarning" @selectedSign="selectedSign"  /> -->
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
</template>

<script>
/* eslint-disable */
import { onMounted, ref, reactive } from 'vue';
// import WarningAlert from '@/components/modules/warningAlert_pdf.vue'
import bus from '../srcipt/bus';
import jsPDF from "jspdf";
import SelectSign from '../components/ChoiceSign.vue';
import AddText from '../components/AddText.vue';
import {uploadFile} from '../srcipt/api';
var canvas = null
export default {
  name: 'pdfShow',
  components: {
    // WarningAlert,
    SelectSign,
    AddText
  },
  props: {
    fileName:{
        type:String,
        default:() => ''
    },
   },
  setup (props, ctx) {
    const signUrl = ref('')
    const isSelectSign = ref(false)
    const pageNum = ref(1)
    const pageCount = ref(1)
    const width = ref(100)
    const pageNumPending = ref(null)
    const pageRendering = ref(false)
    const Base64Prefix = 'data:application/pdf;base64,'
    const showText = ref(false)
    const getText = ref('')
    console.log(props.fileName);
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js'
    canvas = new fabric.Canvas('canvas')
    bus.on('fileUpload', (v) => {
      pdfInit(v)
    })
    bus.on('reloadSign', (v) => {
      if (localStorage.getItem('vue-canvas')) {
        signUrl.value = localStorage.getItem('vue-canvas')
      }
    })
    // 新增文字
    bus.on('saveText', (v) => {
        console.log('text',v);
          var addText = new fabric.Text(v, (image) => {
          image.top = 10
          image.left = 10
          image.scaleX = 0.5
          image.scaleY = 0.5
        })
        canvas.add(addText);
    })

    // 完成簽署
    bus.on('saveDocument',()=>{
      const pdf = new jsPDF();
      const image = canvas.toDataURL("image/png")
        // 設定背景在 PDF 中的位置及大小
        const width = pdf.internal.pageSize.width;
        const height = pdf.internal.pageSize.height
        pdf.addImage(image, "png", 0, 0, width, height)
        // 將檔案取名並下載
        pdf.save("download.pdf");

      const blobPDF = new Blob([pdf.output('blob')],{type: 'application/pdf'})
      console.log(blobPDF);
      const fromData = new FormData();
      fromData.append('file',blobPDF,props.fileName);
      console.log('fromData',fromData);

      uploadFile(fromData)
        .then((res) => {
          if (res.data.success) {
           alert(res);
          }
        })
        .catch((err) => {
          alert(err.message)
        });
    })

    onMounted(() => {
      if (localStorage.getItem('vue-canvas')) {
        signUrl.value = localStorage.getItem('vue-canvas')
      }
      console.log(props.fileName)
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
        // 將檔案處理成 base64
        pdfData = await readBlob(pdfData)
        localStorage.setItem("pdfData", JSON.stringify(pdfData))

        // 將base64 中的前綴刪除，並進行解碼
        const data = atob(pdfData.substring(Base64Prefix.length))

        // 利用解碼的檔案，載入PDF檔及第一頁
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise
        const pdfPage = await pdfDoc.getPage(index ?? 1)
        pageCount.value = pdfDoc.numPages
        // const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })

        // 設定尺寸及產生canvas
        const viewport = pdfPage.getViewport({ scale: 1 })
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
        // canvas.setWidth(pdfImage.width / window.devicePixelRatio)
        // canvas.setHeight(pdfImage.height / window.devicePixelRatio)
        canvas.setWidth(pdfImage.width)
        canvas.setHeight(pdfImage.height)

        // 將 PDF 畫面設定為背景
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
      // 加入簽名
      const sign = document.querySelector('.signBtn')
      if (localStorage.getItem('vue-canvas')) {
        signUrl.value = localStorage.getItem('vue-canvas')
      }
      sign.addEventListener('click', () => {
        if (!signUrl.value) return
        fabric.Image.fromURL(signUrl.value, (image) => {
          image.top = 100
          image.left = 100
          image.scaleX = 0.5
          image.scaleY = 0.5
          canvas.add(image)
        })
      })
      // 加入日期
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
      // 加入文字
      const textBtn = document.querySelector('.textBtn')
      textBtn.addEventListener('click', () => {
          showText.value = true;
      })

      // 前一頁
      const prePage = () => {
        if (pageNum.value <= 1) {
          return
        }
        pageNum.value--
        // queueRenderPage(pageNum)
        Init(pageNum.value)
      }
      // document.querySelector('.prePage-btn-top').addEventListener('click', prePage)
      // document.querySelector('.prePage-btn').addEventListener('click', prePage)
      // 下一頁
      const nextPage = () => {
        if (pageNum.value >= pageCount.value) {
          return
        }
        pageNum.value++
        // queueRenderPage(pageNum)
        Init(pageNum.value)
      }
      // document.querySelector('.nextPage-btn-top').addEventListener('click', nextPage)
      // document.querySelector('.nextPage-btn').addEventListener('click', nextPage)
      // 下載
      const pdf = new jsPDF()
      const download = () => {
        // 將 canvas 存為圖片
        const image = canvas.toDataURL("image/png");
        // 設定背景在 PDF 中的位置及大小
        const width = pdf.internal.pageSize.width;
        const height = pdf.internal.pageSize.height;
        pdf.addImage(image, "png", 0, 0, width, height)
        // 將檔案取名並下載
        pdf.save("download.pdf")
      }
      const finish = async() => {
        await download()
      }

      // document.querySelector('.downloadBtn').addEventListener('click', () => {
      //   console.log('1')
      //   finish()
      // })
    }
    const closeWarning = (closeWarning) => {
      isSelectSign.value = closeWarning
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
    const percentPlus = () => {
      if (width.value < 150) {
        width.value += 10
      }
    }
    const percentMinus = () => {
      if (width.value > 50) {
        width.value -= 10
      }
    }

    const hideModal = () =>{
        showText.value = false;
    }
    return {
      pdfInit,
      closeWarning,
      selectedSign,
      percentPlus,
      percentMinus,
      signUrl,
      isSelectSign,
      pageNum,
      pageCount,
      width,
      pageRendering,
      pageNumPending,
      showText,
      hideModal,
      getText
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
