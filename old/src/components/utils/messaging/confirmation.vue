<template>
<modal :active.sync="active">
    <truefalse @confirmation="confirmation">
        <slot></slot>
    </truefalse>
</modal>
</template>

<script>
export default {
    components: {
        modal: ()=>import  ( '@/components/utils/modal'),
        truefalse: ()=>import  ( './truefalse'),
    },

    props: ['active'],

    methods:{
        confirmation(e){
            this.$emit('confirmation', e)
            // we want the modal to close after confirmation
            this.$emit('update:active', false)
        }
    },
}
</script>


