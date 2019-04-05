/* lodash */
import {compose, map, reduce, difference,
    each, union} from 'lodash/fp'

import {HAL} from '@/utils/hal'
import {Buffer} from '@/utils/cache'

export default {
    state:{
        productSchema:null,
        productCache: {stack: [], lock:[]},
    },
    getters:{
        productSchema(state){
            if(!state.productSchema){
                return null
            }
            return HAL(state.productSchema)
        },
        product(state){
            return function(){
            }
        },
    },

    mutations:{
        setProductSchema(state, {productSchema}){
            state.productSchema = productSchema
        },

        removeProduct(state, {product_id=null}){
            Buffer(state.productCache).remove({product_id})
        },

        setProduct(state, {product}){
            const product_id = HAL(product).key('product_id')
            const path = {product_id}
            Buffer(state.productCache).store(path, product)
        },
    },

    actions:{
        //putProductSchema({getters, dispatch, commit},{data}){
        //    const url = getters.domain.url('product_schema')
        //    return getters.http({
        //        url, data, method:'put', auth:true,
        //    }).then(resp=>{
        //        return dispatch('getProductSchema')
        //    })
        //},

        getProductSchema({commit, getters}){
            const url = getters.domain.url('product_schema')
            return getters.http({url, auth:true}).then(response=>{
                commit('setProductSchema', {productSchema: response.data})
                return HAL(response.data)
            })
        },

        postProduct({getters, dispatch, commit}, {data}){
            let url = getters.domain.url('products')
            return getters.http({
                url, 
                data, 
                method:'post', 
                auth:true
            }).then(response=>{
                return HAL(response.data)
            })
        },

        putProduct({getters, dispatch, commit}, {product_id, data}){
            const url = getters.domain.url('product', {product_id})
            return getters.http({
                url, 
                method:'put', 
                data, 
                auth:true
            }).then((response) => {
                // remove cached product resource.
                commit('removeProduct', {product_id})
            })
        },

        // currently is virtually the same as putProduct, except that
        // we send request with a PATCH method.
        // The difference between both methods is that data sent with
        // PATCH must match exactly the schema stored by the backend.
        patchProduct({getters, dispatch, commit}, {product_id, data}){
            let url = getters.domain.url('product', {product_id})
            return getters.http({
                url, 
                method:'patch', 
                data, 
                auth:true
            }).then((response) => {
                // remove cached product resource.
                commit('removeProduct', {product_id})
            })
        },

        deleteProduct({getters, commit}, {product_id}){
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            let url = getters.domain.url('product', {product_id})
            return getters.http({
                url, method:'delete', auth:true
            }).then(r=>{
                // remove cached product resource
                commit('removeProduct', {product_id})
            })
        },

        getProducts({getters, commit}, {params}={}){
            let url = getters.domain.url('products')
            return getters.http({url, auth:true}).then(response=>{
                return HAL(response.data)
            })
        },

        getProduct({getters, commit},{url, product_id}){
            // always returns a fresh copy of product resource
            if (product_id){
                url = getters.domain.url('product', {product_id})
            }
            return getters.http({url, auth:true}).then(response=>{
                // halify
                commit('setProduct', {product:response.data})
                return HAL(response.data)
            })
        },

        getProductJson({getters}, {product_id}){
            const url = getters.domain.url('product_json', {product_id})
            return getters.http({url,auth:true}).then(response=>{
                return response.data
            })
        },

        putProductJson({getters}, {product_id, data}){
            const url = getters.domain.url('product_json', {product_id})
            return getters.http({
                url,auth:true,data,method:'put'
            }).then(response=>{
                return response.data
            })
        },

        getProductResources({getters, state, commit, rootState}, {product_ids}){
            const buffer = Buffer(state.productCache)
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
                
            const url = getters.domain.url('product_resources', null, {
                pid:notfound
            })
            return getters.http({
                url,
                auth:true
            }).then(response=>{
                const addNewResources = each(p=>{
                    commit('setProduct', {product:p.resource})
                })
                const resources = HAL(response.data)
                addNewResources(resources.embedded('products'))
                return union(halify(found), resources.embedded('products'))
            })
        },

        putProductGroupOptions({getters, dispatch}, {product_id, data}){
            return dispatch('getProduct', {product_id}).then(product=>{
                const url = product.url('groups')
                return getters.http({
                    url,
                    auth:true,
                    data,
                    method: 'put',
                })
            }).then((response)=> {
                return HAL(response.data)
            })
        },

    },
}
