<template>
    <div class="loading signature" ref="loading">
       <a class="sign">
            <font-awesome-icon icon="fa-solid fa-signature" />
       </a>
       <span>Loading</span>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
// import bus from "../srcipt/bus";
import { inject } from 'vue'

export default{
    emits:['page-loading'],
    setup(){
        const isLoading = ref(true);
        const loading = ref(null);
        const emitter = inject('emitter'); // Inject `emitter`
               emitter.on('page-loading',(val)=>{
                console.log(val);
                const body = document.querySelector('body');
                console.log(loading.value);
                isLoading.value = val;
                if(val){
                    loading.value.classList.remove('d-none');
                    body.setAttribute('class','mh-100vh overflow-hidden');
                }else{
                    setTimeout(()=>{
                        loading.value.classList.add('d-none');
                        body.setAttribute('class','');
                    },3000);
                }
            });

        onMounted(()=>{
        })
        return{
            isLoading,
            loading,
        }
    }
}

</script>
