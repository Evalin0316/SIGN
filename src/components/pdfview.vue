<template>
  <div id="mypdf">This is pdf view.</div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
// import pdf from '../../public/pdf/audit_trail.pdf';
import {PDFViewer} from 'pdfjs-dist/web/pdf_viewer';

export default {
  data() {
    return {
      imgUrl: "",
      nowComponent: "",
    };
  },
  components: {},
  methods: {
    getUrl() {
      var dataImage = localStorage.getItem("file");
      // bannerImg = document.getElementById('canvas');
      this.imgUrl = "data:image/png;base64," + dataImage;
    },
    async pdfInit() {
      // var url = this.pdf;
      var url = "/cdn.mozilla.net/pdfjs/helloworld.pdf";
      PDFJS.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";
      var loadingTask = await PDFJS.getDocument(url);
      loadingTask.promise.then(
        function (pdf) {
          console.log("pdf 載入中");
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log("page 載入完成");
            var scale = 1.5;
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById("mypdf");
            var cntext = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: cntext,
              viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            renderTask.then(function () {
              console.log("頁面已渲染");
            });
          });
        },
        function (reason) {
          console.error(reason);
        }
      );
    },
  },
  mounted() {
    // this.getUrl();
    // this.pdfInit();
  },
}
</script>

<style scope>
.top-bar {
  display: none !important;
}
.render-content canvas {
  @apply w-full;
}
</style>
