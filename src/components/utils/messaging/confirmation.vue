<template>
<modal :active.sync="active">
    <truefalse @confirmation="confirmation">
        <slot></slot>
    </truefalse>
</modal>
</template>

<script>
import modal from '@/components/utils/modal'
import truefalse from './truefalse'
export default {
    components: {modal, truefalse,},

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


