<template>
<div class="text__container" v-if="showModal">
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
import { ref } from 'vue';
export default{
    name:'addText',
    props:{
        showModal:{
        type: Boolean,
        default: true
        }
    },
    setup(props,{emit}){
        const text = ref('');
        const addText = (val) =>{
            val = text.value;
            bus.emit("saveText", val);
            emit('hideTextModal');
        }

        const closeWarning = () =>{
            emit('hideTextModal')
        }
        return{
            text,
            addText,
            closeWarning
        }
    },
}

</script>