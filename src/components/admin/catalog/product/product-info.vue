<template>
<div class="box">
    <h3 class="subtitle">Basic information</h3>
    <div class="field">
        <div class="control">
            <label class="label">Product number</label>
        </div><!-- control -->
        <div class="control">
            <input class="input" v-model="mutable.data.fields.number" placeholder="e.g. SKU or Reference number">
        </div>
    </div><!-- field -->
    <div class="field">
        <div class="control">
            <label class="label">Name</label>
        </div><!-- control -->
        <div class="control">
            <input class="input" v-model="mutable.product.data.name" placeholder="Name of product"/>
        </div>
    </div><!-- field -->
    <div class="field">
        <label class="label">Product is currently available</label>
        <label class="radio">
            <input name="available" v-model="mutable.product.available" :value="true" type="radio"> Yes
        </label>
        <label class="radio">
            <input name="available" :value="false" v-model="mutable.product.available" type="radio"> No
        </label>
    </div><!-- field -->
    <div class="field">
        <div class="control">
            <label class="label">Description</label>
        </div>
        <div class="control">
            <textarea class="textarea" v-model="mutable.product.data.description">
            </textarea>
        </div>
    </div>
</div><!-- box -->
</template>

<script>
// todo: turn product.data into product.data.fields
export default {
    model: {
        prop: 'product',
        event: 'productChanged',
    },
    props: ['product', 'schema'],
    data(){
        return {
            mutable: this.product
        }
    },

    watch:{
        'mutable.product': {
            deep: true,
            handler(val){
                this.updateProduct()
            },
        },
    },

    methods: {
        updateProduct(){
            this.$emit('productChanged', this.mutable.product)
        }
    },
}
</script>
