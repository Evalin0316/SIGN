<template>
<div class="container_outter" @click="hideOption">
    <Header></Header>
    <div class="container_home p-3">
    <div class="flex justify-between search_line">
        <div class="search_file flex flex-row">
            <form class="flex item-center">
            <div class="search_input m-4 relative w-full">
                <input type="text" class="bg-white m-3 rounded-lg block w-full
                    text-sm text-gray-900 border border-gray-300 h-12 pl-3
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 z-[50]" 
                    placeholder="Search here..." v-model="keyword"/>
                <div class="absolute right-3.5 bottom-3.5 mr-5 cursor-pointer  mb-2 mr-3" @click="searchClear()">
                    <img class="mr-4" src="../assets/images/icon_Close_n.png"/>
                </div>
                <div class="absolute right-3.5 bottom-3.5 cursor-pointer mb-2 border-l-4">
                    <img src="../assets/images/icon_search_n.png"/>
                </div>
            </div>
            </form>
            <div class="search_type bg-white flex w-9/12 ml-4 mt-7 rounded-lg text-[#BE8E55] h-12">
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>未完成</label>
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>已完成</label>
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>已取消</label>
                <label class="m-3">共{{flieLength}}筆</label>
            </div>
        </div>
        <div class="upload_file m-4 z-0">
            <img class="upload_img" src="../assets/images/to_upload.svg" @click="goFileUpload()"/>
        </div>
    </div>
    <ul class="flex fileEnvelop_outter">
        <li class="m-2 fileEnvelop flex justify-center relative cursor-pointer" v-for="(item,index) in filterFile" :key="index"  @click="getFileDetails(item._id)">
                <div class="fileEnvelop_option absolute right-0 bottom-0 z-[55] h-12" @click.stop="openFileOption(index)">
                    <img src="../assets/images/icon_more_n.svg"/>
                </div>
                <div class="absolute top-10 z-[50] text-[5px] w-32 flex justify-center pr-5 flex-wrap">{{item.signTitle}}</div>
                <div v-if="getIndex == index" class="absolute bottom-0 left-2 bg-white w-3/5 rounded">
                    <ul>
                        <li class="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1"><a class="flex" :href="item.fileLocation" target="blank"><img class="mx-2" src="../assets/images/icon_download_n.svg"/><a class="hover:text-[#BE8E55]">下載檔案</a></a></li>
                        <li class="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1" @click="deleteFileBtn(item._id,item.fileName)"><img class="mx-2" src="../assets/images/icon_delete_n.svg"/><a class="hover:text-[#BE8E55]">取消簽署</a></li>
                    </ul>
                </div>
        </li>
    </ul>
    </div>
</div>
</template>

<script>
import { getFile ,deleteFile ,getFileDetail } from '../srcipt/api';
import { computed, inject, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import Header from '../components/Header.vue';
import bus from "../srcipt/bus";
import { useRouter } from 'vue-router';

export default {
    name:'homePage',
    emits:['page-loading'],
    components:{
        Header
    },
    setup() {
        const files = ref('');
        const nowPage = ref('homePage');
        const router = useRouter();
        const flieLength = ref('');
        const keyword = ref('')
        const getfileId = ref('');
        const getIndex = ref(-1);
        // const emitter = inject('emitter')
        bus.on('nowPage',(v)=> {
            nowPage.value = v
        })
        bus.emit('status','homePage')

        getFile(0,10).then((res)=>{
            if(res.data.status == true){
                files.value = res.data.data;
                flieLength.value = res.data.data.length;
            }
        }).catch((err)=>{
            alert(err.message)
        })

        const goFileUpload = () => {
            bus.emit('status','fileUpload')
            router.push(`/week2-F2E/fileUpload`)
        }

        const filterFile = computed(() => {
            const data = [...files.value];
            return data.filter( x => {
                return x.fileName.toLowerCase().includes(keyword.value.toLowerCase())
            })
        });

        const searchClear = () => {
            keyword.value = ''
        }

        const openFileOption = (index) => {
            getIndex.value = index;
        }

        const hideOption = () => {
            getIndex.value = -1
        }

        // 刪除檔案
        const deleteFileBtn = (id,filename) => {
            deleteFile(id,filename)
            .then((res)=>{
                if(res.data.status == true){
                    alert(res.data.data);
                    const findIndex = files.value.findIndex((x)=>x._id == id ); // 檔案index
                    files.value.splice(findIndex,1);
                }
            }).catch((err)=>{
                alert(err.message);
            })
        }

        // 檢視/編輯檔案
        const getFileDetails = (id) =>{
            getFileDetail(id)
            .then((res)=>{
                if(res.data.status == true){
                    bus.emit('fileName',res.data.data.fileName);
                    console.log(res)
                    bus.emit('fileLocation',res.data.data.fileLocation);
                    if(res.data.data.fileLocation !== undefined){
                        router.push(`/week2-F2E/fileUpload`);
                    }
                   
                }
            }).catch((err)=>{
                alert(err.message);
            })
        }

        onMounted(()=>{
            bus.emit('page-loading',false);
            bus.emit('headerStatus','homePage')
        })

        return{
            files,
            goFileUpload,
            nowPage,
            flieLength,
            keyword,
            filterFile,
            searchClear,
            openFileOption,
            getfileId,
            getIndex,
            hideOption,
            deleteFileBtn,
            getFileDetails
        }
    },
}
</script>


<style lang="scss" scoped>
input[type="checkbox"] {
  appearance: none;
  background-color: #FFFFFF;
  margin: 0;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid #BE8E55;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: '';
  width: 1em;
  height: 1em;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
  background-color: #BE8E55;
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
  background-color: #BE8E55
}
</style>
