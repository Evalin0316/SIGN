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