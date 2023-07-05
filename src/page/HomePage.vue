<template>
<div class="container_outter" @click="hideOption">
    <Header></Header>
    <div class="container_home p-3">
    <div class="flex justify-between search_line items-center">
        <div class="search_file flex flex-row items-center">
            <form class="flex item-center">
            <div class="search_input m-4 relative w-full">
                <input type="text" class="bg-white m-3 rounded-lg block w-full
                    text-sm text-gray-900 border border-gray-300 h-12 pl-3
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 z-[50]" 
                    placeholder="Search here..." v-model="keyword"/>
                <div class="absolute right-3.5 bottom-3.5 cursor-pointer  mb-2 mr-3" @click="searchClear()">
                    <img class="mr-4" src="../assets/images/icon_Close_n.png"/>
                </div>
                <div class="absolute right-3.5 bottom-3.5 cursor-pointer mb-2 border-l-4">
                    <img src="../assets/images/icon_search_n.png"/>
                </div>
            </div>
            </form>
            <div class="search_type bg-white flex w-9/12 ml-4 rounded-lg text-[#BE8E55] h-12  max-[768px]:hidden">
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox" v-model="undoneCheck"/>未完成</label>
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox" v-model="doneCheck"/>已完成</label>
                <label class="m-3">共{{flieLength}}筆</label>
            </div>
            <div class="hidden max-[768px]:inline-block relative ml-4">
                <div class="select_to_open flex justify-center items-center" 
                :class="check_select == true ? 'active' : '' " 
                @click.stop="check_select = !check_select">
                    <img src="../assets/images/Vector_close.svg"/>
                </div>
                <div class="check_select_item absolute w-24 bg-white rounded z-[60] hidden" 
                :class="check_select == true ? 'active' : '' ">
                    <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox" v-model="undoneCheck"/>未完成</label>
                    <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox" v-model="doneCheck"/>已完成</label>
                </div>
            </div>
        </div>
        <div class="upload_file z-0">
            <img class="upload_img" src="../assets/images/to_upload.svg" @click="goFileUpload()"/>
        </div>
    </div>
    <ul class="flex fileEnvelop_outter">
        <li class="m-2 flex justify-center relative cursor-pointer" :class="item.isSigned == true ? 'fileEnvelop_isSigned' : 'fileEnvelop'"
        v-for="(item,index) in filterFile" :key="index"  @click="getFileDetails(item._id)">
                <div class="fileEnvelop_option absolute right-0 bottom-0 z-[55] h-12" @click.stop="openFileOption(index)">
                    <img src="../assets/images/icon_more_n.svg"/>
                </div>
                <div class="absolute top-10 z-[50] text-[5px] w-32 flex justify-center pr-5 flex-wrap">{{item.signTitle}}</div>
                <div v-if="getIndex == index" class="absolute bottom-0 left-2 bg-white w-3/5 rounded">
                    <ul>
                        <li class="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1"><a class="flex" :href="item.fileLocation" target="blank"><img class="mx-2" src="../assets/images/icon_download_n.svg"/><a class="hover:text-[#BE8E55]">下載檔案</a></a></li>
                        <li class="text-[#BE8E55] flex cursor-pointer hover:bg-[#EFE3D4] p-1" @click.stop="deleteFileBtn(item._id,item.fileName)"><img class="mx-2" src="../assets/images/icon_delete_n.svg"/><a class="hover:text-[#BE8E55]">取消簽署</a></li>
                    </ul>
                </div>
        </li>
    </ul>
    <div class="flex justify-center item-center">
        <Pagination :pages="pages" :selected="selected" @get-data="filterProduct"></Pagination>
    </div>
    </div>
</div>
</template>

<script>
import { getFile ,deleteFile } from '../srcipt/api/uploadFile';
import { computed , onMounted, ref, watch } from 'vue';
import Header from '../components/Header.vue';
import Pagination from '../components/Pagination.vue';
import bus from "../srcipt/bus";
import { useRouter } from 'vue-router';

