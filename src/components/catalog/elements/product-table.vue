<template>
<div class="columns is-multiline">
    <div v-for="p, k in products" class="column is-8">
        <article class="box">
            <div class="media">
                <div class="media-left">
                    <img src="images/product.jpg" width="80">
                </div><!-- media-left -->

                <div class="media-content">
                    <p class="title is-5 is-spaced is-marginless">
                        <a href="#">
                            {{p.key('fields')[0]}}
                        </a>
                    </p>
                    <p class="subtitle is-marginless">
                        {{p.key('fields')[1]}}
                    </p>
                    <p class="content is-small">
                        {{p.key('fields')[2]}}
                        <br>
                        {{p.key('fields')[3]}}
                        <br>
                        {{p.key('fields')[4]}}
                        <div v-if="expandedProducts[p.data.product_id]" class="">
                            Expanded content
                        </div>
                        <button v-if="productAdded(p.data.product_id)" 
                            @click="showRfqForm(p.data.product_id)"
                            class="button is-warning is-small"
                            :class="{'is-invisible': rfqshow[p.data.product_id]}" >
                            Added to RFQ
                        </button>
                        <template v-else>
                            <button title="Add to Request for Quotation" class="button is-small is-link" :class="{'is-invisible': rfqshow[p.data.product_id]}" @click="showRfqForm(p.data.product_id)">
                                Add to RFQ
                            </button>
                            <button title="Ask a question" class="button is-small is-link is-outlined" :class="{'is-invisible': infoshow[p.data.product_id]}" @click="showInfoForm(p.data.product_id)">
                                Ask a question
                            </button>
                        </template>
                        <button class="button is-small" @click="toggleExpandProduct(p.data.product_id)"><span class="icon"><i class="mdi" :class="chevronUpDown(p.data.product_id)"></i></span></button>
                    </p>
                </div><!-- media-content -->
            </div><!-- media -->
            <div v-if="rfqshow[p.data.product_id]==true" class="media-content">
                <inquiry-form :product="p" v-model="rfqshow[p.data.product_id]"/>
            </div>
            <div v-if="infoshow[p.data.product_id]==true" class="media-content">
                <info-form :product="p"/>
            </div>
        </article>
    </div><!-- column -->
</div>
</template>

<script>
import Vue from 'vue'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import inquiryForm from './inquiry-form'
import infoForm from './info-form'
export default {

    props: ['products', 'fieldNames', 'fields'],

    data(){
        return {
            rfqshow:{},
            infoshow:{},
            expandedProducts: {},
        }
    },

    components: {
        inquiryForm, infoForm,
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
            productAdded: 'inquiry/productAdded',
        }),
    },

    methods: {
        fetchFields(product){
            let rv = [];
            let fields = product.key('fields')
            for (let i=0; i<this.fieldLength;i++){
                rv[i] = fields[i] || ''
            }
            return rv
        },
        chevronUpDown(product_id){
            let expanded = this.expandedProducts[product_id]
            return {
                'mdi-chevron-double-down': !expanded,
                'mdi-chevron-double-up': expanded,
            }
        },
        toggleExpandProduct(product_id){
            let state = this.expandedProducts[product_id] || false
            Vue.set(this.expandedProducts, product_id, !state)
        },

        showRfqForm(product_id){
            Vue.set(this.infoshow, product_id, false)
            Vue.set(this.rfqshow, product_id, true)
        },
    
        showInfoForm(product_id){
            Vue.set(this.rfqshow, product_id, false)
            Vue.set(this.infoshow, product_id, true)
        },


        ...mapActions({
            removeProduct: 'inquiry/removeProduct',
        }),
    },
}
</script>
