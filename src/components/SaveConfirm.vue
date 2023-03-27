<template>
<div class="confirm_container" v-if="showConfirmModal">
        <div class="confirm_title">確定要送出嗎?</div>
        <div class="flex flex-col confirm_wrapper">
            <router-link class="confirmBtn" to='/week2-F2E/' @click="allowSave()">確定</router-link>
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
            bus.emit("saveDocument");
            this.$emit('hideConfirmModal');
            bus.emit('nowPage','fileUpload');
        },
        notAllowSave(){
            this.$emit('hideConfirmModal');
        }
    }
}
</script>

// <style lang="scss" scoped>
// .confirm_container{
//     background:#FFFFFF;
//     width:45%;
//     height: 200px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//     position: absolute;
//     left: 33%;
//     top: 30%;
//     z-index: 999;
//     border-radius: 20px;
//     .confirm_title{
//         color: #8C5D19;
//     }
//     .confirm_wrapper{
//             .confirmBtn{
//                 height:30px;
//                 color: #FFFFFF;
//                 margin-top:8px;
//                 background: #EFE3D4;
//                 padding:4px;
//                 border-radius: 10px;
//                 cursor:pointer;
//                 color:#BE8E55;
//                 border-radius: 4px;      
//                 height: 34px;
//                 padding:5px 20px;
//                 max-width: 300px;
//                 min-width: 70px;
//             }
//         }
// }

// </style>