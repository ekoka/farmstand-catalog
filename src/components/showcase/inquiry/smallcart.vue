<template>
<div class="rfq-smallcart" v-if="products.length">
    <ul>
        <li v-for="p in products"> 
            <div>
                {{p.fields[0]}} {{p.fields[1]}}
                <a @click="removeProduct({product:p})" class="button is-danger is-inverted">
                    <span class="icon"><i class="mdi mdi-close-circle"></i></span> 
                </a>
            </div>
        </li>
    </ul>
    <div><router-link class="button is-warning" :to="{name:'CatalogInquiry'}">Review and submit RFQ</router-link></div>
</div>
</template>

<script>
import {mapGetters, mapActions, mapState, mapMutations} from 'vuex'

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
            //removeProduct: 'inquiry/removeProduct',

            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
        ...mapActions({
            removeProduct: 'inquiry/removeProduct',
        })
    },

}
</script>


<style>
.rfq-smallcart {
    position: fixed;
    bottom: 20px; 
    margin-top: 30px;
}
</style>
