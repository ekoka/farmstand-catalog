import { defineStore } from 'pinia'
import cnf from '@/config'
import { HAL } from '@/utils/hal'
import { Buffer } from '@/utils/cache'
import http from '@/stores/http'
import useRootStore from './root'

export default defineStore('domain', {

    state:{
        
        domain: null,
        accountCache: {stack: [], lock:[]}, // TODO: remove?
    },

    //getters:{

    //    domain(state){
    //        if (state.domain){
    //            return HAL(state.domain)
    //        }
    //    },
    //},

    actions:{

        async getDomain({ domain, refresh }={refresh: false}){
            // if current domain and current state is allowed  
            if (!domain && !refresh && this.state.domain) {
                return this.state.domain 
            }
            domain = domain || cnf.SUBDOMAIN
            const rootStore = useRootStore()
            const root = await rootStore.getRoot()
            const url = root.url('domain', {domain})
            return http({url, auth:true}).then( resp => {
                this.state.domain = HAL(resp.data)
                return this.state.domain
            })
        },

        async postDomainAccount({ data }){
            const url = this.state.domain.url('domain_accounts')
            return http({
                url,
                data,
                method: 'post',
                auth:true,
            }).then( resp => HAL(resp.data) )
        },

        async deleteDomainAccount({ account_id }){
            const url = this.state.domain.url('domain_account', {account_id})
            return http({
                url,
                method: 'delete',
                auth:true,
            }).then( resp => HAL(resp.data) )
        },

        async getDomainAccounts(){
            const url = this.state.domain.url('domain_accounts')
            return http({ url, auth:true })
                .then( resp => HAL(resp.data) )
        },

        async getDomainAccessRequests({ params }={}) {
            const url = this.state.domain.url('domain_access_requests')
            return http({ url, auth:true })
                .then(resp => HAL(resp.data) )
        },

        async patchDomainAccessRequest({ url, access_request_id, data }) {
            if (!url) {
                url = this.state.domain.url('access_request', { access_request_id })
            }
            return http({ url, data, method: 'patch', auth:true })
        },
    },
})
