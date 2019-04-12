<template>
<div class="card">
    <div class="card-content">
        <div class="level">
            <div class="level-left">
                <h4 class="title is-3">
                    {{groupData.label}}
                </h4>
            </div>
        </div>
        <h4 class="subtitle is-5">Products linked to option <span class="is-text-4 has-text-weight-semibold is-italic">{{groupOption.data.label}}</span></h4>
        <div class="columns is-multiline">
            <div v-for="p, i in mutable.products" class="column is-one-third">
                <div class="field">
                    <label class="">
                        <input type="checkbox" 
                            :value="p.product_id"
                            v-model="mutable.selectedProducts">
                        {{field(p, 'name')}}
                    </label>
                </div>
            </div>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <button class="button" @click="$emit('close')">
                    Close
                </button>
            </div>
            <div class="control">
                <button class="button is-link" @click="saveSelection">
                    Save
                </button>
            </div>
        </div>
    </div><!-- card-content -->
</div><!-- card -->
</template>

<script>
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import {mapActions} from 'vuex' 
import {HAL} from '@/utils/hal'

export default {
    props: ['group_option_id', 'optionUrl', 'groupData'],

    data(){
        return {
            groupOption: {data:{}},
            optionProductsUrl: null,
            mutable:{
                selectedProducts:[],
                products: null,
                option: null,
            }
        }
    },

    mounted(){
        this.loadProducts()
        if (this.optionUrl){
            this.loadGroupOption()
        }
    },

    methods:{
        loadGroupOption(){
            this.getGroupOption({url:this.optionUrl}).then((option)=>{
                this.groupOption = option.data
                this.optionProductsUrl = option.url('products')
                this.mutable.selectedProducts = option.data.products
            })
        },

        loadProducts(){
            this.getProducts().then(products=>{
                return this.getProductResources({
                    product_ids:products.data.product_ids
                })
            }).then(resources=>{
                this.mutable.products = map(p=>{
                    return p.data
                })(resources)
            })
        },

        saveSelection(){
            const url = this.optionProductsUrl
            const data = {'products': [...this.mutable.selectedProducts]}
            this.putGroupOptionProducts({url, data})
        },

        field(product, field){
            const f = find(f=>{
                return f.name==field
            })(product.fields)
            return f.value
        },

        ...mapActions({
            getProducts: 'api/getProducts',
            getProductResources: 'api/getProductResources',
            getGroupOption: 'api/getGroupOption',
            putGroupOptionProducts: 'api/putGroupOptionProducts',
        }),

    },

}
</script>
