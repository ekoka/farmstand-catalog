<template>
<div>
    <!--<div class="level">
        <div class="level-left"></div>
        <div class="level-right">
            <div class="level-item has-text-weight-semibold">
                {{$t('show_all_btn')}} 
            </div>
            <div class="level-item">
                <a>
                    <span class="icon has-text-warning">
                        <i class="iconify mdi mdi-18px" 
                            data-icon="mdi-star"></i>
                    </span>{{$t('show_favorites_btn')}}
                </a>
            </div>
            <div class="level-item">
                <a class="">
                    <span class="icon has-text-danger">
                        <i class="iconify mdi" data-icon="mdi-minus-circle"></i>
                    </span>{{$t('show_hidden_btn')}}
                </a>
            </div>
        </div>
    </div>-->
    <article class="box" v-for="p,k in products">
        <div class="media">
            <div class="media-left">
                <img :src="image(p, 'thumb')" width="80">
            </div><!-- media-left -->

            <div class="media-content">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="title is-5 is-spaced is-marginless">
                                <a href="#">{{getFieldValue(p, 'name')}}</a>
                            </p>
                        </div>
                    </div>
                    <div class="level-left">
                        <div class="level-item">
                            <notification :eventName="'message-sent-'+p.product_id" :defaults="{position: 'relative'}">
                            </notification>
                        </div>
                    </div>

                    <div class="level-right">
                        <div class="level-item">
                            <div v-if="productAdded(p.product_id)" class="field has-addons">
                                <button
                                    class="button is-warning is-small"
                                    @click="toggleRfqPane(p.product_id)">
                                    {{$t('added_to_rfq_btn')}}
                                </button>
                                <button class="button is-danger is-inverted is-small" @click="removeProduct({product_id:p.product_id})">
                                    <span class="icon is-small">
                                        <i class="iconify mdi" data-icon="mdi-close"></i>
                                    </span>
                                </button>
                            </div>
                            <button v-else
                                title="Inquire about this product" 
                                class="button is-link is-outlined is-small"
                                @click="toggleRfqPane(p.product_id)">
                                <span>{{$t('inquire_btn')}}</span>
                            </button>
                        </div><!-- level-item -->
                    </div><!-- level-right -->
                </div><!-- level -->
                <div class="level">
                    <div class="level-left">
                        <p class="subtitle is-marginless is-italic">
                            # {{getFieldValue(p, 'number')}}
                        </p>
                    </div><!-- level-left -->
                    <div class="level-right">
                    </div><!-- level-right -->
                </div>

            </div><!-- media-content -->
        </div><!-- media -->

        <inquiry-form 
            v-if="rfqPane[p.product_id]"
            :product_id="p.product_id" 
            @hide="rfqPane[p.product_id]=false">
        </inquiry-form>

        <div v-if="expandedProducts[p.product_id]">
            <p>{{getFieldValue(p,'description')}}</p>
        </div>

        <div class="level">
            <div class="level-left">
                <!--<div class="level-item">
                    <button class="button is-white is-small">
                        <span class="icon has-text-warning">
                            <i class="iconify mdi mdi-18px" 
                                data-icon="mdi-star"></i>
                        </span> 
                        <span>
                            {{$t('add_to_favorite_btn')}}
                        </span>
                    </button>
                </div>
                <div class="level-item">
                    <a class="button is-white is-small">
                        <span class="icon has-text-danger is-small">
                            <i class="iconify mdi" data-icon="mdi-minus-circle-outline"></i>
                        </span>
                        <span>
                            {{$t('hide_btn')}}
                        </span>
                    </a>
                </div>-->
            </div><!-- level-left -->
            <div class="level-right">
                <div class="level-item">
                    <a class="is-size-7 " @click="toggleExpandProduct(p.product_id)">
                        <template v-if="expandedProducts[p.product_id]">
                        <span>
                            {{$t('less_details_btn')}}
                        </span>
                        <span class="icon">
                            <i class="iconify mdi" data-icon="mdi-chevron-double-up"></i>
                        </span>
                        </template>
                        <template v-else>
                        <span>
                            {{$t('more_details_btn')}}
                        </span>
                        <span class="icon">
                            <i class="iconify mdi" data-icon="mdi-chevron-double-down"></i>
                        </span>
                        </template>
                    </a>
                </div><!-- level-item -->
            </div>
        </div><!-- level -->
    </article>
</div>
</template>

<script>
import find from 'lodash/fp/find'
import Vue from 'vue'
import {mapGetters, mapState, mapMutations} from 'vuex'

export default {

    props: ['products', 'fieldNames', 'fields'],

    data(){
        return {
            activeTab: {},
            rfqPane:{},
            expandedProducts: {},
        }
    },

    components: {
        inquiryForm: ()=>import  ( './inquiry-form'),
        notification: ()=>import  ( '@/components/utils/messaging/notification'),
    },

    computed:{
        fieldLength(){
            if (this.fields){
                return this.fields.filter(f=>{
                    return f
                }).length
            }
            return 0
        },
        ...mapGetters({
            productAdded: 'inquiry/productAdded'
        }),
        //...mapState({
        //    inqProducts: state=>state.inquiry.products,
        //}),
    },

    methods: {
        image(product, format){
            if(product.images.length){
               return product.images[0]['1:1'][format]
            }
        },
        getField(product, field){
            return find(f=>{
                return f.name==field
            })(product.fields)
        },

        getFieldValue(product, field){
            return this.getField(product, field).value
        },

        chevronUpDown(product_id){
            const expanded = this.expandedProducts[product_id]
            return {
                'mdi-chevron-double-down': !expanded,
                'mdi-chevron-double-up': expanded,
            }
        },

        toggleExpandProduct(product_id){
            const state = this.expandedProducts[product_id] || false
            this.$set(this.expandedProducts, product_id, !state)
        },

        toggleRfqPane(product_id){
            this.$set(this.rfqPane, product_id, !this.rfqPane[product_id])
        },

        ...mapMutations({
            removeProduct: 'inquiry/removeProduct',
        }),
    },
}
</script>
