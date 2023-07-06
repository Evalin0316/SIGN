<template>
<div class="flex justify-center item-center">
    <div class="mr-2 text-[#be8e55] cursor-pointer" v-if="selectPage > 1"  @click.prevent="pageBtn('pre')">前一頁</div>
    <p class="text-[#be8e55] mr-1">目前頁次第</p>
    <select class="rounded" v-model="selectPage" @change="changePage($event.target.value)">
        <option v-for="(item, idx) in pages" :key="idx" :value="item">{{item}}</option>
    </select>
    <div class="ml-2 text-[#be8e55] cursor-pointer" v-if="selectPage < pages" @click.prevent="pageBtn('next')">下一頁</div>
</div>
</template>

<script>
import { toRefs, ref, watch } from 'vue';
export default{
    props:['pages','selected'],
    setup(props,{emit}){
        const {pages ,selected} = toRefs(props);
        const selectPage = ref(1);
        selectPage.value = Number(selected.value);
        const changePage = (e) =>{
            selectPage.value = Number(e);
            emit('getData',e);
        }

        const pageBtn = (type) =>{
            selectPage.value = type == 'pre' ?  selectPage.value - 1 : selectPage.value + 1;
            emit('getData',selectPage.value);
        }

        watch(selected,(val)=>{
            selectPage.value = val;
        })

        return{
            changePage,
            selectPage,
            pageBtn
        }
    }
}
</script>

