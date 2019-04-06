<template>
<div class="modal" :class="{'is-active': active}">
    <div class="modal-background" @click="close"></div>
    <button v-if="button" class="modal-close is-large" 
        aria-label="close" 
        @click="close">
    </button>
    <div class="modal-content">
        <slot></slot>
    </div>
</div>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        button: {
            type: Boolean,
            default: true,
        },
    },

    watch: {
        active: {
            handler(v){
                console.log('active is now ', v)
                if(!v){
                    this.close() 
                }
            },
        },
    },

    methods:{
        close(){
            this.$emit('update:active', false)
        },
    },
}
</script>
