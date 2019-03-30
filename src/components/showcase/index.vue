<template>
<div>
    <top-nav/>

    <section class="section">
        <div class='container'>
            <div class="columns">
                <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                    <p class="subtitle is-6">Narrow results by</p>
                    <!--<left-nav active="catalog"/>-->
                    <filter-vertical v-for="f,i in filters" :key="i" :filter="f"/>
                    <smallcart/>
                </div>
                <div class="column">
                    <product-table 
                        :products="products" 
                        :fieldNames="fieldNames" 
                        :fields="schema.fields"/>
                </div><!-- column -->
            </div><!-- columns -->
        </div><!-- container -->
    </section><!-- section -->
</div>
</template>

<script>
import {map} from 'lodash/fp'
import smallcart from './inquiry/smallcart'
import topNav from './elements/top-nav'
import leftNav from './elements/left-nav'
import filterVertical from './elements/filter-vertical'
import productTable from './elements/product-table'
import {mapActions, mapGetters} from 'vuex'

export default {
    components: { 
        smallcart, topNav, leftNav,
        filterVertical, productTable,},

    data(){
        return {
            filters:{},
            schema: {},
            categories:[],
            products: [],
        }
    },

    watch: {
        //filters: {
        //    deep: true,
        //    handler(selected){
        //        let filters = Object.keys(selected).filter(s=>{
        //            return selected[s].length 
        //        })
        //        let options = Object.values(selected).reduce((ff, f)=>{
        //            let rv = (ff && ff.length) ? new Set(ff.concat(f)) : new Set(f)
        //            return [...rv]
        //        })
        //        this.getPublicProducts({params:{options, filters}
        //        }).then(products=>{
        //            this.products = products.keys('products')
        //        })
        //    }
        //},
    },

    computed:{
        fieldNames(){
            if (this.schema.fields){
                return this.schema.fields.filter(f=>{
                    return f
                })
            }
            return []
        },

        fieldLength(){
            if (this.schema.fields){
                return this.schema.fields.filter(f=>{
                    return f
                }).length
            }
            return 0
        },
        ...mapGetters({
            productAdded: 'inquiry/productAdded',
        }),
    },

    mounted(){

        this.getPublicRoot().then(()=>{
            return this.getPublicProductSchema()
        }).then(schema=>{
            this.schema = schema.data
        }).then(()=>{
            return this.getPublicProducts()
        }).then(products=>{
            const product_ids = products.key('products')
            return this.getPublicProductResources({product_ids})
        }).then(products=>{
            this.products = map(p=>{
                return p.data
            })(products)
        }).then(()=>{
            return this.getPublicFilters()
        }).then(filters=>{
            this.filters = map(f=>f.data)(filters.embedded('filters'))
        })
    },

    methods: {
        fields(product){
            let rv = [];
            let fields = product.key('fields')
            for (let i=0; i<this.fieldLength;i++){
                rv[i] = fields[i] || ''
            }
            return rv
            //return product.key('fields').slice(0, this.fieldLength).map(f=>{
            //    return f || 'none'
            //})
            //return product.key('fields').map(f=>{
            //})
        },
        
        ...mapActions({
            getPublicRoot:'api/getPublicRoot',
            getPublicProducts:'api/getPublicProducts',
            getPublicProductSchema:'api/getPublicProductSchema',
            getPublicProductResources:'api/getPublicProductResources',
            getPublicFilters: 'api/getPublicFilters',
            addProduct: 'inquiry/addProduct',
            removeProduct: 'inquiry/removeProduct',
        }),
    },
}
</script>

