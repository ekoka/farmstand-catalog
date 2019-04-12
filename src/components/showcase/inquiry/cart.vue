<template>
<div>
    <div v-for="p in products" class="box"> 

        <p class="subtitle is-5">{{p.fields[0]}} {{p.fields[1]}}</p> 

        <div class="field">
            <div class="control">
                <label class="label">Requested quantity</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="p.quantity" />
            </div><!-- control -->
        </div><!-- field -->

        <div class="field">
            <div class="control">
                <label class="label">Questions or comments</label>
            </div>
            <div class="control">
                <textarea class="textarea" v-model="p.comments"/>
            </div>
        </div><!-- field -->

        <div class="control has-icons-left">
            <button class="button is-danger is-outlined is-small" @click="removeProduct({product:p})">
                Remove
            </button>
        </div><!-- control -->

    </div><!-- box -->
</div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
export default {

    computed:{
        ...mapState({
            products: state=>state.inquiry.products
        })
    },

    watch:{
        products: {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        }
    },

    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
        ...mapActions({
            removeProduct: 'inquiry/removeProduct',
        })
    },

}
</script>

