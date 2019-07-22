<template>
<div class="rfq-smallcart" v-if="products.length">
    <div class="container">
        <div class="field has-addons">
            <div class="control">
                <span class="button has-background-dark has-text-warning is-static ">{{products.length}}</span>
            </div>
            <div class="control">
                <router-link class="button is-warning" :to="{name:'ShowcaseInquiry'}">
                    {{$t('rfq.review_and_submit_lbl')}}
                </router-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import {mapActions, mapState, mapMutations} from 'vuex'

export default {

    data(){
        return {
            products: [],
        }
    },

    watch:{
        inquiry: {
            handler(){
                this.getProductResources()
            },
            deep: true,
            immediate: true,
        },
    },

    computed:{
        ...mapState({
            inquiry: state=>state.inquiry.products
        })
    },

    methods:{
        getField(product, field){
            return find(f=>{
                return f.name==field
            })(product.fields)
        },

        getFieldValue(product, field){
            return this.getField(product, field).value
        },
        getProductResources(){
            const product_ids = map(p=>p.product_id)(this.inquiry)
            this.getPublicProductResources({
                product_ids
            }).then(products=>{
                this.products = map(p=>p.data)(products)
            })
        },
        ...mapMutations({
            removeProduct: 'inquiry/removeProduct',
        }),
        ...mapActions({
            getPublicProductResources: 'api/getPublicProductResources',
        })
    },

}
</script>


<style>
.rfq-smallcart {
    position: fixed;
    bottom: 40px;
    margin-top:30px;
}
</style>
