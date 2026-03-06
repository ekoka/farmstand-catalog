
<template>
<div>
    <nav class="breadcrumb">
        <ul>
            <li>
                <router-link :to="{name:'AdminProductList'}">Products</router-link>
            </li>
            <li class="is-active">
                <a href="">Edit JSON</a>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->
    <div>
        <div class="level">
            <div class="level-left">
            </div>
            <div class="level-right">
                <div class="level-item">
                    <router-link class="button is-link" :to="{name: 'AdminEditProduct', params: {product_id}}">
                        Edit
                    </router-link>
                    <button class="button">
                        Cancel
                    </button>
                    <button class="button is-link" :class="buttonClass" @click="saveProductJson">
                        Save your changes
                    </button>
                </div><!-- level-item -->
            </div><!-- level-right -->
        </div><!-- level -->

        <div class="box">
            <textarea class="textarea" v-model="productJson"></textarea>
        </div><!-- box -->
    </div><!-- columns -->
</div>
</template>

<script>
//import Visibility from './visibility'
import {mapActions, mapGetters} from 'vuex'
import unset from 'lodash/fp/unset'
import find from 'lodash/fp/find'
export default {
    props: ['product_id'],
    data(){
        return {
            productJson: null,
        }
    },

    watch:{
        '$route.params.product_id': {
            handler(product_id){
                this.loadProductJson(this.product_id)
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

        loadProductJson(product_id){
            if(product_id){
                this.getProductJson({product_id,}).then(data => {
                    this.productJson = data.json
                })
            } 
        },

        saveProductJson(){
            return this.putProductJson({
                product_id: this.product_id, 
                data: JSON.parse(this.productJson),
            })
        },

        ...mapActions({
            getProductJson: 'api/getProductJson',
            putProductJson: 'api/putProductJson',
        }),
    },
}
</script>
