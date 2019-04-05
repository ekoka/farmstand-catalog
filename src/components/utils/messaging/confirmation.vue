<template>
<modal v-if="modalComponent.component" :modalComponent.sync="modalComponent.component" 
    :listenFor="Object.keys(modalComponent.events)"
    :params="modalComponent.params"
    v-on="modalComponent.events">
    <slot></slot>
</modal>
</template>

<script>
import modal from '@/components/utils/modal'
import truefalse from './truefalse'
export default {
    props: ['active', 'handlers'],
    components: {modal, truefalse,},

    data(){
        return {
            modalComponent: {},
        }
    },

    watch:{
        active: {
            handler(v){
                if(v){
                    this.attachComponent()
                }
            },
            immediate: true,
        },
    },

    methods:{
        attachComponent(){
            this.modalComponent = {
                component:truefalse,
                params:{
                    options: this.options || {},
                },
                events: {
                    confirmation: this.handler,
                    close: this.handler,
                },
            }
        },
        handler(e){
            if (this.handlers[e]){
                this.handlers[e](e)
            }
            this.$emit('confirmation', e)
            this.$emit('update:active', false)
        }
    },
}
</script>


