<template>
<div class="confirm_container" v-if="showConfirmModal">
    <div class="confirm_title">確定要送出嗎?</div>
    <div class="flex flex-col">
        <div class="confirmBtn">確定</div>
        <div class="confirmBtn">再檢查一下~</div>
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
        default: true
        }
    },
    methods:{
        addText(val){
            val = this.text;
            console.log(val);
            // this.$emit("saveText",val);
            bus.emit("saveText", val);
            this.$emit('hideTextModal');
        }
    }
}
</script>

<style lang="scss" scoped>
.confirm_container{
    background:#FFFFFF;
    width:60%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    left: 33%;
    top: 30%;
    z-index: 999;
    border-radius: 20px;
    .confirm_title{
       color: #8C5D19;
    }
    .confirmBtn{
        width:100px;
        height:30px;
        color: #FFFFFF;
        margin-top:8px;
        background: #EFE3D4;
        padding:4px;
        border-radius: 10px;
        cursor:pointer;
        color:#BE8E55;
        border-radius: 4px;      
        width: 280px;
        height: 34px;
    }
}

</style>