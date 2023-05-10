<template>
    <div class="loading__main" ref="loading">
        <a class="loading__main__sign">
            <font-awesome-icon icon="fa-solid fa-signature" />
        </a>
        <span>Loading</span>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import bus from "../srcipt/bus";

export default{
    emits:['page-loading'],
    setup(){
        const isLoading = ref(true);
        const loading = ref(null);
        // const emitter = inject('emitter'); // Inject `emitter`
            bus.on('page-loading',(val)=>{
                const body = document.querySelector('body');
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
