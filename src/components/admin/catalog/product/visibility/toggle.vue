<template>
<button class="button is-size-6 has-text-weight-bold" :class="buttonClass" :title="buttonTitle">
    <span class="icon is-size-5">
        <i class="mdi" :class="iconClass"></i>
    </span>
    <span class="is-size-6">
        <template v-if='visible'>Hide</template>
        <template v-else>Show</template>
    </span>
</button>
</template>

<script>
import Status from './status'
export default {
    props: ['visible'],
    computed:{
        buttonClass(){
            const visible = ''
            const invisible = ''
            return this.visible?visible:invisible
        },
        iconClass(){
            const visible = 'mdi-eye-off-outline'
            const invisible = 'mdi-eye'
            return this.visible?visible:invisible
        },
        buttonTitle(){
            const visible = 'Do not show this product in catalog'
            const invisible = 'Make this product visible in catalog'
            return this.visible?visible:invisible
        },
    }
}
</script>
