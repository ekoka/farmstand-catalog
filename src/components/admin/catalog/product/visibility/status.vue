<template>
<span class="tag is-outlined is-medium" :class="background">
    <span class="">
        <template v-if="!visible">
            This product is currently not visible in the catalog
        </template>
        <template v-else>
            This product is currently visible in the catalog
        </template>
    </span>
</span>
</template>

<script>
export default {
    props: ['visible'],
    computed:{
        background(){
            const visible = 'has-background-success has-text-white'
            const invisible = 'has-background-warning has-text-grey-dark'
            return this.visible?visible:invisible
        }
    }
}
</script>
