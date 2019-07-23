<template>
<div>
    <div class="control">
        <label class="label">{{$t('inquiry.other_instructions_lbl')}}</label>
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
            immediate: true,
            handler(nv){
                // for vuex-persistedstate
                this.pingMutation({})
                const c = this.$store.state.inquiry.comments
                const notEmpty = c && c.trim() && true
                this.$emit('update:emptyComments', !notEmpty)
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

