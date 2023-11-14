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
                    <p class="subtitle is-6">{{$t('narrow_result_lbl')}}</p>
                    <!--<left-nav active="catalog"/>-->
                    <group-vertical v-for="f,i in groups" :key="i" :group="f"/>
                    <smallcart />
                </div>
                <div class="column">
                    <div class="container is-fluid">
                        <product-table
                            :products="products"
                            :fieldNames="fieldNames"
                            :fields="schema.fields"/>
                    </div>
                </div><!-- column -->
            </div><!-- columns -->
        </div><!-- container -->
    </section><!-- section -->
</div>
</template>

<script>
import map from 'lodash/fp/map'
import findIndex from 'lodash/fp/findIndex'
import {mapActions, mapGetters} from 'vuex'

export default {
    components: {
        smallcart: ()=>import  ( './inquiry/smallcart'),
        topNav: ()=>import  ( './elements/top-nav'),
        leftNav: ()=>import  ( './elements/left-nav'),
        groupVertical: ()=>import  ( './elements/group-vertical'),
        productTable: ()=>import  ( './elements/product-table'),
        notification: ()=>import  ( '@/components/utils/messaging/notification'),
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
        loggedIn: {
            immediate: true,
            handler(value){
                if(!value){
                    console.log('rerouting')
                    this.$router.push({name: 'Index'})
                } else {
                    console.log('not rerouting')
                }
            },
        }

    },

    computed:{
        loggedIn(){
            if(!this.accessToken){
                console.log('no access token')
                return false
            }
            console.log('access token')
            const idx = findIndex(role=>{
                return role==this.accessToken.payload.role
            })['admin', 'user']
            return idx!=-1
        },
        accessToken(){
            return this.$store.state.api.accessToken
        },
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
        if(!this.loggedIn){
            return
        }

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
            const rv = [];
            const fields = product.key('fields')
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
