<template>
<div>
    <h3 class="subtitle">Products</h3>
    <ul>
        <li>{{fieldNames}}</li>
        <li v-for="p in products"> {{p.key('fields')[0]}} | {{p.key('fields')[1]}} | {{p.key('fields')[2]}} <rl :to="{name: 'AdminEditProduct', params:{product_id: p.key('product_id')}}">edit</rl> <a>archive</a> </li>
    </ul>

    <div> <rl :to="{name: 'AdminAddProduct'}">Add Product</rl> </div>

    <br>

    <label>Import products from csv file. (<a>learn more...</a>)<input type="file"></label>



    <template v-if="filterSets">
    <template v-for="fs in filterSets.embedded('filter_sets')">

        <hr>

        <h3 class="subtitle">Filter by {{fs.key('label')}}</h3>
        <ul>
            <li v-for="f in filtersData(fs)">
                <a @click="applyFilter(f.filter_id)" >{{f.label}}</a>
            </li>
        </ul>

    </template>
    </template>


    <br>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {

    data(){
        return {
            products: [],
        }
    },

    created(){
        this.cmpalias('router-link', 'rl')
            this.getProductSchema().then(()=>{
                return this.getProducts().then(products=>{
                    this.products = products.embedded('products')
                })
            }).then(()=>{
                this.getFilterSets()
            })
    },

    computed:{
        ...mapGetters({
            filterSets: 'api/filterSets',
            productSchema:'api/productSchema',
        }),

        fieldNames(){
            let fields = []

            if (this.productSchema){
                fields = this.productSchema.data.fields.filter(field=>{
                    return field
                })
            }
            return fields.join(' | ')
        },
    },

    methods: {
        filtersData(filterSet){
            return filterSet.embedded('filters').map(f=>{
                return f.data
            })
        },
        applyFilter(filter_id){
        },
        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getFilterSets: 'api/getFilterSets',
            getProducts: 'api/getProducts',
        }),
    },
}
</script>
