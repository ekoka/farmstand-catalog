<template>
<div>
<div> Showcase </div>
<div v-if="ready">
    <TopNav />
    <Notification eventName="message-sent" :defaults="{timeout:2}" />
    <section v-if="false" class="section">
        <div class='container'>
            <div class="columns">
                <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                    <p class="subtitle is-6">{{$t('narrow_result_lbl')}}</p>
                    <!--<left-nav active="catalog"/>-->
                    <GroupVertical v-for="f,i in groups" :key="i" :group="f" />
                    <Smallcart />
                </div>
                <div class="column">
                    <div class="container is-fluid">
                        <ProductTable
                            :products="products"
                            :fieldNames="fieldNames"
                            :fields="schema.fields"/>
                    </div>
                </div><!-- column -->
            </div><!-- columns -->
        </div><!-- container -->
    </section><!-- section -->
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
//import { useStore } from 'pina'

//Notification = () => import('@/components/utils/messaging/Notification')
//TopNav: () => import('./elements/top-nav')
const ready = false
// export default {
//     components: {
//         Smallcart: () => import('./inquiry/smallcart'),
//         //leftNav: ()=>import  ( './elements/left-nav'),
//         GroupVertical: () => import('./elements/group-vertical'),
//         ProductTable: () => import('./elements/product-table'),
//         Notification: () => import('@/components/utils/messaging/notification'),
//     },
// 
//     data(){
//         return {
//             groups:{},
//             schema: {},
//             categories:[],
//             products: [],
//             ready: false,
//         }
//     },
// 
//     watch: {
//         //groups: {
//         //    deep: true,
//         //    handler(selected){
//         //        let groups = Object.keys(selected).group(s=>{
//         //            return selected[s].length
//         //        })
//         //        let options = Object.values(selected).reduce((ff, f)=>{
//         //            let rv = (ff && ff.length) ? new Set(ff.concat(f)) : new Set(f)
//         //            return [...rv]
//         //        })
//         //        this.getPublicProducts({params:{options, groups}
//         //        }).then(products=>{
//         //            this.products = products.keys('products')
//         //        })
//         //    }
//         //},
//         loggedIn: {
//             immediate: true,
//             handler(value){
//                 if(!value){
//                     console.log('rerouting')
//                     this.$router.push({name: 'Index'})
//                 } else {
//                     console.log('not rerouting')
//                 }
//             },
//         }
// 
//     },
// 
//     computed:{
//         loggedIn(){
//             if(!this.accessToken){
//                 console.log('no access token')
//                 return false
//             }
//             //const idx = ['admin', 'user'].findIndex(role => role==this.accessToken.payload.role)
//             return ['admin', 'user'].includes(this.accessToken.payload.role)
//         },
//         accessToken(){
//             return this.$store.state.api.accessToken
//         },
//         fieldNames(){
//             if (this.schema.fields){
//                 return this.schema.fields.filter(f=>{
//                     return f
//                 })
//             }
//             return []
//         },
// 
//         fieldLength(){
//             if (this.schema.fields){
//                 return this.schema.fields.filter(f=>{
//                     return f
//                 }).length
//             }
//             return 0
//         },
//         ...mapGetters({
//             productAdded: 'inquiry/productAdded',
//         }),
//     },
// 
//     mounted(){
//         if(!this.loggedIn){
//             return
//         }
// 
//         this.getRoot()
//             .then(() => {
//                 this.getPublicRoot()
//             })
//             .then(() => {
//                 return this.getDomain({
//                     domain:this.$store.getters.subdomain
//                 })
//             })
//             .then(() => {
//                 const account_id = this.accessToken.payload.account_id
//                 return this.getAccount({account_id})
//             })
//             .then(() => this.getPublicProductSchema())
//             .then(schema => {
//                 this.schema = schema.data
//             })
//             .then(() => this.getPublicProducts())
//             .then(products => {
//                 const product_ids = products.key('products')
//                 return this.getPublicProductResources({product_ids})
//             })
//             .then(products => {
//                 this.products = products.map(p=>p.data)
//             })
//             .then(() => this.getPublicGroups())
//             .then(groups => {
//                 this.groups = groups.embedded('groups').map(f => f.data)
//             })
//             .then(() => {
//                 this.ready = true
//             })
//     },
// 
//     methods: {
//         fields(product){
//             const rv = [];
//             const fields = product.key('fields')
//             for (let i=0; i<this.fieldLength;i++){
//                 rv[i] = fields[i] || ''
//             }
//             return rv
//         },
//         ...mapActions('inquiry', {
//             addProduct: 'addProduct',
//             removeProduct: 'removeProduct',
//         }),
// 
//         ...mapActions('api', {
//             getRoot:'getRoot',
//             getPublicRoot:'getPublicRoot',
//             getDomain:'getDomain',
//             getAccount:'getAccount',
//             getPublicProducts:'getPublicProducts',
//             getPublicProductSchema:'getPublicProductSchema',
//             getPublicProductResources:'getPublicProductResources',
//             getPublicGroups: 'getPublicGroups',
//         }),
//     },
// }
</script>
