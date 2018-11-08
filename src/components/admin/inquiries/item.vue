<template>
<div>
    <h3 class="subtitle">Inquiry</h3>
</div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    created(){
        this.cmpalias('router-link', 'rl')
    },

    methods:{
        ...mapActions({
        }),
    },
}
</script>

