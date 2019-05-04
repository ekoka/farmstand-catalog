/* lodash */
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import difference from 'lodash/fp/difference'
import each from 'lodash/fp/each'
import union from 'lodash/fp/union'

import {HAL} from '@/utils/hal'
import {Buffer} from '@/utils/cache'

export default {
    state:{
        domain: null,
        accountCache: {stack: [], lock:[]},
    },
    getters:{
        domain(state){
            if (state.domain){
                return HAL(state.domain)
            }
        },
    },

    mutations:{
        setDomain(state, {domain}){
            state.domain = domain
        },

    },

    actions:{

        getDomain({rootGetters, commit, getters}, {domain}={}){
            domain = domain || rootGetters.subdomain
            const url = getters.root.url('domain', {domain})
            return getters.http({url, auth:true}).then(response=>{
                commit('setDomain', {domain:response.data})
                return HAL(response.data)
            })
        },

        postDomainAccount({getters, dispatch}, {data}){
            return dispatch('getResource', {resource:'domain'}).then(domain=>{
                const url = domain.url('domain_accounts')
                return getters.http({
                    url,
                    data,
                    method: 'post',
                    auth:true,
                }).then(response=>{
                    return HAL(response.data)
                })
            })
        },

        deleteDomainAccount({getters, dispatch}, {account_id}){
            return dispatch('getResource', {resource:'domain'}).then(domain=>{
                const url = domain.url('domain_account', {account_id})
                console.log(url)
                return getters.http({
                    url,
                    method: 'delete',
                    auth:true,
                }).then(response=>{
                    return HAL(response.data)
                })
            })
        },

        getDomainAccounts({getters, dispatch}){
            return dispatch('getResource', {resource:'domain'}).then(domain=>{
                const url = domain.url('domain_accounts')
                return getters.http({
                    url, auth:true
                }).then(response=>{
                    return HAL(response.data)
                })
            })
        },

        getDomainAccessRequests({getters, dispatch}, {params}={}){
            return dispatch('getResource', {resource:'domain'}).then(domain=>{
                const url = domain.url('domain_access_requests')
                return getters.http({
                    url, auth:true
                }).then(response=>{
                    return HAL(response.data)
                })
            })
        },

        patchDomainAccessRequest({getters, dispatch}, {
            url, access_request_id, data
        }){
            if(url){
                return getters.http({
                    url, data, method: 'patch', auth:true 
                })
            }
            return dispatch('getResource', {resource: 'domain'}).then(domain=>{
                const url = domain.url('access_request', {access_request_id})
                return getters.http({
                    url, data, method: 'patch', auth:true
                })
            })
        },



    },
}
