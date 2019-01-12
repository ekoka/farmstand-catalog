<template>
<div>
<draggable v-model="mutable.imageList" @update="emitList" class="box">
    <span v-for="i,k in mutable.imageList">
        <img :src="i.aspect_ratios['1:1']['thumb']" />
        <button class="button" @click="removeImage(i)">
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
import _ from 'lodash/fp'
export default {
    components: {
        draggable,
    },
    model:{
        prop: 'images',
        event: 'updated',
    },
    props: ['images'],
    data(){
        return {
            mutable: {
                imageList: [...this.images]
            }
        }
    },
    watch:{
        images: {
            deep:true,
            handler(v){
                this.mutable.imageList = [...v]
            }
        }
    },

    methods:{
        removeImage(i){
            const imageList = _.remove(image=>{
                return image.image_id==i.image_id
            })(this.mutable.imageList)
            this.$set(this.mutable, 'imageList', imageList)
            this.emitList()
        },
        emitList(){
            this.$emit('updated', this.mutable.imageList)
        },
    }
}
</script>
