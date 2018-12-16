<template>
<div>
    <top-nav/>

    <section class="section">
        <div class="columns">
            <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                <left-nav active="catalog"/>
                <filter-vertical v-for="fs,key in filterSets" :filterSet="fs" :key="key" v-model="filters[fs.key('filter_set_id')]"/>
                <smallcart/>
            </div>
            <div class="column">
                <product-table :products="products" :fieldNames="fieldNames" :fields="schema.fields"/>
            </div><!-- column -->
        </div><!-- columns -->
    </section><!-- section -->
</div>
</template>

<script>
import smallcart from './inquiry/smallcart'
import topNav from './elements/top-nav'
import leftNav from './elements/left-nav'
import filterVertical from './elements/filter-vertical'
import productTable from './elements/product-table'
import {mapActions, mapGetters, mapMutations} from 'vuex'
export default {
    components: { smallcart, topNav, leftNav, filterVertical, productTable,},
    data(){
        return {
            filters:{},
            filterSets: [],
            schema: {},
            categories:[],
            products: [],
        }
    },

    watch: {
        filters: {
            deep: true,
            handler(selected){
                let sets = Object.keys(selected).filter(s=>{
                    return selected[s].length 
                })
                let filters = Object.values(selected).reduce((ff, f)=>{
                    let rv = (ff && ff.length) ? new Set(ff.concat(f)) : new Set(f)
                    return [...rv]
                })
                this.getPublicProducts({params:{filters, sets}
                }).then(products=>{
                    this.products = products.embedded('products')
                })
            }
        },
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

    created(){

        this.getPublicRoot({
            tenant:this.$store.getters['subdomain'],
        }).then(()=>{
            return this.getPublicProductSchema()
        }).then(schema=>{
            this.schema = schema.data
        }).then(()=>{
            return this.getPublicProducts()
        }).then(products=>{
            this.products = products.embedded('products')
        }).then(()=>{
            return this.getPublicFilterSets()
        }).then(filterSets=>{
            this.filterSets = filterSets.embedded('filter_sets')
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
            getPublicFilterSets: 'api/getPublicFilterSets',
            addProduct: 'inquiry/addProduct',
            removeProduct: 'inquiry/removeProduct',
        }),
        //...mapGetters({
        //    productAdded: 'inquiry/productAdded',
        //}),
        ...mapMutations({
            //addProduct: 'inquiry/addProduct',
            //removeProduct: 'inquiry/removeProduct',
        }),
    },
}
</script>

