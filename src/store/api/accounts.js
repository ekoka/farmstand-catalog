import {HAL} from '@/utils/hal'

export default {
    state: {
        account: null,
        accessToken: null,
        domain: null,
    },

    getters: {
        account(state){
            return HAL(state.account)
        },
        domain(state){
            return HAL(state.domain)
        },
    },

    mutations: {
        setAccount(state, {account}){
            state.account = account
        },
        setDomain(state, {domain}){
            state.domain = domain
        },

        setAccessToken(state, {accessToken}){
            state.accessToken = accessToken
        },
    },

    actions: {
        getAccount({getters, commit, dispatch}){
            const url = getters.domain.url('account')
            return getters.http({url}).then(response => {
                commit('setAccount', {account:response.data})
                return HAL(response.data)
            })
        },

        getDomain({commit, getters}, {domain}={}){
            let url = getters.root.url('domain', {domain})
            return getters.http({url, auth:true}).then(response=>{
                commit('setDomain', {domain:response.data})
                return HAL(response.data)
            })
        },
    },
}
