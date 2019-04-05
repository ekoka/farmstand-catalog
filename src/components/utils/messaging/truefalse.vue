<template>
<div class="message is-warning">
    <div class="message-body">
        <p class="is-size-5">
            <slot></slot>
        </p>
        <div class="field is-grouped">
            <div class="control">
                <button @click="confirmation(false)" class="button" :class="cssfalse">{{labelfalse}}</button>
            </div>
            <div class="control">
                <button @click="confirmation(true)" class="button" :class="csstrue">{{labeltrue}}</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['answer', 'options'],

    methods:{
        confirmation(value){
            this.$emit('confirmation', value)
            this.$emit('close')
        },
    },

    computed: {
        csstrue(){
            const options = this.options
            return (options.css && options.css[true]) || 'is-warning'
        },
        cssfalse(){
            const options = this.options
            return (options.css && options.css[false]) || ''
        },

        labeltrue(){
            const options = this.options
            return (options.label && options.label[true]) || 'Yes'
        },
        labelfalse(){
            const options = this.options
            return (options.label && options.label[false]) || 'No'
        },
    },
}
</script>
