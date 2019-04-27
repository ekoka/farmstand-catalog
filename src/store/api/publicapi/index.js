import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import difference from 'lodash/fp/difference'
import each from 'lodash/fp/each'
import union from 'lodash/fp/union'
import {HAL} from '@/utils/hal'
import {Buffer} from '@/utils/cache'

export default {
    state: {
        publicRoot: null,
        publicProductSchema: null,
        publicProductCache: {stack: [], lock:[]},
    },

    getters: {
        publicRoot(state){
            if (state.publicRoot){
                return HAL(state.publicRoot)
            }
        },
    },

    mutations:{
        setPublicRoot(state, {publicRoot}){
            state.publicRoot = publicRoot 
        },

        setPublicProductSchema(state, {schema}){
            state.publicProductSchema = schema
        },

        removePublicProduct(state, {product_id=null}){
            Buffer(state.publicProductCache).remove({product_id})
        },

        setPublicProduct(state, {product}){
            const product_id = HAL(product).key('product_id')
            const path = {product_id}
            Buffer(state.publicProductCache).store(path, product)
        },
    },

    actions: {
        getPublicRoot({getters, commit, dispatch, rootGetters}){
            async function getRoot(){
                if(getters.root){
                    return getters.root
                }
                return await dispatch('getRoot')
            }

            const domain = rootGetters.subdomain
            return getRoot().then(root=>{
                const url = root.url('public_root', {domain})
                return getters.http({url}).then(response=>{
                    commit('setPublicRoot', {publicRoot: response.data})
                    return HAL(response.data)
                })
            })
        },

        getPublicProductResources({getters, state, commit}, {product_ids}){
            const buffer = Buffer(state.publicProductCache)
            const halify = map(p=>{
                return HAL(p)
            })
            const finder = reduce((accumulator, product_id)=>{
                const resource = buffer.fetch({product_id})
                if(resource){
                    accumulator.found.push(resource)
                    accumulator.foundIds.push(product_id)
                }
                return accumulator
            }, {found:[], foundIds:[]})
            const {found, foundIds} = finder(product_ids)
            const notfound = difference(product_ids, foundIds)

            if(notfound.length==0){
                return halify(found)
            }
                
            const url = getters.publicRoot.url('public_product_resources', null, {
                pid:notfound
            })
            return getters.http({
                url, auth:true,
            }).then(response=>{
                const addNewResources = each(p=>{
                    commit('setPublicProduct', {product:p.resource})
                })
                const resources = HAL(response.data)
                addNewResources(resources.embedded('products'))
                return union(halify(found), resources.embedded('products'))
            })
        },

        getPublicProducts({getters, commit, dispatch}, {params}={}){

            const url = getters.publicRoot.url('public_products', {}, params)
            return getters.http({url, auth:true}).then(response=>{
                return HAL(response.data)
            })
        },

        getPublicProduct({getters}, {product_id}){
        },

        getPublicProductSchema({getters, commit}){
            const url = getters.publicRoot.url('public_product_schema')
            return getters.http({url, auth:true}).then(response=>{
                commit('setPublicProductSchema', {schema:response.data})
                return HAL(response.data)
            })
        },

        getPublicGroups({getters, commit}){
            const url = getters.publicRoot.url('public_groups')
            return getters.http({url, auth:true}).then(response=>{
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        postPublicInquiry({getters, commit, dispatch}, {data}){
            return dispatch('getPublicRoot').then(publicRoot=>{
                let url = publicRoot.url('public_inquiries')
                return getters.http({url, method:'post', data, auth:true}).then(response=>{
                    console.log(response)
                }).catch(error=>{
                    console.log(error)
                    console.log(error.response)
                })
            })
        },

        getPublicInquiry({getters}, {inquiry_id}){
        },
    },

}
