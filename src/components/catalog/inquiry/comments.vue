<template>
<div>
    <label>Other comments and/or instructions: 
        <textarea v-model="$store.state.inquiry.comments"></textarea>
    </label>
</div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {

    watch:{
        '$store.state.comments': {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        }
    },

    created(){
        this.cmpalias('router-link', 'rl')
    },
    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },
}
</script>

