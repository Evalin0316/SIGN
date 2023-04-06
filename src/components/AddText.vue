<template>
<div class="text_container shadow-md" v-if="showModal">
    <div class="mt-3" @click="closeWarning">
        <img class="absolute right-0 top-0 mr-4 mt-4" src="../assets/images/icon_Close_Square_n.png" />
    </div>
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
            bus.emit("saveText", val);
            this.$emit('hideTextModal');
        },
        closeWarning(){
             this.$emit('hideTextModal');
        }
    }
}

</script>