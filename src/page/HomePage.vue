<template>
<div class="container_outter">
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
        <li class="m-2 relative fileEnvelop" v-for="(item,index) in filterFile" :key="index">
            <div class="fileEnvelop_option absolute right-0 bottom-0 z-[55] h-12" @click="openFileOption()"><img src="../assets/images/icon_more_n.svg"/></div>
            <!-- <div class="absolute -bottom-5 z-[50] text-[5px] w-32 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center">{{item.fileName}}</div> -->
            <!-- <div class="absolute w-full"><img src="../assets/images/Frame_finish.png"/></div> -->
          <div v-if="isOption" class="absolute bottom-0 left-10 bg-white w-1/2">
            <ul>
                <li class="text-[#BE8E55] flex"><img src="../assets/images/icon_download_n.svg"/><a>下載檔案</a></li>
                <li class="text-[#BE8E55] flex"><img src="../assets/images/icon_delete_n.svg"/><a>取消簽署</a></li>
            </ul>
        </div>
        </li>
    </ul>
    </div>
</div>
</template>

<script>
import { getFile } from '../srcipt/api';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
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
        const isOption = ref(false);
        const count = ref(1);
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

        const searchClear = function(){
            keyword.value = ''
        }

        const openFileOption = function(){
            if(count.value == 1){
                isOption.value = true
                count.value--;
            }else{
                isOption.value = false
                count.value++;
            }
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
            isOption,
            openFileOption,
            count
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
