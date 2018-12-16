<template>
<div>
    <div class="field">
        <div class="control">
            <label class="label">
                Requested quantity
            </label>
        </div>
        <div class="control">
            <input class="input" type="text" v-model="inquired.quantity" />
        </div>
    </div>
    <div class="field">
        <label class="label">
        </label>
        <div class="control">
            <label class="label">
                Do you have comments or questions about this product?
            </label>
        </div>
        <div class="control">
            <textarea class="textarea" v-model="inquired.comments" />
        </div>
    </div>
    <div class="field">

        <button v-if="productAdded(product.data.product_id)" 
            @click="removeProduct({product:product.data})"
            class="button is-danger is-small is-outlined ">
            Remove from RFQ
        </button>
        <button v-else title="Add to Request for Quotation" class="button is-small is-link" @click="addProductToRfq(product.data)">
            Add to RFQ
        </button>
        <button class="button is-small" @click="closeForm">Close</button>
    </div>
</div>
</template>

<script>
import {mapActions,mapGetters,mapState} from 'vuex'
export default {

    model: {
        event: 'hide'
    },

    data(){
        return {
            inquired: {}
        }
    },

    mounted(){
        if(this.productAdded(this.product.data.product_id)){
            let product = this.products.find(p=>{
                return p.product_id==this.product.data.product_id
            })
            if (product) {
                this.inquired = product
            }
        }
    },

    props: ['product', 'rfqshow'],

    computed:{
        ...mapGetters({
            productAdded: 'inquiry/productAdded',
        }),
        ...mapState({
            products: state=>state.inquiry.products
        }),
    },

    methods:{
        closeForm(){
            this.$emit('hide', false)
        },

        addProductToRfq(data){
            this.addProduct({product:data}).then(()=>{
                let product = this.products.find(p=>{
                    return p.product_id==this.product.data.product_id
                }) 
                if (product){
                    product.quantity = this.inquired.quantity
                    product.comments = this.inquired.comments
                    this.inquired = product
                }
            })
        },

        ...mapActions({
            addProduct: 'inquiry/addProduct',
            removeProduct: 'inquiry/removeProduct',
        }),

    },
}
</script>

<style>
</style>
