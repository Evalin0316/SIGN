<template>
<div class="confirm_container" v-if="showConfirmModal">
        <div class="confirm_title">確定要送出嗎?</div>
        <div class="flex flex-col confirm_wrapper">
            <div class="confirmBtn" @click.once="allowSave()">確定</div>
            <div class="confirmBtn" @click="notAllowSave()">再檢查一下~</div>
        </div>
</div>
</template>

<script>
import bus from '../srcipt/bus';

export default{
    data(){
        return{
            text:''
        }
    },
    props:{
        showConfirmModal:{
        type: Boolean,
        default: false
        }
    },
    methods:{
        allowSave(){
            bus.emit("saveDocument",'complete');
            this.$emit('hideConfirmModal');
            bus.emit('nowPage','fileUpload');
        },
        notAllowSave(){
            this.$emit('hideConfirmModal');
        }
    }
}
</script>