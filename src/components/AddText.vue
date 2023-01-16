<template>
<div class="text_container" v-if="showModal">
    <div>
       <textarea v-model="text" class="textInput" />
    </div>
    <div class="confirmBtn" @click="addText(val)">新增文字</div>
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
        showModal:{
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
.text_container{
    background:#EFE3D4;
    width:300px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .textInput{
        width: 200px;
        height: 90px;
        border: 1px solid black;
        padding: 5px 10px;
        background: #FFFFFF;
    }
    .confirmBtn{
        width:100px;
        height:30px;
        color: #FFFFFF;
        margin-top:8px;
        background: #DEAF7B;
        padding:4px;
        border-radius: 4px;
        cursor:pointer;
    }
}
</style>
