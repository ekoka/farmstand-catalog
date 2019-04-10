<template>
<button class="button is-size-6 has-text-weight-bold" :class="buttonClass" :title="buttonTitle">
    <span class="icon is-size-5">
        <i class="iconify mdi" :data-icon="iconClass"></i>
    </span>
    <span class="is-size-6">
        <template v-if='visible'>This product is currently displayed in the catalog</template>
        <template v-else>This product is currently hidden</template>
    </span>
</button>
</template>

<script>
import Status from './status'
export default {
    props: ['visible'],
    computed:{
        buttonClass(){
            const visible = ' is-success'
            const invisible = ' is-warning'
            return this.visible?visible:invisible
        },
        iconClass(){
            const visible = 'mdi-eye'
            const invisible = 'mdi-eye-off-outline'
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
