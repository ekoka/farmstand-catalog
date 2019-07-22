<template>
<div>
    <top-nav/>
    <section class="section">
        <div class="columns">
            <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                <!--<left-nav active="inquiry"/>-->
            </div>
            <div class="column">
                <div class="columns is-multiline">
                    <cart class="column is-8"/>
                    <addresses class="column is-8"/>
                    <comments class="column is-8"/>
                </div>
                <button v-if="inquiry.products.length" class="button is-link" @click="sendInquiry">{{$t('rfq.send_inquiry_btn')}}</button>
                <p v-else class="subtitle is-4">{{$t('rfq.empty_inquiry_lbl')}}</p>
            </div><!-- column -->
        </div><!-- columns -->
    </section><!-- section -->
</div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import map from 'lodash/fp/map'

export default {
    components: {
        topNav: ()=>import  ( '../elements/top-nav'),
        leftNav: ()=>import  ( '../elements/left-nav'),
        cart: ()=>import  ( './cart'),
        addresses: ()=>import  ( './addresses'),
        comments: ()=>import  ( './comments'),
    },


    computed:{
        ...mapState({
            inquiry: state=>state.inquiry
        }),
        inquiryView(){
            return {
                products: this.inquiry.products,
                shipping_address: this.inquiry.shippingAddress,
                billing_address: this.inquiry.billingAddress,
                comments: this.inquiry.comments,
            }
        },
    },

    methods:{

        sendInquiry(){
            this.postInquiry({data:this.inquiryView})
        },

        ...mapActions({
            postInquiry: 'api/postPublicInquiry'
        })
    },

}
</script>

