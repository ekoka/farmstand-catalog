<template>
<div>
    <p> Hello {{account.name}}, thank you for registering with SimpleB2B's KISS Order Manager.</p>

    <p> To initiate your catalog of product let's first choose an identifier (a nickname) to use for your company in URLs. It can be made up of numbers and lowercase non-accented letters. The dash is acceptable as a word separator. No space or other symbols. At least 3 characters and no longer than 20. e.g. "acme-inc", "xyzcorp".
    </p>

    <p>https://<input v-model="tenant.name"/>.simpleb2b.io</p>

    <p>It would also be useful to your clients if you could enter some information about your company.</p>
    <div><label>Company Name <input v-model="tenant.company_name"/></label></div>
    <div><label>Address 1 <input v-model="tenant.address1"/></label></div>
    <div><label>Address 2 <input v-model="tenant.address2"/></label></div>
    <div><label>City <input v-model="tenant.city"/></label></div>
    <div><label>State/Province <input v-model="tenant.state_province"/></label></div>
    <div><label>Country <input v-model="tenant.country"/></label></div>
    <div><label>Zip/Postal Code <input v-model="tenant.zip_postal_code"/></label></div>
    <div><button @click="saveTenant"> Save </button></div>
</div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    model:{
        event: 'loaded',
    },

    props:['account'],

    data (){
        return {
            tenant: {},
        }
    },
    created(){
        this.cmpalias('router-link', 'rl')
    },

    methods:{
        saveTenant(){
            this.postTenant({tenant:this.tenant}).then((response)=>{
                this.$emit('loaded', this.$store.getters['api/tenant'].data)
            })
        },
        ...mapActions({
            postTenant: 'api/postTenant',
        })
    }
}
</script>
