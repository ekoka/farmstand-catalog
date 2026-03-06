<template>
    <div class="modal" :class="{'is-active': this.active}">
    <div class="modal-background"></div>
    
    <div class="modal-content box">
        <div v-if="mutable.images" class="columns is-multiline">
            <div v-for="i in mutable.images" class="column">
                <div class="image is-64x64" :class="{'active': i.selected}">
                    <img :src="imageUrl(i)" @click="toggleSelection(i)">
                </div>
            </div>
        </div>
        <button class="button" @click="done">Done</button>
    </div>

    <button class="modal-close is-large" @click="close">
    </button>
</div>
</template>

<script>
import {mapActions} from 'vuex'
import map from 'lodash/fp/map'
import includes from 'lodash/fp/includes'
import pull from 'lodash/fp/pull'
import filter from 'lodash/fp/filter'

export default {
    data(){
        return {
            active: true, 
            mutable: {
                images: null,
                selection: [],
            },
        }
    },
    mounted(){
        this.loadImages()
    },
    methods:{
        imageUrl(i){
            return i.aspect_ratios['1:1']['thumb']
        },

        close(e){
            this.active = false
            this.$emit('close', false)
        },

        loadImages(){
            let qsparams = {
                aspect_ratios:'1:1',
                sizes: ['thumb', 'medium'],
            }
            this.getImages({qsparams}).then(resp=>{
                this.$set(this.mutable,'images', map(i=>{
                    return i.data
                })(resp.embedded('images')))
            })

        },

        toggleSelection(i){
            if(includes(i.image_id)(this.mutable.selection)){
                const selection = pull(i.image_id)(
                        this.mutable.selection)
                this.$set(i, 'selected', false)
                this.$set(this.mutable, 'selection', selection) 
                return
            }
            this.mutable.selection.push(i.image_id)
            this.$set(i,'selected', true)
        },

        done(){
            const selection = filter(i=>{
                return includes(i.image_id)(this.mutable.selection)
            })(this.mutable.images)
            this.$emit('selected', selection)
            this.$emit('close', false)
        },

        ...mapActions({
            getImages: 'api/getImages'
        }),
    },
}
</script>

<style>
.modal-content .image.active{
    border: 2px solid orange;
}
</style>
