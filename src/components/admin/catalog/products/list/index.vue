<template>
<div>
    <h1 class="title">Products</h1>
    <div class="level">
        <div class="level-left">
            <div class="level-item is-hidden-tablet-only">
                <div class="field has-addons">
                    <p class="control">
                        <input class="input" placeholder="Product name, SKU…">
                    </p>
                    <p class="control">
                        <button class="button">Search</button>
                    </p>
                </div><!-- field -->
            </div><!-- level-item -->
            <div class="level-item">
                <div class="select">
                    <select>
                        <option> View all products </option>
                        <option> Currently in catalog </option>
                        <option> Currently not in catalog </option>
                        <option> Currently available </option>
                    </select>
                </div>
            </div><!-- level-item -->

        </div><!-- level-left -->

        <div class="level-right">
            <div class="level-item">
                <router-link class="button is-link" :to="{name:'AdminNewProduct'}">Add a new product</router-link>
            </div><!-- level-item -->
        </div><!-- level-right -->

    </div><!-- level -->

    <product-table v-if="ready" :products="filteredProducts" />
</div>
</template>

<script>
import {map,flow,filter,toPairs, every,each,intersection} from 'lodash/fp'
import Vue from 'vue'
import {mapActions, mapMutations, mapState} from 'vuex'
import productTable from './table'

//const _ = wrapperLodash

//mixin(_, {map, compose, filter, forIn, intersection})

export default {
    components: {
        productTable,
    },

    data(){
        return {
            ready: false,
            products: null,
        }
    },

    computed:{
        ...mapState('admin/products', {
            productFilters: 'productFilters'
        }),

        filteredProducts(){
            return filter(p=>{
                return flow(
                    toPairs, // filters to tuple of (fname, flist)
                    map(([fname, flist]) => {
                        let valid = 1
                        if(flist.length){
                            valid = 0
                            valid = intersection(flist)(p.filters[fname] || []).length
                        }
                        return valid
                    }),
                    every(v=>{
                        return v
                    })
                )(this.productFilters)
            })(this.products)
        },
    },

    mounted(){
        this.getProductSchema().then(()=>{
            this.getProducts().then(products=>{
                this.getProductDetails({
                    product_ids:products.data.product_ids
                }).then(products=>{
                    this.products = map(p=>{
                        return p.data
                    })(products)
                    this.ready = true 
                }).then(()=>{
                    this.enableFilters()
                }).catch(error=>{
                    console.log(error)
                })
            })
        })
    },

    destroyed(){
        this.disableFilters()
    },

    methods: {
        filterProduct(p){
            let valid = 1
            forIn(foptions, fname => {
                if(foptions.length){
                    valid = 0 
                    valid = intersection(foptions)(p.filters[fname] || []).length
                }
            })
            return valid
        },
        enableFilters(){
            // load filter data in admin/products store
            this.getFilters().then(filters=>{
                filters = map(f=>{
                    return f.data
                })(filters.embedded('filters'))
                this.setFilters({filters})
            })
            // enable filter component in sidebar
            this.showFilters({value:true})
        },

        disableFilters(){
            this.showFilters({value:false})
        },

        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProducts: 'api/getProducts',
            getProductDetails: 'api/getProductDetails',
            getFilters: 'api/getFilters',
        }),

        ...mapMutations({
            showFilters: 'admin/products/showFilters',
            setFilters: 'admin/products/setFilters',
        }),
    },
}
</script>
