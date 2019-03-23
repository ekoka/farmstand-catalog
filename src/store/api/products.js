import flow from 'lodash/fp/flow'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import concat from 'lodash/fp/concat'
import difference from 'lodash/fp/difference'
import each from 'lodash/fp/each'
import union from 'lodash/fp/union'

import {HAL} from '@/utils/hal'
import {Cache, Buffer} from '@/utils/cache'

/*
 * How to handle product collection
 *  - product collection is not a resource per say. It's just a cached
 *  dump that contains both products and partial products.
 *  - when getting the product list resource, each partial product in the
 *  list is placed in the product collection.
 *  - as well, when getting a product's details the resource is also
 *  placed in the collection.
 *  - then everytime info on a product is needed, whether partial or detailed,
 *  product collection is the primary source.
 *  - In that way the product's list resource is only affected by product
 *  addition and product removal.
 *  - maybe there should be a separate product_details resource with its own
 *  endpoint (get_product_details) that can take a list of product_ids.
 * 
 */

export default {
    state:{
        productSchema:null,
        productResources: {stack: [], lock:[]},
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
            let ps = HAL(productSchema)
            //state.productSchema = ps.resource
            Cache(state.cache).store(ps.self, ps.resource)
        },

        setProducts(state, {products}){
            HAL(products).embedded('product_ids').forEach(p=>{
                Cache(state.cache).store(p.self, p.resource)
            })
        },

        removeProduct(state, {product_id=null}){
            Buffer(state.productResources).remove({product_id})
        },

        clearProductCollection(state){
            const domain = HAL(state.domain)
            // clear product collection
            Cache(state.cache).clear(domain.url('products'))
        },

        setProduct(state, {url, product}){
            Cache(state.cache).store(url, product)
        },

        addProductResourceToCollection(state, {product_id, productResource}){
            const path = {product_id}
            Buffer(state.productResources).store(path, productResource)
        },


    },

    actions:{
        putProductSchema({getters, dispatch, commit},{data}){
            const url = getters.domain.url('product_schema')
            return getters.http({
                url, data, method:'put', auth:true,
            }).then(resp=>{
                return dispatch('getProductSchema')
            })
        },

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
                url = HAL(response.data).url('location')
                // Remove entire product collection from cache.
                // commit('clearProductCollection')
                // get product
                return dispatch('getProduct', {url})
            })
        },

        putProduct({getters, dispatch, commit}, {product_id, data}){
            let url = getters.domain.url('product', {product_id})
            return getters.http({
                url, 
                method:'put', 
                data, 
                auth:true
            }).then((response) => {
                // clear the cached list of products
                // commit('clearProductCollection')
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
                // clear the cached list of products
                // commit('clearProductCollection')
                // remove cached product resource.
                commit('removeProduct', {product_id})
            })
        },

        deleteProduct({getters, commit}, {product_id}){
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            let url = getters.domain.url('product', {product_id})
            return getters.http({url, method:'delete', auth:true}).then(r=>{
                // clear cached product collection 
                // commit('clearProductCollection')
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
                console.log('inside getProduct')
                // halify
                const product = HAL(response.data)
                const product_id = product.key('product_id')
                const productResource = product.resource
                commit('addProductResourceToCollection', {product_id,productResource})
                return product
            })
        },


        getProductDetails({getters, commit}, {product_ids=[]}={}){
            let rv  = []
            let url = getters.domain.url(
                'product_details', null, {pid:product_ids})
            return getters.http({
                url,
                auth: true,
            }).then(response=>{
                return concat(rv, map(p=>{
                    let url = getters.domain.url('product', {
                        product_id: p.data.product_id})
                    commit('setProduct', {url, product:p.resource})
                    return p
                })(HAL(response.data).embedded('products')))
            })
        },

        getProductResources({getters, state, commit, rootState}, {product_ids}){
            const buffer = Buffer(state.productResources)
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
                
            let url = getters.domain.url('product_resources', null, {
                pid:notfound
            })
            return getters.http({
                url,
                auth:true
            }).then(response=>{
                const addNewResources = each(p=>{
                    const product_id = p.key('product_id')
                    commit('addProductResourceToCollection', {
                        product_id, productResource:p.resource
                    })
                })
                const resources = HAL(response.data)
                addNewResources(resources.embedded('products'))
                return union(halify(found), resources.embedded('products'))
            })
        },

        putProductFilterOptions({getters, dispatch}, {product_id, data}){
            return dispatch('getProduct', {product_id}).then(product=>{
                const url = product.url('filters')
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
