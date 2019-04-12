<template>
<div>
    <top-nav/>

    <section class="section">
        <div class="columns">
            <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                <left-nav active="inquiry"/>
            </div>
            <div class="column">
                <div class="columns is-multiline">
                    <cart class="column is-8"/>
                    <addresses class="column is-8"/>
                    <comments class="column is-8"/>
                </div>
                <button class="button" @click="sendInquiry">Send Inquiry</button>
            </div><!-- column -->
        </div><!-- columns -->
    </section><!-- section -->
</div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

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
    },

    methods:{

        sendInquiry(){
            const data = {}
            data['products'] = this.inquiry.products.map(p=>{
                let rv = {...p}
                delete rv.fields
                return rv
            })
            data['shipping_address'] = this.inquiry.shippingAddress
            data['billing_address'] = this.inquiry.billingAddress
            data['comments'] = this.inquiry.comments
            this.postInquiry({data})
        },

        ...mapActions({
            postInquiry: 'api/postPublicInquiry'
        })
    },

}
</script>

