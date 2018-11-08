<template>
<div>
    <h3 class="subtitle">Billing address</h3>

    {{billingAddress}}
    <div><label title="required">Title: 
        <select v-model="billingAddress.title">
            <option disabled value="">--Select One--</option>
            <option value="Mrs">Mrs</option>
            <option value="Mr">Mr</option>
        </select>
    </label></div>
    <div><label title="required">First name:* <input v-model="billingAddress.first_name" /></label></div>
    <div><label title="required">Last name:* <input v-model="billingAddress.last_name" /></label></div>
    <div><label title="required">Email address:* <input v-model="billingAddress.email" /></label></div>

    <div><label>Company: <input v-model="billingAddress.company"/></label></div>
    <div><label>Address 1: <input v-model="billingAddress.address1"/></label></div>
    <div><label>Address 2: <input v-model="billingAddress.address2"/></label></div>
    <div><label>City: <input v-model="billingAddress.city"/></label></div>
    <div><label>State/Province: <input v-model="billingAddress.state_province"/></label></div>
    <div><label>Country: <input v-model="billingAddress.country"/></label></div>
    <div><label>Zip/Postal Code: <input v-model="billingAddress.zip_postal_code"/></label></div>

    <br>
    <h3 class="subtitle">Shipping address</h3>
    <div><label>Same as billing address <input v-model="shippingAddress.see_billing" type="checkbox"/></label></div>
    <br>
    <div><label>Name/Company: <input v-model="shippingAddress.company"/></label></div>
    <div><label>Address 1: <input v-model="shippingAddress.address1"/></label></div>
    <div><label>Address 2: <input v-model="shippingAddress.address2"/></label></div>
    <div><label>City: <input v-model="shippingAddress.city"/></label></div>
    <div><label>State/Province: <input v-model="shippingAddress.state_province"/></label></div>
    <div><label>Country: <input v-model="shippingAddress.country"/></label></div>
    <div><label>Zip/Postal Code: <input v-model="shippingAddress.zip_postal_code"/></label></div>
</div>
</template>

<script>
import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'
export default {

    data(){
        return {
        }
    },

    computed:{
        ...mapState({
            shippingAddress: state=>state.inquiry.shippingAddress,
            billingAddress: state=>state.inquiry.billingAddress,
        })
    },

    watch:{
        billingAddress: {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        },
        shippingAddress: {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        }
    },

    created(){
        this.cmpalias('router-link', 'rl')
    },

    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },

}
</script>

