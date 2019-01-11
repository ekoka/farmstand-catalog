<template>
<div>
<draggable v-model="imageList" class="box">
    <span v-for="i,k in imageList">
        <img :src="i.aspect_ratios['1:1']['thumb']" />
        <button class="button">
            <span class="icon">
                <i class="mdi mdi-close-box"></i>
            </span>
        </button>
    </span>
</draggable>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    components: {
        draggable,
    },
    props: ['images'],
    data(){
        return {
            imageList: [...this.images]
        }
    },
    watch:{
        images: {
            deep:true,
            handler(v){
                this.imageList = [...v]
            }
        }
    },

    methods:{
        removeImage(i){
        },
    }
}
</script>
