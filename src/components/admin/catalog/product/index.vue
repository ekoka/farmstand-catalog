<template>
<div>
    <nav class="breadcrumb">
        <ul>
            <li>
                <router-link :to="{name:'AdminProducts'}">Catalog</router-link>
            </li>
            <li class="is-active">
                <a href="">Edit Product</a>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->
    <div class="columns">
        <div class="column is-8">
        <template v-if="ready">

            <visibility @toggled="toggleVisibility" 
                :visible="product.visible">
            </visibility>

            <div class="box">
                <field v-for="fieldSchema, key in productSchema.key('fields')"
                    :key="key" 
                    :schema="fieldSchema" 
                    v-model="product.data.fields[key]"
                    @updated="changed=true">
                </field>
            </div><!-- box -->

            <product-images></product-images>

            <filters></filters>

            <div class="form-controls" :class="{'is-hidden': !changed}">
                <button class="button is-link" :class="buttonClass" @click="saveProduct">
                    Save your changes
                </button>
                <button class="button">
                    Cancel
                </button>
            </div><!-- form-controls -->

        </template>
        </div><!-- column -->
    </div><!-- columns -->
</div>
</template>

<script>
import Field from './field'
import ProductImages from './images'
import Visibility from './visibility'
import Filters from './filters'
import {mapActions, mapGetters} from 'vuex'
export default {
    components: {Visibility, Filters, Field, ProductImages},
    props: ['product_id'],
    data(){
        return {
            // this flag is used to signal when the `product` model below has
            // been completely set and is ready to be used in the component. 
            // It avoids sub-components being loaded with undefined values.
            // It's useful because the data loading routine that are called in
            // the `mounted/created` event callbacks are called from within 
            // Promises that return before the data has had a chance to
            // actually load. As a result components may initially refer to
            // values that are undefined and it can lead to a variety of errors
            // that affect the overall behavior of the page.
            ready: false,

            // this flag signals that the data inside product.data.fields has
            // changed. It's primarily used to display the "Save/Cancel"
            // buttons. 
            changed: false,

            // this flag is used right before submitting the
            // data to the server. A computed value currently
            // watches it to disable the Save button, thus 
            // avoiding double-submits.
            submitted: false,

            product: {
                data: {
                    fields: [],
                },
                visible: false,
            },
        }
    },

    created(){
        //this.getProductSchema()
        //this.getFilterSets().then(filterSets=>{
        //    this.filterSets = filterSets.embedded('filter_sets')
        //    this.filterSets.forEach((f, i)=>{
        //        // initialize synced filters
        //        this.syncedFilterSets[i] = []
        //    })
        //})
    },

    mounted(){
        // we first load the product schema (we currently
        // have only one.
        this.getProductSchema().then(schema=>{
            // once it's loaded we load the product
            this.loadProduct(this.product_id)
        })
    },

    watch:{
        '$route.params.product_id': {
            handler(product_id){
                this.loadProduct(product_id)
            }
        },
    },

    computed:{
        buttonClass(){
            const loading = 'is-loading'
            const notLoading = ''
            //return this.submitted ? loading : notLoading
        },

        ...mapGetters({
            // we currently only have one "generic" schema, 
            // defined in a simple dictionary in the backend.
            productSchema:'api/productSchema',
        }),
    },

    methods:{
        loadProduct(product_id){
            // existing product
            //console.log(product_id)
            if(product_id){
                // Get the product's `resource` as a HAL object.
                // It's possibly loaded from cache, if not specified
                // otherwise with the `refresh:true` option.
                this.getProduct({
                    product_id, 
                    partial:0, 
                    refresh:false
                }).then((resource) => {
                    // the `HAL.data` property is a getter method 
                    // that returns a *copy* of the resource's original
                    // data, using the JSON.parse(JSON.stringify(obj)) 
                    // copy method.
                    // We can therefore safely overwrite the data in the 
                    // component, while keeping the main source pristine.
                    // This will be handy when the time comes to implement
                    // the "Cancel edit" feature.
                    Object.keys(resource.data).forEach((k) => {
                        // instead of directly assigning `product=resource`
                        // we rather assign each value to a `product`'s key.
                        // That's because the object `product` points to
                        // is already being watched and is reactive. If we
                        // assigned another object to the `product` variable
                        // we'd lose the reactivity.
                        this.product[k] = resource.data[k]
                    })
                    //this.originalProductFilters = resource.embedded('filters').map(f=>{
                    //    return f.key('filter_id')
                    //})

                    // See explanation on the `ready` flag in the `data`
                    // section.
                    // We set it to `true` from within the promise's block to
                    // ensure that processing on the product data has completed
                    // before it's set.
                    this.ready = true
                })
            } else {
            // new product
                this.productSchema.key('fields').map(s=>{
                    this.product.data.fields.push({
                        value: null,
                        name: s.name,
                        field_type: s.field_type,
                        searchable: s.searchable || false,
                        display: s.display || true,
                    })
                })
                // See explanation on the `ready` flag in the `data` section.
                // We set it to `true` from within this `else` block to stay
                // consistent with the way it's set within the `if` block.
                this.ready = true
            }
        },

        saveProduct(){
            this.submitted = true
            if(this.product.product_id){
                return this.putProduct({
                    product_id:this.product.product_id, 
                    data:this.product
                })
            } else {
                return this.postProduct({
                    data:this.product
                }).then( product => {
                    this.$router.push({
                        name:'AdminEditProduct', 
                        params:{
                            product_id:product.key('product_id')
                        }
                    })
                })
            }
        },
        fieldName(idx){
            const defaultLabel = 'Unnamed Field'
            const rv = this.productSchema ? this.productSchema.data['fields'][idx]: null
            return rv || defaultLabel
        },

        updateFilters(filters, idx){
            this.syncedFilterSets[idx] = filters
            // merge all syncedFilterSets
            let d = {} 
            this.syncedFilterSets.forEach(fs=>{
                fs.forEach(f=>{
                    d[f] = null
                })
            })
            this.product.filters = Object.keys(d)
        },

        toggleVisibility(value){
            if(this.product.product_id){
                const data = {
                    visible: value
                }
                this.patchProduct({
                    data, 
                    product_id: this.product.product_id
                }).then(()=>{
                    // if we got here then maybe all was well
                    this.product.visible = value
                }).catch(error=>{
                    console.log(error)
                    // a message should be emitted here letting user
                    // know that they should try again later. e.g. 
                    // network problems.
                })
            }
        },

        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProduct: 'api/getProduct',
            putProduct: 'api/putProduct',
            patchProduct: 'api/patchProduct',
            postProduct: 'api/postProduct',
            getFilterSets: 'api/getFilterSets',
        }),
    },
}
</script>

<style>
.form-controls {
    position: fixed;
    top: 150px;
    right: 60px;
}
</style>
