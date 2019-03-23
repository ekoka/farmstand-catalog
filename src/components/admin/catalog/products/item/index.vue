<template>
<div>
    <nav class="breadcrumb">
        <ul>
            <li>
                <router-link :to="{name:'AdminProductList'}">Products</router-link>
            </li>
            <li class="is-active">
                <a href="">Edit Product</a>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->
    <div>
        <div class="level">
            <div class="level-left">
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button class="button">
                        Cancel
                    </button>
                    <button class="button is-link" :class="buttonClass" @click="saveProduct">
                        Save your changes
                    </button>
                </div><!-- level-item -->
            </div><!-- level-right -->
        </div><!-- level -->


        <div>
        <template v-if="ready">

            <!--
            <visibility @toggled="toggleVisibility" 
                :visible="mutable.product.data.visible">
            </visibility>
            -->

            <div class="box">
                <template v-if="product_id">
                    <field v-for="field, i in mutable.product.fields"
                        :key="i" 
                        :schema="getFieldSchema(field)" 
                        v-model="mutable.product.fields[i]"
                        @updated="changed=true">
                    </field>
                </template>
                <template v-else>
                    <field v-for="schema, i in this.productSchema.key('fields')"
                        :key="i" 
                        :schema="schema" 
                        v-model="mutable.product.fields[i]"
                        @updated="changed=true">
                    </field>
                </template>
            </div><!-- box -->

            <product-images 
                :product_id="product_id"
                :images.sync="mutable.images"
                @changed="changed=true">
            </product-images>

            <filters :product="mutable.product" 
                :productFilters="mutable.filters" 
                @productFilters:update="updateFilters">
            </filters>

        </template>
        </div><!-- column -->
    </div><!-- columns -->
</div>
</template>

<script>
import Field from './field'
import ProductImages from './images'
//import Visibility from './visibility'
import Filters from './filters'
import {mapActions, mapGetters} from 'vuex'
import {unset,find} from 'lodash/fp'
export default {
    components: {Filters, Field, ProductImages},
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

            // this flag signals that the data inside product.fields has
            // changed. It's primarily used to display the "Save/Cancel"
            // buttons. 
            changed: false,

            // this flag is used right before submitting the
            // data to the server. A computed value currently
            // watches it to disable the Save button, thus 
            // avoiding double-submits.
            submitted: false,



            mutable: {
                product: {
                    fields: [],
                    //visible: false,
                },
                images: [],
                filters: [],
            },
        }
    },

    watch:{
        '$route.params.product_id': {
            handler(product_id){
                this.getProductSchema().then(schema=>{
                    // once it's loaded we load the product
                    this.loadProduct(this.product_id)
                })
                
            },
            immediate: true,
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
        getFieldSchema(f){
            // first try to find schema based on name of field
            let schema = find(s=>{
                return s.name==f.name
            })(this.productSchema.key('fields'))
            if (schema){
                return schema
            }

            // then try to find schema based on field type
            schema = find(s=>{
                return s.field_type==f.field_type
            })
            return schema
        },

        loadProduct(product_id){
            // existing product
            if(product_id){
                // Get the product's `resource` as a HAL object.
                // It's possibly loaded from cache, if not specified
                // otherwise with the `refresh:true` option.
                this.getProduct({
                    product_id, 
                }).then(product => {
                    // the `HAL.data` property is a getter method 
                    // that returns a *copy* of the resource's original
                    // data, using the JSON.parse(JSON.stringify(obj)) 
                    // copy method.
                    // We can therefore safely overwrite the data in the 
                    // component, while keeping the main source pristine.
                    // This will be handy when the time comes to implement
                    // the "Cancel edit" feature.
                    this.mutable.product = product.data
                    this.mutable.filters = this.mutable.product.filters
                    delete this.mutable.product.filters 
                    //Object.keys(resource.data).forEach((k) => {
                    //    // instead of directly assigning `product=resource`
                    //    // we rather assign each value to a `product`'s key.
                    //    // That's because the object `product` points to
                    //    // is already being watched and is reactive. If we
                    //    // assigned another object to the `product` variable
                    //    // we'd lose the reactivity.
                    //    this.product[k] = resource.data[k]
                    //})
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
                    this.mutable.product.fields.push({
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
            const product_id = this.mutable.product.product_id
            // 
            const data = unset('images', this.mutable.product)
            const images = this.mutable.images
            const filters = this.mutable.filters

            if(product_id){
                return this.putProduct({
                    product_id, 
                    data
                }).then(()=>{
                    this.putProductFilterOptions({
                        product_id,
                        data:{filters},
                    })
                    this.putProductImages({
                        product_id,
                        images
                    })
                })
            } else {
                return this.postProduct({
                    data
                }).then(product=>{
                    this.putProductFilterOptions({
                        product_id:product.data.product_id,
                        data:{filters},
                    })
                    this.putProductImages({
                        product_id:product.data.product_id,
                        images
                    })
                    return product.data.product_id
                }).then(product_id=>{
                    this.redirectToProductPage({
                        product_id
                    })
                })
            }
        },

        redirectToProductPage({product_id}){
            this.$router.push({
                name:'AdminEditProduct', 
                params:{
                    product_id
                }
            })
        },

        fieldName(idx){
            const defaultLabel = 'Unnamed Field'
            const rv = this.productSchema ? this.productSchema.data['fields'][idx]: null
            return rv || defaultLabel
        },

        updateFilters(filters){
            this.changed = true
            this.$set(this.mutable, 'filters', filters)
        },

        //toggleVisibility(value){
        //    if(this.mutable.product.product_id){
        //        const data = {
        //            name:visible, 
        //            value
        //        }
        //        this.patchProduct({
        //            data, 
        //            product_id: this.mutable.product.product_id
        //        }).then(()=>{
        //            // if we got here then maybe all was well
        //            this.mutable.product.data.visible = value
        //        }).catch(error=>{
        //            console.log(error)
        //            // a message should be emitted here letting user
        //            // know that they should try again later. e.g. 
        //            // network problems.
        //        })
        //    } else {
        //        this.mutable.product.data.visible = value
        //    }
        //},

        ...mapActions({
            getProductSchema: 'api/getProductSchema',
            getProduct: 'api/getProduct',
            putProduct: 'api/putProduct',
            patchProduct: 'api/patchProduct',
            postProduct: 'api/postProduct',
            getFilterSets: 'api/getFilterSets',
            putProductImages: 'api/putProductImages',
            deleteProduct: 'api/deleteProduct',
            putProductFilterOptions: 'api/putProductFilterOptions',
        }),
    },
}
</script>
