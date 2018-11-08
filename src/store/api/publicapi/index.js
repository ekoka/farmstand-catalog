import {HAL} from '@/utils/hal'
import {Cache} from '@/utils/cache'

export default {
    state: {},

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
            let pr = HAL(publicRoot)
            Cache(state.cache).store(pr.self, pr.resource)
        },
    },

    actions: {
        getPublicRoot({getters, commit}, {tenant}){
            let url = getters.root.url('public-root', {tenant})
            let resource = getters.cache({key:url})
            if (resource){
                return HAL(resource)
            }
            return getters.http({url}).then(response=>{
                commit('setPublicRoot', {publicRoot: response.data})
                return HAL(response.data)
            })
        },

        getPublicProducts({getters, commit}, {params}={}){
            let url = getters.publicRoot.url('public-products', {}, params)
            let resource = getters.cache({key:url})
            if (resource){
                return HAL(resource)
            }
            return getters.http({url}).then(response=>{
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            })
        },

        getPublicProduct({getters}, {product_id}){
        },

        getPublicProductSchema({getters, commit}){
            let url = getters.publicRoot.url('public-product-schema')
            return getters.http({url}).then(response=>{
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getPublicFilterSets({getters, commit}){
            let url = getters.publicRoot.url('public-filter-sets')
            return getters.http({url}).then(response=>{
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        postPublicInquiry({getters, commit}, {data}){
            let url = getters.publicRoot.url('public-inquiries')
            return getters.http({url, method:'post', data}).then(response=>{
                console.log(response)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getPublicInquiry({getters}, {inquiry_id}){
        },
    },

}
