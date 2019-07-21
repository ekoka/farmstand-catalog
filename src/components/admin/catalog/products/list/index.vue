<template>
<div>
    <nav class="breadcrumb is-large has-arrow-separator">
        
        <ul>
            <li class="is-active"><a>Products</a></li>
        </ul>
    </nav>
    <div class="level">
        <div class="level-left">
            <div class="level-item is-hidden-tablet-only">
                <div class="field has-addons">
                    <form @submit.prevent="newSearch">
                    <p class="control">
                        <input class="input" v-model="search" placeholder="Product name, SKU…">
                    </p>
                    </form>
                    <p class="control">
                        <button @click="newSearch" class="button">Search</button>
                    </p>
                </div><!-- field -->
            </div><!-- level-item -->
            <div class="level-item">
                <div class="select">
                    <select>
                        <option> View products... </option>
                        <option> Currently available  </option>
                        <option> Currently not available </option>
                        <option> In archive </option>
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

    <product-table v-if="ready" :products="groupedProducts" />

    <div>
        <a @click="moreResults" class="button is-text">more...</a> 
    </div>
</div>
</template>

<script>
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import toPairs from 'lodash/fp/toPairs'
import every from 'lodash/fp/every'
import each from 'lodash/fp/each'
import intersection from 'lodash/fp/intersection'
import Vue from 'vue'
import {mapActions, mapMutations, mapState} from 'vuex'

export default {
    components: {
        productTable: ()=>import('./table'),
    },

    data(){
        return {
            last_product: null,

            search: null,
            ready: false,
            products: [],
        }
    },

    watch: {
        '$route': {
            handler(route){
                this.search = route.query.q
                this.products = []
                this.searchProduct()
            },
            immediate: true,
        },
    },

    computed:{
        ...mapState('admin/products', {
            productGroups: 'productGroups'
        }),

        groupedProducts(){
            return filter(p=>{
                return flow(
                    toPairs, // filters to tuple of (fname, flist)
                    map(([fname, flist]) => {
                        let valid = 1
                        if(flist.length){
                            valid = 0
                            valid = intersection(flist)(p.groups[fname] || []).length
                        }
                        return valid
                    }),
                    every(v=>{
                        return v
                    })
                )(this.productGroups)
            })(this.products)
        },
    },

    mounted(){
        this.getProductSchema().then(()=>{
            this.ready = true 
        }).then(()=>{
            this.enableGroups()
        })
    },

    destroyed(){
        this.disableGroups()
    },

    methods: {
        groupProduct(p){
            let valid = 1
            forIn(foptions, fname => {
                if(foptions.length){
                    valid = 0 
                    valid = intersection(foptions)(p.groups[fname] || []).length
                }
            })
            return valid
        },
        enableGroups(){
            // load group data in admin/products store
            this.getGroups().then(groups=>{
                const group_ids = groups.key('group_ids')
                return this.getGroupResources({group_ids})
            }).then(groups=>{
                this.setGroups({groups:map(f=>f.data)(groups)})
                // enable group component in sidebar
                this.showGroups({value:true})
            })
        },

        searchProduct({query, last_product}={}){
            const params = {
                q: query || this.search,
                last_product,
            }
            this.getProducts({params}).then(products=>{
                this.last_product = products.data.last_product
                this.has_more = products.data.has_more
                this.getProductResources({
                    product_ids:products.data.product_ids
                }).then(products=>{
                    this.products = [...this.products, ...map(p=>{
                        return p.data
                    })(products)]
                })
            })
        },

        newSearch(){
            this.resetSearch()
            const q = this.search
            this.$router.push({
                name: 'AdminProductList', query:{q}
            })
        },

        resetSearch(){
            this.has_more = false
            this.last_product = null
        },

        moreResults(){
            if(this.last_product){
                this.searchProduct({
                    query: this.search,
                    last_product: this.last_product,
                })
            }
        },

        disableGroups(){
            this.showGroups({value:false})
        },

        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProducts: 'api/getProducts',
            getProductResources: 'api/getProductResources',
            getGroups: 'api/getGroups',
            getGroupResources: 'api/getGroupResources',
        }),

        ...mapMutations({
            showGroups: 'admin/products/showGroups',
            setGroups: 'admin/products/setGroups',
        }),
    },
}
</script>
