import {HAL} from '@/utils/hal'

export default {
    state: {
        account: null,
        accessKey: null,
        tenant: null,
    },

    getters: {
        account(state){
            return HAL(state.account)
        },
        tenant(state){
            return HAL(state.tenant)
        },
    },

    mutations: {
        setAccount(state, {account}){
            state.account = account
        },
        setTenant(state, {tenant}){
            state.tenant = tenant
        },

        setAccessKey(state, {accessKey}){
            state.accessKey = accessKey
        },
    },

    actions: {
        getAccount({getters, commit, dispatch}){
            const url = getters.tenant.url('account')
            return getters.http({url}).then(response => {
                commit('setAccount', {account:response.data})
                return HAL(response.data)
            }).catch(error => {
                console.log(error)
                console.log(error.response)
            })
        },

        getTenant({commit, getters}, {tenant}={}){
            let url = getters.root.url('tenant', {tenant})
            return getters.http({url}).then(response=>{
                commit('setTenant', {tenant:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
    },
}
