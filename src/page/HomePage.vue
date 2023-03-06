<template>
<div class="container_outter">
    <Header></Header>
    <div class="container_home p-3">
    <div class="flex justify-between">
        <div class="search_file flex flex-row">
            <form>
            <div class="search_input m-4 relative">
                <div class="absolute pointer-events-none right-3.5 bottom-1.5 mr-5 border-r-4 border-l-yellow-600"><img src="../assets/images/icon_Close_n.png"/></div>
                <div class="absolute pointer-events-none right-3.5 bottom-1.5"><img src="../assets/images/icon_search_n.png"/></div>
                <input type="text" class="bg-white m-3 h-8 rounded-lg block w-full
                p-4 pl-10 text-sm text-gray-900 border border-gray-300
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search here..."/>
            </div>
            </form>
            <div class="search_type bg-white flex w-3/5 m-4 rounded-lg">
                <label class="m-3"><input type="checkbox"/>未完成</label>
                <label class="m-3"><input type="checkbox"/>已完成</label>
                <label class="m-3"><input type="checkbox"/>已取消</label>
                <label class="m-3">共{{flieLength}}筆</label>
            </div>
        </div>
        <div class="upload_file m-4">
            <img src="../assets/images/to_upload.svg" @click="goFileUpload()"/>
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
            bus.emit('status','homePage')
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
