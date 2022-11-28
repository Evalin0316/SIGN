<template>
   <div class='container_pdf w-screen h-screen relative overflow-x-hidden'>
    <div class="downloadBtn cursor-pointer">完成</div>
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
  </div>
</template>

<script>
/* eslint-disable */
import { onMounted, ref, reactive } from 'vue';
// import WarningAlert from '@/components/modules/warningAlert_pdf.vue'
import bus from '../srcipt/bus';
import jsPDF from "jspdf";
import SelectSign from '../components/ChoiceSign.vue';
var canvas = null
export default {
  name: 'pdfShow',
  components: {
    // WarningAlert,
    SelectSign
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
    onMounted(() => {
      if (localStorage.getItem('vue-canvas')) {
        signUrl.value = localStorage.getItem('vue-canvas')
      }
    })
    const pdfInit = (file) => {
      const Base64Prefix = 'data:application/pdf;base64,'
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js'
      const readBlob = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result))
          reader.addEventListener('error', reject)
          reader.readAsDataURL(blob)
        })
      }
      const printPDF = async(pdfData, index) => {
        pdfData = await readBlob(pdfData)
        localStorage.setItem("pdfData", JSON.stringify(pdfData))
        const data = atob(pdfData.substring(Base64Prefix.length))
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise
        const pdfPage = await pdfDoc.getPage(index ?? 1)
        pageCount.value = pdfDoc.numPages
        // const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })
        const viewport = pdfPage.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // 控制顯示PDF的寬高
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
        const scale = 1
        return new fabric.Image(pdfData, {
          scaleX: scale,
          scaleY: scale
        })
      }
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
      const today = day.getFullYear() + '/' + day.getMonth() + '/' + day.getDate();

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

          // Swal.fire({
          //   input: 'textarea',
          //   inputAttributes: {
          //     autocapitalize: 'off'
          //   },
          //   focusConfirm: false,
          //   showCancelButton: true,
          //   confirmButtonText: '確定',
          //   cancelButtonText: '取消',
          //   customClass: {
          //     popup: 'customClass-popup rounded-3xl py-6 w-auto px-5',
          //     title: 'customClass-title font-bold text-black pt-6 px-0',
          //     input: 'customClass-input',
          //     inputLabel: '',
          //     actions: 'btns',
          //     confirmButton: 'btn btn-confirm',
          //     cancelButton: 'btn btn-cancel',
          //   }
          // }).then((result) => {
          //     // const canvas = new fabric.Canvas('canvas')
          //     var text = new fabric.Text(result.value, (image) => {
          //       image.top = 10
          //       image.left = 10
          //       image.scaleX = 0.5
          //       image.scaleY = 0.5
          //     })
          //     canvas.add(text)
          // })
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
        const image = canvas.toDataURL("image/png")
        // 設定背景在 PDF 中的位置及大小
        const width = pdf.internal.pageSize.width;
        const height = pdf.internal.pageSize.height
        pdf.addImage(image, "png", 0, 0, width, height)
        // 將檔案取名並下載
        pdf.save("download.pdf")
      }
      const finish = async() => {
        await download()
      }

      document.querySelector('.downloadBtn').addEventListener('click', () => {
        console.log('1')
        finish()
      })
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
      pageNumPending
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
