<template>
<div class="box">
    <h4 class="subtitle is-5">
        Product images
    </h4>

    <image-selector @selected="mergeSelection($event)" @close="selector=false" v-if="selector">
</image-selector>

    <thumb-grid 
        v-if="mutable.images.length" 
        v-model="mutable.images" >
    </thumb-grid>
    <div class="field is-horizontal">
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <div class="file has-name">
                        <label class="file-label">
                            <input id="fileinput" 
                            class="file-input" 
                            @change="updateChosenFiles" 
                            type="file">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="iconify mdi" data-icon="mdi-upload"></i>
                                </span><!-- file-icon -->
                                <span class="file-label">
                                    Upload new images&hellip;
                                </span><!-- file-label -->
                            </span><!-- file-cta -->
                        </label><!-- file-label -->
                    </div><!-- file -->
                </div><!-- control -->
            </div><!-- field -->
            <div class="field"> 
                <label> or </label>
            </div><!-- field -->
            <div class="field">
                <div class="control">
                    <button class="button" @click="openImageSelector">
                        Select from existing ones
                    </button>
                </div><!-- control -->
            </div><!-- field -->
        </div><!-- field-body -->
    </div><!-- field is-horizontal -->


</div>
</template>

<script>
import {mapActions} from 'vuex'

import reduce from 'lodash/fp/reduce'
import map from 'lodash/fp/map'

const acceptedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
]

export default {
    components: {
        thumbGrid: ()=>import  ( './grid'),
        imageSelector: ()=>import  ( './selector'),
    },

    props: ['product_id', 'images'],

    data(){
        return {
            ready:false,
            files: null,
            selectedFiles: [],
            selector: false,
            mutable:{
                images:[],
            },
        }
    },

    mounted(){
        if(this.product_id){
            return this.loadProductImages(this.product_id).then(()=>{
                this.ready = true
            })
        } 
        this.ready = true
        
    },

    computed:{
        fileNames(){
            let rv = 'No file chosen'
            if (this.selectedFiles && this.selectedFiles.length){
                rv = reduce((acc, cur)=>{
                    acc.push(cur.name)
                    return acc
                }, [])(this.selectedFiles)
            }
            return rv
        },
        fileTypes(){
            return map(f=>{
                return f.type
            })(this.selectedFiles)
        },
    },

    watch:{
        selectedFiles: {
            deep: true,
            handler(v){
                if(v.length){
                    const value = v.shift()
                    this.uploadCurrentFile(value)
                }
            }
        },
        'mutable.images':{
            deep:true,
            handler(v){
                // we only emit a 'changed' event if the `ready` flag is set 
                // sync up the data
                this.$emit('update:images', map(i=>{
                    return i.image_id
                })(v))
                // return if still just loading base data
                if(!this.ready){
                    return
                }
                // any changes beyond base data load will be visible to parent
                this.$emit('changed', true)
                //this.$emit('changed', map(i=>{
                //    return i.image_id
                //}, v))
                
            }
        }
    },

    methods: {
        updateChosenFiles(e){
            map((f)=>{
                this.selectedFiles.push(f)
            })(e.target.files || e.dataTransfer.files)
        },

        uploadCurrentFile(image){
            // todo implement a buffer here that lets user cancel upload
            this.postSourceImage({
                image
            }).then((i)=>{
                this.mutable.images.push(i.data)
            }).catch(error=>{
                // upload failed for some reason
                // TODO: issue upload failed message
                console.log('upload failed')
                console.log(error)
            })
        },

        openImageSelector(){
            this.selector = true
        },

        mergeSelection(e){
            map(i=>{
                this.mutable.images.push(i)
            })(e)
        },

        loadProductImages(product_id){
            return this.getProductImages({
                product_id
            }).then(resp=>{
                map(i=>{
                    this.mutable.images.push(i.data)
                })(resp.embedded('images'))
            })
        },

        ...mapActions({
            postSourceImage: 'api/postSourceImage',
            getProductImages: 'api/getProductImages',
        }),
    },
}
</script>
