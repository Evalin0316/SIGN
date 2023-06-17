<template>
<div>
    <div class="btn flex items-center cursor-pointer relative rounded">
        <div class="flex justify-center items-center px-4 py-3">
            <img :src=imgUrl class="absolute" :class=iconPosition />
            <slot name="image"></slot>
            <a class="block" :class="textPosition">{{buttonText}}</a>
        </div>
    </div>
</div>
</template>

<script>
export default{
    props:{
        buttonText:{
            type:String,
            default:''
        },
        imgUrl:{
            type:String,
            default:''
        },
        iconPosition:{
            type:String,
            default:''
        },
        textPosition:{
            type:String,
            default:''
        }
    }
}
</script>

<style scope lang="scss">
$main_color: #be8e55;
.container_tab{
    background: #FFFFFF;
}
.btn {
    color: $main_color;
    font-weight: 500;
    background-color: #EFE3D4;
    max-width: 300px;
    height: 34px;
    max-height: 50px;
}
</style>