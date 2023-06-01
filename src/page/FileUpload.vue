<template>
  <div>
    <Header @nextStep="nextStep" @prevPage="prevPage" @saveDraft="saveDraft"></Header>
    <div class="container_sign">
      <div class="flex justify-center pt-10 pb-10">
        <ProgressLine :arrStatus="arrStatus" />
      </div>
      <div :class="nextPage == '' ? '' : 'hidden'" class="flex justify-center">
        <div
          class="upload_content rounded-md flex items-center justify-center my-4 flex-col"
          @drop="ondrop"
          @dragleave="dragleave"
          @dragover="ondragover"
        >
          <div class="border rounded-md border-dashed flex justify-center items-center flex-col upload_inner">
            <div class="break-all">{{ status == 1 ? filename : "" }}</div>
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
            class="mt-8 upload_inner border rounded-md border-dashed flex justify-center items-center flex-col"
          >
            <p class="text-left file_title">文件命名</p>
            <input type="text" class="file_name bg-white file_name_input" v-model="signfileName"/>
          </div>
        </div>
      </div>
      <div :class="nextPage == '' ? 'hidden' : ''">
        <FileReview :fileName="filename" :fileElement="fileElement"/>
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
import jsPDF from "jspdf";
import Header from '../components/Header.vue';
import SaveConfirm from '../components/SaveConfirm.vue'
import { onMounted, ref, reactive, onUpdated, watchEffect ,inject, onBeforeMount,onUnmounted,watch } from 'vue';
import { getFileDetail,getSingleFile } from '../srcipt/api/uploadFile';
var canvas = null
export default {
  name:'fileUpload',
  components: {
    FileReview,
    ProgressLine,
    Header,
    SaveConfirm
  },
  emits:['page-loading'],
  setup(props, ctx){
    const filename = ref(''); // 上傳檔案名稱
    const status = ref('');
    const nextPage = ref('');
    const arrStatus = ref(['nowDo', 'willDo', 'willDo']);
    const step = ref(1)
    const pageCount = ref(1)
    const fileExist = ref(false)
    const showConfirmModal = ref(false)
    const fileElement = ref('')
    const signfileName = ref(''); //文件名稱
    const getData = ref('')
    const usedFile = ref('')
    const getFileId = ref('');
    // const emitter = inject('emitter')

    /*
     * 檢視/編輯檔案-取得檔案資訊
    */
    bus.on('fileName_id',(id)=>{
      bus.emit('page-loading',true);
      getFileDetail(id)
      .then((res)=>{
        if(res.data.status == true){
              filename.value = res.data.data.fileName;
              signfileName.value = res.data.data.signTitle;
              getFileId.value = res.data.data._id;
              bus.emit('fileId',getFileId.value);

              if(filename.value !== ''){
                status.value = 1;
                step.value = 2;
                fileExist.value = true;
                nextPage.value = '';
              }

              //取得檔案
              getSingleFile(res.data.data.fileLocation).then((res)=>{
              usedFile.value = new File([res.data], filename.value, { type: 'application/pdf' });
              bus.emit('usedFile',usedFile.value);
              bus.emit('fileName',filename.value);
              })

            }
        }).catch((err)=>{
            alert(err.message);

        })
        bus.emit('page-loading',false);
    })

    /*
     * 上傳檔案
    */
    const uploadFile = (data) => {
        status.value = fileElement.value.files.length || data.length; // 手動上傳 || 拖拉
        status.value = !!fileElement.value.files.length
        var filedata;
        if (status.value) { //有存在檔案
            if(data){ // 拖拉檔案
                filename.value = data[0].name;
                signfileName.value = data[0].name;
                filedata = data[0];
                if (filedata.size >= 200*1024*1024) { // 超過200mb不可上傳 1KB= 1024Bytes / 1MB = 1024KB
                    alert("不可超過200mb");
                    status.value = 0;
                    return;
                }
                bus.emit('fileUpload',filedata);
                bus.emit('fileName',filename.value);
                // bus.emit('signTitle',signfileName.value);
            } else { // 手動上傳檔案
                filedata = fileElement.value.files[0];
                if (filedata.size >= 200*1024*1024) { // 超過200mb不可上傳
                    alert("不可超過200mb");
                    status.value = 0;
                    return;
                }
                filename.value = fileElement.value.files[0].name;
                signfileName.value = fileElement.value.files[0].name;
                bus.emit("fileUpload", fileElement.value.files[0]);
                bus.emit('fileName', filename.value);
                // bus.emit('signTitle',signfileName.value);
            }
        fileExist.value = true;
        step.value = 2;
      } else {
        step.value = 1;
        fileExist.value = true;
      }
    }

    // 監聽檔名是否有改變
    watch(signfileName,(newValue,oldValue)=>{
          let isFileNameChange = newValue == oldValue ? false : true;
          bus.emit('isFileNameChange',isFileNameChange);
          bus.emit('signTitle', newValue);
    })


    // 監聽檔案是否有改變
    watch(filename,(newValue,oldValue)=>{
        if(oldValue !==''){
          let isFileChange = newValue == oldValue ? false : true;
          bus.emit('isFileChange',isFileChange);
        }else{
          bus.emit('isFileChange', false);
        }
    })



    /****************************************
     *  button
     *
     */
    const nextStep = () => {
      if(fileExist.value && nextPage.value == ''){
        nextPage.value = 1;
        arrStatus.value = ['alreadyDo','nowDo','willDo']; //步驟二
        bus.emit('fileReview',true);
      } else if(fileExist.value && nextPage.value == 1){
        showConfirmModal.value = true;
      } else{
        alert('請先上傳檔案')
      }
    }

    const prevPage = () =>{
      arrStatus.value = ['nowDo','willDo','willDo'];
      nextPage.value = "";
      showConfirmModal.value = false;
      fileElement.value = '';
      // status.value = 0;
      // filename.value = '';
      bus.emit('fileReview', false);
    }

    const saveDraft = () => { //儲存草稿
      bus.emit("saveDocument",'draft');
    }

    const hideConfirmModal = () => { // 關閉確認送出檔案dialog
      showConfirmModal.value = false;
    }

    /*****************************************
     * darg file
     *
    */

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
    }


    onMounted(()=>{
      bus.emit('page-loading',false);
      bus.emit('headerStatus','fileUpload');
    })


    return{
      uploadFile,
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
      usedFile,
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
