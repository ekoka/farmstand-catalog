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

    <product-table v-if="ready" v-model="products" />

</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import productTable from './table'
export default {
    components: {
        productTable
    },

    data(){
        return {
            ready: false,
            products: null,
        }
    },

    mounted(){
        this.getProductSchema().then(()=>{
            return this.getProducts().then((products) => {
                this.products = products.embedded('products').map((p) => {
                    return p.data
                })
                this.ready = true
            })
        })
    },

    methods: {
        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProducts: 'api/getProducts',
        }),
    },
}
</script>
