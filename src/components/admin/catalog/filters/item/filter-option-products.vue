<template>
<div class="is-active modal">
    <div @click="$emit('close')" class="modal-background"></div>
    <div class="card">

        <h4>Filter</h4>

        <h4>Products</h4>
        <div v-for="p, i in mutable.products">
            <label>
                <input type="checkbox" 
                    :value="p.product_id" 
                    v-model="mutable.selectedProducts">
                {{field(p, 'name')}}
            </label>
        </div>

        <button @click="saveSelection">save</button>
    </div><!-- card -->
</div><!-- modal -->
</template>

<script>
import _ from 'lodash/fp'
import {mapActions} from 'vuex' 

export default {
    props: ['filter', 'filter_option_id'],

    data(){
        return {
            filterOption: null,
            mutable:{
                selectedProducts:[],
                products: null,
                option: null,
            }
        }
    },

    mounted(){
        this.loadProducts()
        this.loadFilterOption()
    },

    methods:{
        loadFilterOption(){
            const url = this.filter.url('option', {
                filter_option_id:this.filter_option_id
            })
            this.getFilterOption({url}).then((option)=>{
                this.filterOption = option
                this.mutable.selectedProducts = this.filterOption.data.products
            })
        },

        loadProducts(){
            this.getProducts({refresh:true}).then(products=>{
                this.mutable.products = _.map(p=>{
                    return p.data
                })(products.embedded('products'))
            })
        },

        saveSelection(){
            const url = this.filterOption.url('products')
            const data = {'products': [...this.mutable.selectedProducts]}
            this.putFilterOptionProducts({url, data})
        },

        field(product, field){
            const f = _.find(f=>{
                return f.name==field
            })(product.data.fields)
            return f.value
        },

        ...mapActions({
            getProducts: 'api/getProducts',
            getFilterOption: 'api/getFilterOption',
            putFilterOptionProducts: 'api/putFilterOptionProducts',
        }),

    },

}
</script>
