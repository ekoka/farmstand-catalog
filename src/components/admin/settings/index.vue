<template>
<div>

    <rl :to="{name:'AdminFilters'}">Product Filters</rl> | <rl :to="{name:'AdminFields'}">Product Fields</rl>

    <router-view/>

</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {

    created(){
        this.cmpalias('router-link', 'rl')
    },
}
</script>
