import { defineStore } from 'pinia'
import { difference, union } from '@/utils/ds'
import { HAL } from '@/utils/hal'
import http from '@/stores/http'
import { Buffer } from '@/utils/cache'
import useDomainStore from './domain'

export default defineStore('products', {

    state: () => ({
        productSchema: null,
        productCache: {stack: [], lock: []},
    }),

    actions: {
        //putProductSchema({getters, dispatch, commit},{data}){
        //    const url = getters.domain.url('product_schema')
        //    return getters.http({
        //        url, data, method:'put', auth:true,
        //    }).then(resp=>{
        //        return dispatch('getProductSchema')
        //    })
        //},

        getProductSchema(){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product_schema')
            return http({url, auth:true}).then(resp => {
                this.productSchema = HAL(resp.data)
                return this.productSchema
            })
        },

        postProduct({ data }){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('products')
            return http({ url, data, method:'post', auth:true })
                .then( resp => HAL(resp.data) )
        },

        putProduct({ product_id, data }){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product', { product_id })
            return http({ url, method:'put', data, auth:true }).then( _ => {
                // remove cached product resource.
                Buffer(this.productCache).remove({ product_id })
            })
        },

        // currently this is virtually the same as putProduct, except that
        // we send request with a PATCH method.
        // The difference between both methods is that data sent with
        // PATCH must match exactly the schema stored by the backend.
        patchProduct({ product_id, data }) {
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product', { product_id })
            return http({ url, method:'patch', data, auth:true }).then( _ => {
                // remove cached product resource.
                Buffer(this.productCache).remove({ product_id })
            })
        },

        deleteProduct({ product_id }) {
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product', { product_id })
            return http({ url, method:'delete', auth:true }).then( _ => {
                // remove cached product resource
                Buffer(this.productCache).remove({ product_id })
            })
        },

        getProducts({ params=null }) {
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('products', null, params)
            return http({url, auth:true})
                .then( resp => HAL(resp.data) )
        },

        async getProduct({url, product_id}){
            if (product_id) {
                const domainStore = useDomainStore()
                url = domainStore.domain.url('product', { product_id })
            }
            // always returns a fresh copy of product resource
            return http({url, auth:true}).then(resp => {
                const product_id = HAL(resp.data).key('product_id')
                const path = { product_id }
                Buffer(this.productCache).store(path, resp.data)
                return HAL(resp.data)
            })
        },

        getProductJson({ product_id }){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product_json', { product_id })
            return http({ url, auth:true })
                .then( resp => response.data )
        },

        putProductJson({ product_id, data }){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product_json', { product_id })
            return http({ url, auth:true, data, method:'put' })
                .then( resp => response.data )
        },

        async getProductResources({ product_ids }){
            const buffer = Buffer(this.productCache)
            const { found, foundIds } = product_ids.reduce((accumulator, product_id) => {
                const resource = buffer.fetch({ product_id })
                if (resource) {
                    accumulator.found.push(resource)
                    accumulator.foundIds.push(product_id)
                }
                return accumulator
            }, {found:[], foundIds:[]})

            const notfound = Array.from(difference(product_ids, foundIds))
            if(notfound.length===0) 
                return found.map( p => HAL(p) )
            
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('product_resources', null, { pid:notfound })
            return http({ url, auth:true }).then(resp => {
                const resources = HAL(response.data)
                resources.embedded('products').forEach( p => {
                    const product_id = HAL(p.resource).key('product_id')
                    const path = { product_id }
                    Buffer(this.productCache).store(path, p.resource)
                })
                return Array.from(union(found.map(p => HAL(p)), resources.embedded('products')))
            })
        },

        putProductGroupOptions({ product_id, data }){
            return this.getProduct({ product_id }).then( product => {
                const url = product.url('groups')
                return http({ url, auth:true, data, method: 'put', })
                    .then( resp => HAL(response.data) )
            })
        },
    },
})
