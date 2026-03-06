<template>
<div class="modal">
    <div @click="$emit('close')" class="modal-background"></div>
    <div class="modal-content">
        <div class="message" :class="'is-' + this.level">
            <div class="message-header">
                {{header}}
            </div>
            <div class="message-body">
                {{message}}
            </div>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <button @click="triggerCallback " class="button" :class="confirmBtn.css">{{confirmBtn.label}}</button>
            </div>
            <div class="control">
                <button @click="$emit('close')" class="button" :class="cancelBtn.css">{{cancelBtn.label}}</button>
            </div>
        </div>
    </div>
    <button @click="$emit('close')" class="modal-close is-large" aria-label="close"></button>
</div>
</template>

<script>
export default {
    props: {
        header: {
            default: '',
        },
        message:{
            default: '',
        }, 
        level:{
            default: 'info', // warning
        }, 
        type:{
            default: 'confirm', // info
        }, 
        confirmBtn: {
            default: {
                label: 'OK'
            },
        }, 
        cancelBtn: {
            default: {
                label: 'Cancel',
            }
        },
        callback:{},
        params:{},
    },
    methods:{
        triggerCallback(){
            this.callback(this.params)
            this.$emit('close')
        }
    },
}
</script>
