<template>
<div>
    <smallcart/>

    <h2 class="title">Catalog</h2>

    <template v-for="fs in filterSets">
    <h3 class="subtitle">{{fs.key('label')}}</h3>
    <ul>
        <li v-for="f in fs.key('filters')"> 
            <label>{{f.label}}<input v-model="filters" :value="{filter_id: f.filter_id, set_id:fs.key('filter_set_id')}" type="checkbox"></input></label>
        </li>
    </ul>
    <hr>
    </template>

    <h3 class="subtitle">Products</h3>
        <h4 class="subtitle is-5">{{fieldNames}}</h4>
    <ul>
        <li v-for="p in products"> {{fields(p)}} 
            <a v-if="productAdded(p.data.product_id)" @click="removeProduct({product:p.data})">remove</a>
            <a v-else @click="addProduct({product:p.data})">add</a> 
        </li>
    </ul>

    <hr>


</div>
</template>

<script>
import smallcart from './inquiry/smallcart'
import {mapActions, mapGetters, mapMutations} from 'vuex'
export default {
    components: { smallcart, } , 
    data(){
        return {
            filters:[],
            filterSets: [],
            schema: {},
            categories:[],
            products: [],
        }
    },

    watch:{
        filters: {
            deep:true,
            handler(selected){
                let filters = selected.map(f=>{return f.filter_id})
                let sets = {}
                selected.forEach(f=>{ sets[f.set_id] = f.set_id })
                sets = Object.keys(sets)
                this.getPublicProducts({params:{filters, sets}
                }).then(products=>{
                    this.products = products.embedded('products')
                })
            }
        }
    },

    computed:{
        fieldNames(){
            if (this.schema.fields){
                return this.schema.fields.filter(f=>{
                    return f
                }).join(' | ')
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

        this.cmpalias('router-link', 'rl')
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
            return product.key('fields').slice(0, this.fieldLength).map(f=>{
                return f
            }).join(' | ')
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

