<template>
<div class="message is-warning">
    <div class="message-body">
        <p class="is-size-5">
           This will remove this option's relationship to existing products and delete it. Do you wish to continue?
        </p>
        <div class="field is-grouped">
            <div class="control">
                <button @click="no" class="button">No</button>
            </div>
            <div class="control">
                <button @click="yes" class="button is-warning">Yes</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['answer'],

    methods:{
        yes(){
            this.$emit('answer', true)
            this.$emit('close')
        },
        no(){
            this.$emit('answer', false)
            this.$emit('close')
        },
    },
}
</script>
