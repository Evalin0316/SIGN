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
        <div>
            目前頁次第
            <select class="rounded" v-model="selected" @change="changePage($event.target.value)">
                <option v-for="(item, idx) in pages" :key="idx" :value="item">{{item}}</option>
            </select>
            頁
        </div>
    </div>
    </div>
</div>
</template>

<script>
import { getFile ,deleteFile } from '../srcipt/api/uploadFile';
import { computed , onMounted, ref } from 'vue';
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
        const undoneCheck = ref(false);
        const doneCheck = ref(false);
        const selected = ref(1);
        const check_select = ref(false);

        bus.on('nowPage',(v)=> {
            nowPage.value = v
        })
        bus.emit('status','homePage')


        if (localStorage.getItem('reloaded')) {
            localStorage.removeItem('reloaded');
            getFile(0,10).then((res)=>{
            if(res.data.status == true){
                files.value = res.data.data.data;
                flieLength.value = res.data.data.size;
            }
        }).catch((err)=>{
            alert(err.message)
        })
        } else {
            localStorage.setItem('reloaded', '1');
            location.reload();
        }


        const getFiles = (from,count) => {
            getFile(from,count).then((res)=>{
            if(res.data.status == true){
                files.value = res.data.data.data;
                flieLength.value = res.data.data.size;
            }
        }).catch((err)=>{
            alert(err.message)
        })
        }

        const goFileUpload = () => {
            bus.emit('status','fileUpload')
            router.push(`/fileUpload/uploadNewFile`)
        }

        const filterFile = computed(() => {
            const data = [...files.value];
            if(undoneCheck.value && doneCheck.value == false){ // 未完成 checked
                return filterFile.value.filter((x)=> x.isSigned == false);
            }else if(doneCheck.value && undoneCheck.value == false){ // 已完成 checked
                return filterFile.value.filter((x)=> x.isSigned == true);
            }else if((undoneCheck.value == false && doneCheck.value == false)){
                return data.filter( x => {
                return x.signTitle.toLowerCase().includes(keyword.value.toLowerCase())
                })
            }else if(undoneCheck.value && doneCheck.value){ // 未完成 && 已完成 checked
                return data.filter( x => {
                return x.signTitle.toLowerCase().includes(keyword.value.toLowerCase())
                })
            }else{
                return data.filter( x => {
                return x.signTitle.toLowerCase().includes(keyword.value.toLowerCase())
                })
            }
        });

        const pages = computed(()=>{
            if(undoneCheck.value && doneCheck.value == false){
                return 1;
            }else if(doneCheck.value && undoneCheck.value == false){
                return 1;
            }else{
                return Math.ceil(flieLength.value / 10);
            }
        })

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
            hideOption();
        }

        // 檢視/編輯檔案
        const getFileDetails = (id) =>{
            router.push(`/fileUpload/${id}`);
        }

        const changePage = (e) =>{
            let from = e > 1 ? (e-1)*10 : 0;
            let count = 10*e;
            getFiles(from,count);
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
            getFileDetails,
            doneCheck,
            undoneCheck,
            selected,
            pages,
            changePage,
            getFiles,
            check_select,
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
