<template>
<div>
    <h3>Your product fields</h3>
    <p>Specify the name of up to five fields that describe your products (i.e. the columns of your product list). For instance "SKU", "Name", "Price", "MOQ", "Note".</p>

    <div v-for="f,i in schema.fields"><label> Field {{i}}: <input v-model="schema.fields[i]"/></label></div>
    <button @click="saveSchema">save</button>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {

    data(){
        return {
            //schema: this.$store.getters['api/productSchema'].data || {},
            schema: {fields:[]},
        }
    },

    created(){
        this.cmpalias('router-link', 'rl')
        this.getProductSchema().then(resp=>{
            this.schema = Object.assign(this.schema, this.productSchema.data)
        })

    },

    computed:{
        ...mapGetters({
            productSchema: 'api/productSchema'
        })
    },

    methods:{
        saveSchema(){
            this.putProductSchema({data:this.schema})
        },

        ...mapActions({
            putProductSchema:'api/putProductSchema',
            getProductSchema:'api/getProductSchema',
        }),
    },
}
</script>
