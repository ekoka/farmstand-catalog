<template>
<div>
    <h2>Edit Product</h2>
    <div v-for="f,i in Array(5)"><label>{{fieldName(i)}}<input v-model="product.fields[i]"/></label></div>

    <div><label> Quantity Unit (e.g. 100pcs/box)  <input v-model="product.quantity_unit"/></label> <label><input v-model="product.unit_price"/> Price (number only)</label></div>

    <div><label>Product is currently available <input type="checkbox" v-model="product.available"/></label>
    </div>

    <div><label>Show product in catalog <input type="checkbox" v-model="product.visible" /></label>
    </div>
    <template v-for="fs, i in filterSets">
        <multi-filters v-if="fs.key('multichoice')" :filterSet="fs" :productFilters="originalProductFilters" @update="updateFilters($event, i)"/>
    </template>

    <button @click="saveProduct">save</button> | <a>delete</a>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import MultiFilters from './product-multifilters'
export default {
    props: ['product_id'],
    components:{MultiFilters,},
    data(){
        return {
            filterSets:[],
            product:{
                fields:[],
                quantity_unit:null,
                unit_price:null,
                available: null,
                visible: false,
                filters: [],
            },
            syncedFilterSets: [],
            originalProductFilters: [],
        }
    },

    created(){
        this.cmpalias('router-link', 'rl')
        this.getProductSchema()
        this.getFilterSets().then(filterSets=>{
            this.filterSets = filterSets.embedded('filter_sets')
            this.filterSets.forEach((f, i)=>{
                // initialize synced filters
                this.syncedFilterSets[i] = []
            })
        })
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
                    data:this.product})
            } else {
                return this.postProduct({data:this.product}).then(product=>{
                    this.$router.push({name:'AdminEditProduct', params:{
                        product_id:product.key('product_id')
                    }})
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

