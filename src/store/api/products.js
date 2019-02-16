import _ from 'lodash/fp'
import {HAL} from '@/utils/hal'
import {Cache} from '@/utils/cache'

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
            const domain = HAL(state.domain)
            if (product_id){
                // Remove product resource with different 
                // `partial` params. 
                let url = domain.url('product', {product_id})
                Cache(state.cache).clear(url)
            }
        },

        clearProductCollection(state){
            const domain = HAL(state.domain)
            // clear product collection
            Cache(state.cache).clear(domain.url('products'))
        },

        setProduct(state, {url, product}){
            Cache(state.cache).store(url, product)
            //Cache(state.cache).store(key, value)
            //commit('cache', {key:url, value:response.data})
        },
    },

    actions:{
        putProductSchema({getters, dispatch, commit},{data}){
            const url = getters.domain.url('product_schema')
            return getters.http({
                url, data, method:'put', auth:true,
            }).then(resp=>{
                return dispatch('getProductSchema', {refresh:true})
            }).catch(error=>{
                console.log(error.response)
                throw error
            })
        },

        getProductSchema({commit, getters}, {refresh=false}={}){
            const url = getters.domain.url('product_schema')
            if (!refresh){ 
                let resource = getters.cache({key:url})
                if (resource){
                    return HAL(resource)
                }
            }
            return getters.http({url, auth:true}).then(response=>{
                commit('setProductSchema', {productSchema: response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error.response)
                throw error
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
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
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
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
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
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getProducts({getters, commit}, {params}={}){
            let url = getters.domain.url('products')
            //if (!refresh){ 
            //    let resource = getters.cache({key:url})
            //    if (resource){
            //        return HAL(resource)
            //    }
            //}
            return getters.http({url, auth:true}).then(response=>{
                // caching each product's resource
                //commit('setProducts', {products:response.data})
                // caching product list
                //commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
                throw error
            })
        },

        getProduct({getters, commit},{url, product_id, refresh=false}){
            if (product_id){
                url = getters.domain.url('product', {product_id})
            }
            if (!refresh){
                // we attempt loading product data from cache
                let resource = getters.cache({key:url})
                if (resource){
                    return HAL(resource)
                }
            }

            return getters.http({url, auth:true}).then((response)=>{
                //commit('cache', {key:url, value:response.data})
                commit('setProduct', {url, product:response.data})
                return HAL(getters.cache({key:url}))
                //return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },


        getProductDetails({getters, commit}, {product_ids=[], refresh=false}={}){
            let rv  = []
            if (!refresh){ 
                let missing = []
                _.each(product_id=>{
                    let url = getters.domain.url('product', {product_id})
                    let resource = getters.cache({key:url})
                    if (resource){
                        rv.push(HAL(resource))
                        return 
                    }
                    missing.push(product_id)
                })(product_ids)

                if (!missing.length){
                    // all resources found, return them
                    return rv
                }
                // there are uncached resources, we continue
                product_ids = missing
            }

            let url = getters.domain.url(
                'product_details', null, {pid:product_ids})
            return getters.http({
                url,
                auth: true,
            }).then(response=>{
                return _.concat(rv, _.map(p=>{
                    let url = getters.domain.url('product', {
                        product_id: p.data.product_id})
                    commit('setProduct', {url, product:p.resource})
                    return p
                })(HAL(response.data).embedded('products')))
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
