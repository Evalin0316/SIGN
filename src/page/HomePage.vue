<template>
<div class="container_outter">
    <Header @nextStep="nextStep" @prevPage="prevPage"></Header>
    <div class="container_home p-3">
    <div>
        <div class="search_file flex flex-row">
            <div class="search_input w-2/5 m-4">
                <input type="text" class="bg-white m-3 h-8 rounded-lg p-1"/>
            </div>
            <div class="search_type bg-white flex w-3/5 m-4 rounded-lg">
                <label class="m-3"><input type="checkbox"/>未完成</label>
                <label class="m-3"><input type="checkbox"/>已完成</label>
                <label class="m-3"><input type="checkbox"/>已取消</label>
            </div>
        </div>
        <div class="filter_type"></div>
    </div>
    <ul class="flex">
        <li class="w-1/4 p-4" v-for="(item,index) in files" :key="index">
            <img src="../assets/images/Frame_finish.png"/>
        </li>
    </ul>
    </div>
</div>
</template>

<script>
import { getFile } from '../srcipt/api';
import { inject, onMounted, ref } from 'vue';
import Header from '../components/Header.vue';

export default {
    name:'homePage',
    emits:['page-loading'],
    components:{
        Header
    },
    setup() {
        const files = ref('');
        const emitter = inject('emitter')
        getFile(0,10).then((res)=>{
            if(res.data.status == true){
                console.log(res);
                files.value = res.data.data;
            }
        }).catch((err)=>{
            alert(err.message)
        })

        onMounted(()=>{
            emitter.emit('page-loading',false);
        })

        return{
            files
        }
    },
}
</script>
