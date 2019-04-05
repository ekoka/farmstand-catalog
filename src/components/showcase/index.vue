<template>
<div>
    <top-nav/>
    <notification eventName="message-sent" 
        :defaults="{timeout:2}"> 
    </notification>
    <section class="section">
        <div class='container'>
            <div class="columns">
                <div class="column is-4-tablet is-3-desktop is-2-widescreen">
                    <p class="subtitle is-6">Narrow results by</p>
                    <!--<left-nav active="catalog"/>-->
                    <group-vertical v-for="f,i in groups" :key="i" :group="f"/>
                    <smallcart/>
                </div>
                <div class="column">
                    <product-table 
                        :products="products" 
                        :fieldNames="fieldNames" 
                        :fields="schema.fields"/>
                </div><!-- column -->
            </div><!-- columns -->
        </div><!-- container -->
    </section><!-- section -->
</div>
</template>

<script>
import {map} from 'lodash/fp'
import smallcart from './inquiry/smallcart'
import topNav from './elements/top-nav'
import leftNav from './elements/left-nav'
import groupVertical from './elements/group-vertical'
import productTable from './elements/product-table'
import {mapActions, mapGetters} from 'vuex'
import notification from '@/components/utils/messaging/notification'

export default {
    components: { 
        smallcart, topNav, leftNav,
        groupVertical, productTable,
        notification,
    },

    data(){
        return {
            groups:{},
            schema: {},
            categories:[],
            products: [],
        }
    },

    watch: {
        //groups: {
        //    deep: true,
        //    handler(selected){
        //        let groups = Object.keys(selected).group(s=>{
        //            return selected[s].length 
        //        })
        //        let options = Object.values(selected).reduce((ff, f)=>{
        //            let rv = (ff && ff.length) ? new Set(ff.concat(f)) : new Set(f)
        //            return [...rv]
        //        })
        //        this.getPublicProducts({params:{options, groups}
        //        }).then(products=>{
        //            this.products = products.keys('products')
        //        })
        //    }
        //},
    },

    computed:{
        fieldNames(){
            if (this.schema.fields){
                return this.schema.fields.filter(f=>{
                    return f
                })
            }
            return []
        },

        fieldLength(){
            if (this.schema.fields){
                return this.schema.fields.filter(f=>{
                    return f
                }).length
            }
            return 0
        },
        ...mapGetters({
            productAdded: 'inquiry/productAdded',
        }),
    },

    mounted(){

        this.getPublicRoot().then(()=>{
            return this.getPublicProductSchema()
        }).then(schema=>{
            this.schema = schema.data
        }).then(()=>{
            return this.getPublicProducts()
        }).then(products=>{
            const product_ids = products.key('products')
            return this.getPublicProductResources({product_ids})
        }).then(products=>{
            this.products = map(p=>{
                return p.data
            })(products)
        }).then(()=>{
            return this.getPublicGroups()
        }).then(groups=>{
            this.groups = map(f=>f.data)(groups.embedded('groups'))
        })
    },

    methods: {
        fields(product){
            let rv = [];
            let fields = product.key('fields')
            for (let i=0; i<this.fieldLength;i++){
                rv[i] = fields[i] || ''
            }
            return rv
            //return product.key('fields').slice(0, this.fieldLength).map(f=>{
            //    return f || 'none'
            //})
            //return product.key('fields').map(f=>{
            //})
        },
        
        ...mapActions({
            getPublicRoot:'api/getPublicRoot',
            getPublicProducts:'api/getPublicProducts',
            getPublicProductSchema:'api/getPublicProductSchema',
            getPublicProductResources:'api/getPublicProductResources',
            getPublicGroups: 'api/getPublicGroups',
            addProduct: 'inquiry/addProduct',
            removeProduct: 'inquiry/removeProduct',
        }),
    },
}
</script>

