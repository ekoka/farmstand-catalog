<template>
<div>
    <div v-for="p in products" class="box">
        <p class="title is-4">{{p.name}}</p>
        <p class="is-uppercase subtitle is-5"># {{p.number}}</p>

        <div class="field">
            <div class="control">
                <label class="label">
                    {{$t('inquiry.requested_quantity_lbl')}}
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="p.inquiry.quantity" />
            </div><!-- control -->
        </div><!-- field -->

        <div class="field">
            <div class="control">
                <label class="label">
                    {{$t('inquiry.other_questions_lbl')}}
                </label>
            </div>
            <div class="control">
                <textarea class="textarea" v-model="p.inquiry.comments"/>
            </div>
        </div><!-- field -->

        <div class="control has-icons-left">
            <button class="button is-danger is-outlined is-small"
                @click="removeProduct({product_id:p.inquiry.product_id});loadInquiryProducts()">
                {{$t('inquiry.remove_item_btn')}}
            </button>
        </div><!-- control -->
    </div><!-- box -->
</div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import map from 'lodash/fp/map'
import fromPairs from 'lodash/fp/fromPairs'
import find from 'lodash/fp/find'
import compose from 'lodash/fp/compose'

export default {

    data(){
        return {
            products: [],
        }
    },

    computed:{
        ...mapState({
            inquiry: state=>state.inquiry.products
        }),
    },

    watch:{
        // listens to product addition/removal
        inquiry: {
            immediate: true,
            handler(nv){
                this.loadInquiryProducts()
                this.$emit('update:emptyCart', this.inquiry.length==0)
            },
        },

        // listens to modification to products
        '$store.state.inquiry.products': {
            deep: true,
            handler(v){
                // inform vuex-persistedstate of change
                this.pingMutation({})
            },
        },
    },

    methods:{
        loadInquiryProducts(){
            const inqProducts = compose(
                fromPairs,
                map(p=>[p.product_id, p]),
            )(this.inquiry)
            const product_ids = Object.keys(inqProducts)
            this.getPublicProductResources({product_ids}).then(products=>{
                this.products = map(p=>{
                    return {
                        name: find(f=>f.name=='name')(p.data.fields).value,
                        number: find(f=>f.name=='number')(p.data.fields).value,
                        inquiry: inqProducts[p.data.product_id],
                    }
                })(products)
            })
        },
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
            removeProduct: 'inquiry/removeProduct',
        }),
        ...mapActions({
            getPublicProductResources:'api/getPublicProductResources',
        })
    },

}
</script>
