import {HAL} from '@/utils/hal'

export default {
    state: {
        profile: null,
        account: null,
        accessToken: null,
        domain: null,
    },

    getters: {
        account(state){
            if(state.account){
                return HAL(state.account)
            }
        },
        domain(state){
            if (state.domain){
                return HAL(state.domain)
            }
        },
        profile(state){
            if (state.profile){
                return HAL(state.profile)
            }
        },
    },

    mutations: {
        setAccount(state, {account}){
            state.account = account
        },

        unsetAccount(state){
            state.account = null
        },

        setDomain(state, {domain}){
            state.domain = domain
        },

        setAccessToken(state, {accessToken}){
            state.accessToken = accessToken
        },

        setProfile(state, {profile}){
            state.profile = profile
        },

        unsetProfile(state){
            state.profile = null
        },
    },

    actions: {
        getAccount({getters, commit, dispatch}, {account_id}){
            const url = getters.root.url('account', {account_id})
            return getters.http({url, auth:true}).then(response => {
                commit('setAccount', {account:response.data})
                return HAL(response.data)
            })
        },

        getProfile({commit, getters}){
            const url = getters.root.url('profile')
            return getters.http({url, auth:true}).then(response => {
                commit('setProfile', {profile:response.data})
                return HAL(response.data)
            })
        },

        getDomain({commit, getters}, {domain}={}){
            const url = getters.root.url('domain', {domain})
            return getters.http({url, auth:true}).then(response=>{
                commit('setDomain', {domain:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error.response)
                console.log(error.response.data)
            })
        },
    },
}