export default {
    name:'homePage',
    emits:['page-loading'],
    components:{
        Header,
        Pagination
    },
    setup() {
        const files = ref('');
        const flieLength = ref('');
        const keyword = ref('')
        const check_select = ref(false);
        const getAllFiles = ref([]);
        const nowPage = ref('homePage');

        bus.on('nowPage',(v)=> {
            nowPage.value = v
        })
        bus.emit('status','homePage')

        // 取得資料
        getFile(0,10).then((res)=>{
            if(res.data.status == true){
                files.value = res.data.data.data;
                flieLength.value = res.data.data.size;

                // 取得所有資料
                let pages = Math.ceil(flieLength.value / 10)
                let from = '';
                let count = '';
                let allFileArray =[];

                for(let i=1;i<=pages;i++){
                        from = i > 1 ? (i-1)*10 : 0;
                        count = 10*i;
                        allFileArray.push(getFiles(from,count))
                    }
                    Promise.all(allFileArray).then(res =>{
                        getAllFiles.value = [].concat.apply([], res);
                        filterFile.value = getAllFiles.value.slice(0,10);
                    })
            }
        }).catch((err)=>{
            alert(err.message)
        })

        // 取得資料API
        const getFiles = (from,count) => {
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    getFile(from,count).then((res)=>{
                        if(res.data.status == true){
                            resolve(res.data.data.data);
                            files.value = res.data.data.data;
                            flieLength.value = res.data.data.size;
                        }
                    }).catch((err)=>{
                        alert(err.message)
                    })
                },1000)
            })
        }

        /*
        *  資料狀態
        */

        const undoneCheck = ref(false);
        const doneCheck = ref(false);
        const selected = ref(1);
        const filterFile = ref('');

        // 篩選簽署狀態
        watch([undoneCheck,doneCheck],(val)=>{
            let undoneCheck = val[0];
            let doneCheck = val[1];
            if(undoneCheck && !doneCheck){ // 未完成 checked
                filterFile.value = getAllFiles.value.filter((x)=> x.isSigned == false);
                flieLength.value = filterFile.value.length;
            }else if(doneCheck && !undoneCheck){ // 已完成 checked
                filterFile.value = getAllFiles.value.filter((x)=> x.isSigned == true);
                flieLength.value = filterFile.value.length;
            }else{
                filterFile.value = getAllFiles.value;
                flieLength.value = filterFile.value.length;
            }
            selected.value = 1; //頁數回到第一頁
        })

        // 刪除檔案
        const deleteFileBtn = (id,filename) => {
            deleteFile(id,filename)
            .then((res)=>{
                if(res.data.status == true){
                    alert(res.data.data);
                    const findIndex = getAllFiles.value.findIndex((x)=>x._id == id ); // 檔案index
                    getAllFiles.value.splice(findIndex,1);

                    // 更新當前頁面資料
                    let from = selected.value > 1 ? (selected.value-1)*10 : 0;
                    let count = 10*selected.value;
                    filterFile.value = getAllFiles.value.slice(from,count);
                    flieLength.value --;
                    if(filterFile.value.length == 0){ // 回到前一頁
                        filterFile.value = getAllFiles.value.slice(from-10,count-10);
                        selected.value--;
                    }
                }
            }).catch((err)=>{
                alert(err.message);
            })
            hideOption();
        }


        // 計算頁數
        const pages = computed(()=>{
            return Math.ceil(flieLength.value / 10);
        })

        /*
        *  控制檔案選單
        */
        
        const getIndex = ref(-1);

        const openFileOption = (index) => {
            getIndex.value = index;
        }

        const hideOption = () => {
            getIndex.value = -1
        }

        //  查詢頁面換頁
        const filterProduct = (e) =>{
            let from = e > 1 ? (e-1)*10 : 0;
            let count = 10*e;
            filterFile.value = getAllFiles.value.slice(from,count);
            selected.value = e;
        }


        /*
        *  新增/編輯檔案 頁面切換
        */
        
        const router = useRouter();
         // 前往檢視/編輯檔案
        const getFileDetails = (id) =>{
            router.push(`/fileUpload/${id}`);
        }

        // 前往上傳檔案頁面
        const goFileUpload = () => {
            bus.emit('status','fileUpload')
            router.push(`/fileUpload/uploadNewFile`)
        }

        /*
        *  搜尋框
        */

        // 查詢
        watch(keyword,(val)=>{
            filterFile.value = getAllFiles.value.filter( x => {
                return x.signTitle.toLowerCase().includes(val.toLowerCase())
            })
        })

        // 清除搜尋框
        const searchClear = () => {
            keyword.value = ''
        }


        onMounted(()=>{
            bus.emit('page-loading',false);
            bus.emit('headerStatus','homePage');
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
            getIndex,
            hideOption,
            deleteFileBtn,
            getFileDetails,
            doneCheck,
            undoneCheck,
            selected,
            pages,
            // changePage,
            getFiles,
            check_select,
            filterProduct
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
