<template>
<div class="modal" :class="{'is-active': modalActive}">
    <div class="modal-background" @click="closeModal"></div>
    <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    <div class="modal-content">
        <component :is="component" 
            v-bind="params" 
            v-on="events"
            @close="closeModal" ></component>
    </div>
</div>
</template>

<script>
export default {
    props: ['modalComponent', 'listenFor', 'params'],

    data(){
        return {
            events:{},
            modalActive: false,
            component: null,
        }
    },

    watch: {
        modalComponent: {
            handler(value){
                this.setup()
                if(value){
                    this.modalActive = true
                    this.component = this.modalComponent
                }
            },
            immediate: true,
        },
    },

    methods:{
        setup(){
            if(this.listenFor && this.listenFor.length){
                this.listenFor.forEach(evntName=>{
                    this.events[evntName] = (e)=>{this.$emit(evntName, e)}
                })
            }
        },
        closeModal(){
            this.modalActive = false
            this.component = null
            this.$emit('closeModal')
            this.$emit('update:modalComponent', null)
        },
    },
}
</script>
