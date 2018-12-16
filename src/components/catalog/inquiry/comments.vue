<template>
<div>
    <div class="control">
        <label class="label">Other comments or instructions</label>
    </div>
    <div class="control">
        <textarea class="textarea" v-model="$store.state.inquiry.comments"></textarea>
    </div>
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
        //this.cmpalias('router-link', 'rl')
    },
    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },
}
</script>

