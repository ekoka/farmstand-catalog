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
        '$store.state.inquiry.comments': {
            deep: true,
            handler(nv){
                // for vuex-persistedstate
                this.pingMutation({})
            },
        }
    },

    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },
}
</script>

