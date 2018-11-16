<template>
<div>
    <rl :to="{name:'Catalog'}">Return to Products</rl> 
    <cart/>
    <addresses/>
    <comments/>

    <button @click="sendInquiry">Send Inquiry</button>

    <hr>
</div>
</template>

<script>
import cart from './cart'
import addresses from './addresses'
import comments from './comments'
import {mapActions, mapState} from 'vuex'

export default {
    components: {cart, addresses, comments},

    created(){
        this.cmpalias('router-link', 'rl')
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

