<template>
<div class="box">
    <h4 class="subtitle is-5">Add or remove product pictures</h4>

    <div class="field">
        <div class="control">
            <thumb-grid :images="uploadedImages">
            </thumb-grid>
        </div>
        <div class="control">
            <div class="file has-name">
                <label class="file-label">
                    <input id="fileinput" class="file-input" @change="updateChosenFiles" type="file">
                    <span class="file-cta">
                        <span class="file-icon">
                            <i class="mdi mdi-upload"></i>
                        </span><!-- file-icon -->
                        <span class="file-label">
                            Choose a file&hellip;
                        </span><!-- file-label -->
                    </span><!-- file-cta -->
                    <span class="file-name">
                    </span><!-- file-name -->
                    <img v-for="i in localImages" :src="i.path"/>
                </label><!-- file-label -->
            </div><!-- file -->
        </div><!-- control -->
    </div><!-- field -->
</div>
</template>

<script>
import {mapActions} from 'vuex'

import thumbGrid from './grid'
import {reduce, map} from 'lodash/fp'

const acceptedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
]

export default {
    components: {
        thumbGrid,
    },

    data(){
        return {
            files: null,
            selectedFiles: [],
            uploadedImages: [],
            images:[],
        }
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
            console.log(rv)
            return rv
        },
        localImages(){
            return map(f=>{
                console.log(f.webkitRelativePath)
                const path = f.webkitRelativePath + '/' + f.name
                return {path}
            })(this.selectedFiles)
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
            console.log(image)
            
            this.postSourceImage({
                image
            }).then((i)=>{
                this.uploadedImages.push(i.data)
            }).catch(error=>{
                // upload failed for some reason
                // TODO: issue upload failed message
                console.log('upload failed')
                console.log(error)
            })
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
