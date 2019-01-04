<template>
<div>
    <h2 class="title is-3">Products</h2>
    <div> 
        <router-link :to="{name: 'AdminNewProduct'}">
            New Product
        </router-link> 
    </div>
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

    //created(){
    //    this.getProductSchema().then(()=>{
    //        return this.getProducts().then(products=>{
    //            this.products = products.embedded('products')
    //        })
    //    })
    //},

    //methods: {
    //    ...mapActions({
    //        getProductSchema: 'api/getProductSchema',
    //        getProducts: 'api/getProducts',
    //    }),
    //},
}
</script>
