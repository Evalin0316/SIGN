<template>
    <div class="loading signature" ref="loading">
       <!-- <i class="fa-solid fa-file-signature sign"></i> -->
      <font-awesome-icon icon="fa-solid fa-file-signature" />
       <!-- <a class="sign">
            <font-awesome-icon :icon="['fas', 'coffee']" />
       </a> -->
       <span>Loading</span>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import bus from "../srcipt/bus";


export default{
    setup(){
        const isLoading = ref(true);
        const loading = ref(null)
        onMounted(()=>{
            bus.on('pageLoading',(val)=>{
                console.log('val',val);
                const body = document.querySelector('body');
                isLoading.value = val;
                if(val){
                    loading.classList.remove('d-none');
                    body.setAttribute('class','mh-100vh overflow-hidden');
                }else{
                    setTimeout(()=>{
                        loading.classList.add('d-none');
                        body.setAttribute('class','');
                    },200);
                }
            });
        })
        return{
            isLoading,
            loading,
        }
    }
}

</script>
