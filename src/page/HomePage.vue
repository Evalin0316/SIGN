<template>
<div class="container_outter">
    <Header></Header>
    <div class="container_home p-3">
    <div class="flex justify-between search_line">
        <div class="search_file flex flex-row">
            <form>
            <div class="search_input m-4 relative">
                <div class="absolute pointer-events-none right-3.5 bottom-2.5 mr-5 border-r-4 border-l-yellow-600 cursor-pointer">
                    <img src="../assets/images/icon_Close_n.png"/>
                </div>
                <div class="absolute pointer-events-none right-3.5 bottom-2.5 cursor-pointer">
                    <img src="../assets/images/icon_search_n.png"/></div>
                    <input type="text" class="bg-white m-3 rounded-lg block w-full
                    text-sm text-gray-900 border border-gray-300 h-12 pl-3 cursor-pointer
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Search here..."/>
            </div>
            </form>
            <div class="search_type bg-white flex w-9/12 m-4 rounded-lg text-[#BE8E55] h-12">
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>未完成</label>
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>已完成</label>
                <label class="m-3 flex justify-center items-center"><input class="selector" type="checkbox"/>已取消</label>
                <label class="m-3">共{{flieLength}}筆</label>
            </div>
        </div>
        <div class="upload_file m-4">
            <img class="upload_img" src="../assets/images/to_upload.svg" @click="goFileUpload()"/>
        </div>
    </div>
    <ul class="flex">
        <li class="w-1/4 p-4 relative" v-for="(item,index) in files" :key="index">
            <div class="absolute -bottom-14 z-[99] text-[5px] w-32 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center">{{item.fileName}}</div>
            <div class="absolute"><img src="../assets/images/Frame_finish.png"/></div>
        </li>
    </ul>
    </div>
</div>
</template>

<script>
import { getFile } from '../srcipt/api';
import { inject, onMounted, onUnmounted, ref } from 'vue';
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

        onMounted(()=>{
            bus.emit('page-loading',false);
            bus.emit('headerStatus','homePage')
        })

        return{
            files,
            goFileUpload,
            nowPage,
            flieLength
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
