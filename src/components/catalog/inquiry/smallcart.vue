<template>
<div>
    <h3 class="subtitle">Cart</h3>
    <ul>
        <li v-for="p in products"> 
            <div>{{p.fields[0]}} | {{p.fields[1]}} | {{p.fields[2]}}</div> 
              <a @click="removeProduct({product:p})">remove</a>
        </li>
    </ul>
</div>
</template>

<script>
import {mapGetters, mapActions, mapState, mapMutations} from 'vuex'
export default {

    data(){
        return {
            //products: this.$store.state.inquiry.products
        }
    },
    computed:{
        ...mapState({
            products: state=>state.inquiry.products
        })
    },

    watch:{
        products: {
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
            //removeProduct: 'inquiry/removeProduct',
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
        ...mapActions({
            removeProduct: 'inquiry/removeProduct',
        })
    },

}
</script>

