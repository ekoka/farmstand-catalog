<template>
<div class="product-table">
    <div class="prod-header top-header">
        <product-table-header />
    </div>

    <div class="prod-body">
        <product-row v-for="product in products" :key='product.product_id' :product="product" />
    </div>

    <div v-if="products.length>10" class="prod-header bottom-header">
        <product-table-header />
    </div>
</div><!-- product-table -->
</template>

<script>
export default {
    components: {
        productRow: ()=>import  ( './row'),
        productTableHeader: ()=>import  ('./header'),
    },
    props: ['products'],

    watch:{
        products(){},
    }
}
</script>

<style>
.top-header .prod-row{
    border: 1px solid #dbdbdb;
    border-width: 0 0 2px;
    padding-bottom: 10px !important;
    margin-bottom: 12px !important;
}

.bottom-header .prod-row{
    border: 1px solid #dbdbdb;
    border-width: 2px 0 0;
    padding-top: 10px !important;
    margin-top: 12px !important;
}

.prod-body .prod-row:not(:last-child){
    border: 1px solid #dbdbdb;
    border-width: 0 0 1px;
}
/*  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);*/
</style>
