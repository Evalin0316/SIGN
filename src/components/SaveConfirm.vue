<template>
<div class="w-full left-0 top-0 fixed h-screen" v-if="showConfirmModal" style="background:rgba(140, 93, 25, 0.3);">
    <div class="confirm__container">
            <div class="confirm__container__title">確定要送出嗎?</div>
            <div class="flex flex-col confirm__container__group">
                <div class="confirm__container__group__button" @click.once="allowSave()">確定</div>
                <div class="confirm__container__group__button" @click="notAllowSave()">再檢查一下~</div>
        </div>
    </div>
</div>
</template>

<script>
import bus from '../srcipt/bus';

export default{
    props:{
        showConfirmModal:{
        type: Boolean,
        default: false
        }
    },
    setup(props,{emit}){
        const allowSave = () =>{
            bus.emit("saveDocument",'complete');
            emit('hideConfirmModal');
            bus.emit('nowPage','fileUpload');
        }
        const notAllowSave = () =>{
            emit('hideConfirmModal')
        }
        return{
            allowSave,
            notAllowSave
        }
    }
}
</script>