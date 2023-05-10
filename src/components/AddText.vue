<template>
<div class="text__container shadow-md" v-if="showModal">
    <div class="text__container__header mt-3" @click="closeWarning">
        <img src="../assets/images/icon_Close_Square_n.png" />
    </div>
    <div class="text__container__content">
        <textarea v-model="text" class="textInput" />
    </div>
    <div class="text__container__button" @click="addText(val)">新增文字</div>
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
            bus.emit("saveText", val);
            this.$emit('hideTextModal');
        },
        closeWarning(){
            this.$emit('hideTextModal');
        }
    }
}

</script>