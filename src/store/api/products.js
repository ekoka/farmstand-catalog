import {HAL} from '@/utils/hal'
import {Cache} from '@/utils/cache'

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
    },

    mutations:{
        setProductSchema(state, {productSchema}){
            state.productSchema = productSchema
            let ps = HAL(productSchema)
            //state.productSchema = ps.resource
            Cache(state.cache).store(ps.self, ps.resource)
        },

        setProducts(state, {products}){
            HAL(products).embedded('products').forEach(p=>{
                Cache(state.cache).store(p.self, p.resource)
            })
        },

        removeProduct(state, {product_id=null}){
            const tenant = HAL(state.tenant)
            if (product_id){
                // Remove product resource with different 
                // `partial` params. 
                let url = tenant.url('product', {product_id})
                Cache(state.cache).clear(url)
            }
        },

        clearProductCollection(state){
            const tenant = HAL(state.tenant)
            // clear product collection
            Cache(state.cache).clear(tenant.url('products'))
        },
    },

    actions:{
        putProductSchema({getters, dispatch, commit},{data}){
            const url = getters.tenant.url('product_schema')
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
            const url = getters.tenant.url('product_schema')
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
            let url = getters.tenant.url('products')
            return getters.http({
                url, 
                data, 
                method:'post', 
                auth:true
            }).then(response=>{
                url = HAL(response.data).url('location')
                // Remove entire product collection from cache.
                commit('clearProductCollection')
                // get product
                return dispatch('getProduct', {url})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        putProduct({getters, dispatch, commit}, {product_id, data}){
            let url = getters.tenant.url('product', {product_id})
            return getters.http({
                url, 
                method:'put', 
                data, 
                auth:true
            }).then((response) => {
                // clear the cached list of products
                commit('clearProductCollection')
                // remove cached product resource.
                commit('removeProduct', {product_id})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        deleteProduct({getters, commit}, {product_id}){
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            let url = getters.tenant.url('product', {product_id})
            return getters.http({url, method:'delete', auth:true}).then(r=>{
                // clear cached product collection 
                commit('clearProductCollection')
                // remove cached product resource
                commit('removeProduct', {product_id})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getProduct({getters, commit},{url, product_id, refresh=false, 
                    partial=1}){
            if (product_id){
                url = getters.tenant.url('product', {product_id}, {partial})
            }
            if (!refresh){ 
            // we attempt loading product data from cache
                let resource = getters.cache({key:url})
                if (resource){
                    return HAL(resource)
                }
            }
            return getters.http({url, auth:true}).then((response)=>{
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getProducts({getters, commit}, {params, refresh=false}={}){
            let url = getters.tenant.url('products')
            if (!refresh){ 
                let resource = getters.cache({key:url})
                if (resource){
                    return HAL(resource)
                }
            }
            return getters.http({url, auth:true}).then(response=>{
                commit('setProducts', {products:response.data})
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
                throw error
            })
        },
    },
}
