<template>
<div class="box">
    <h4 class="subtitle is-5">
        Add or remove product images
    </h4>

    <image-selector @selected="mergeSelection($event)" @close="selector=false" v-if="selector">
    </image-selector>

    <thumb-grid 
        v-if="images.length" 
        :images="images">
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
                                    <i class="mdi mdi-upload"></i>
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

import thumbGrid from './grid'
import imageSelector from './selector'
import _ from 'lodash/fp'

const acceptedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
]

export default {
    components: {thumbGrid, imageSelector,},

    props: ['product_id'],

    data(){
        return {
            files: null,
            selectedFiles: [],
            images:[],
            selector: false,
        }
    },

    computed:{
        fileNames(){
            let rv = 'No file chosen'
            if (this.selectedFiles && this.selectedFiles.length){
                rv = _.reduce((acc, cur)=>{
                    acc.push(cur.name)
                    return acc
                }, [])(this.selectedFiles)
            }
            console.log(rv)
            return rv
        },
        localImages(){
            return _.map(f=>{
                console.log(f.webkitRelativePath)
                const path = f.webkitRelativePath + '/' + f.name
                return {path}
            })(this.selectedFiles)
        },
        fileTypes(){
            return _.map(f=>{
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
        }
    },

    methods: {
        updateChosenFiles(e){
            _.map((f)=>{
                this.selectedFiles.push(f)
            })(e.target.files || e.dataTransfer.files)
        },

        uploadCurrentFile(image){
            // todo implement a buffer here that lets user cancel upload
            console.log(image)
            
            this.postSourceImage({
                image
            }).then((i)=>{
                this.images.push(i.data)
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
            _.map(i=>{
                this.images.push(i)
            })(e)
        },
        //uploadCurrentFile(){
        //    const next = () => {
        //        // currentFile is unset only at end of upload 
        //        this.currentFile = null
        //        // file is removed from stack only at end of upload
        //        this.localImages.shift()
        //    }

        //    this.postImageUpload({image: this.currentFile}).then(()=>{
        //        console.log(this.currentFile.name + ' uploaded')
        //        // TODO: issue upload succeeded message
        //        console.log('upload succeeded')
        //        next()
        //    }).catch(error=>{
        //        // upload failed for some reason
        //        // TODO: issue upload failed message
        //        console.log('upload failed')
        //        console.log(error)
        //        next()
        //    })
        //},
        ...mapActions({
            postSourceImage: 'api/postSourceImage',
        }),
    },
}
</script>
