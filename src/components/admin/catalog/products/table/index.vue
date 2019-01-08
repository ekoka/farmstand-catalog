<template>
<div class="product-table is-fullwidth">
    <div class="prod-header top-header">
        <product-table-header />
    </div>

    <div class="prod-body">
        <product-row v-for="product,key in products" :key='key' :product="product" />
    </div>

    <div class="prod-header bottom-header">
        <product-table-header />
    </div>
</div><!-- product-table -->
</template>

<script>
import productRow from './row'
import productTableHeader from './header'
export default {
    components: {productRow, productTableHeader},
    model: {
        prop: ['products'], 
        event: 'updated',
    },
    props: ['products'],
}
</script>

<style>
.top-header .prod-row{
    border: 1px solid #dbdbdb;
    border-width: 0 0 2px;
    padding-bottom: 10px;
    margin-bottom: 12px;
}

.bottom-header .prod-row{
    border: 1px solid #dbdbdb;
    border-width: 2px 0 0;
    padding-top: 10px;
    margin-top: 12px;
}

.prod-body .prod-row:not(:last-child){
    border: 1px solid #dbdbdb;
    border-width: 0 0 1px;
}
/*  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);*/
</style>
