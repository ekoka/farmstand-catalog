<template>
<div>
    <h2 class="subtitle is-3">
        Edit Product
    </h2>
    <div class="columns">
        <div class="column is-8">
            <visibility v-model="product.visible"></visibility>
            <!--<info v-model="product" @productChanged="changed=true"></info>-->
            <template v-for="fieldSchema, k in productSchema.key('fields')">
                <field :schema="fieldSchema" v-model="product.data.fields[fieldSchema.name]"></field>
            </template>
            <filters></filters>
            <div class="form-controls" :class="{'is-hidden': !changed}">
                <button class="button is-info" @click="saveProduct">
                    Save your changes
                </button>
                <button class="button">
                    Cancel
                </button>
            </div>
        </div><!-- column -->
    </div><!-- columns -->
</div>
</template>

<script>
import Field from './field'
import Visibility from './visibility'
import VisibilityStatus from './visibility/status'
import Info from './product-info'
import Filters from './filters'
import {mapActions, mapGetters} from 'vuex'
export default {
    components: {Info, Visibility, Filters, VisibilityStatus, Field},
    props: ['product_id'],
    data(){
        return {
            changed: false,
            product:{
                data: {
                    fields:[]
                },
                //quantity_unit:null,
                //unit_price:null,
                available: null,
                visible: false,
                //filters: [],
            },
        }
    },

    created(){
        this.getProductSchema()
        //this.getFilterSets().then(filterSets=>{
        //    this.filterSets = filterSets.embedded('filter_sets')
        //    this.filterSets.forEach((f, i)=>{
        //        // initialize synced filters
        //        this.syncedFilterSets[i] = []
        //    })
        //})
    },

    mounted(){
        this.loadProduct(this.product_id)
    },

    watch:{
        '$route.params.product_id': {
            handler(product_id){
                this.loadProduct(product_id)
            }
        },
    },

    computed:{
        ...mapGetters({
            productSchema:'api/productSchema',
        }),
    },

    methods:{
        loadProduct(product_id){
            if(product_id){
                this.getProduct({product_id, partial:0}).then(resp=>{
                    Object.keys(resp.data).forEach(k=>{
                        this.product[k] = resp.data[k]
                    })
                    this.originalProductFilters = resp.embedded('filters').map(f=>{
                        return f.key('filter_id')
                    })
                })
            }
        },
        saveProduct(){
            if(this.product.product_id){
                return this.putProduct({
                    product_id:this.product.product_id, 
                    data:this.product
                })
            } else {
                return this.postProduct({
                    data:this.product
                }).then( product => {
                    this.$router.push({
                        name:'AdminEditProduct', 
                        params:{
                            product_id:product.key('product_id')
                        }
                    })
                })
            }
        },
        fieldName(idx){
            const defaultLabel = 'Unnamed Field'
            const rv = this.productSchema ? this.productSchema.data['fields'][idx]: null
            return rv || defaultLabel
        },

        updateFilters(filters, idx){
            this.syncedFilterSets[idx] = filters
            // merge all syncedFilterSets
            let d = {} 
            this.syncedFilterSets.forEach(fs=>{
                fs.forEach(f=>{
                    d[f] = null
                })
            })
            this.product.filters = Object.keys(d)
        },

        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProduct: 'api/getProduct',
            putProduct: 'api/putProduct',
            postProduct: 'api/postProduct',
            getFilterSets: 'api/getFilterSets',
        }),
    },
}
</script>

<style>
.form-controls {
    position: fixed;
    bottom: 10px;
    right: 20px;
}
</style>
