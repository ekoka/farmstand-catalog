import cookies from '@/utils/cookies'
import {parseJwt} from '@/utils/jwt'
import {HAL} from '@/utils/hal'

export default {
    state: {
        profile: null,
        account: null,
        accessToken: null,
        idToken: null,
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

        setAccessToken(state, {token}){
            if(!token){
                state.accessToken = null
                return
            }
            const accessToken = {
                token: HAL(token).key('token'), 
            }
            const payload = accessToken.token.split('.')[1]
            accessToken.payload = parseJwt(payload)
            state.accessToken = accessToken
        },

        setIdToken(state, {token}){
            state.idToken = token
        },

        setProfile(state, {profile}){
            state.profile = profile
        },

        unsetProfile(state){
            state.profile = null
        },

    },

    actions: {

        syncIdToken({commit}){
            // cookie is source of truth during sync
            const token = cookies.getCookie('idToken')
            commit('setIdToken', {token})
        },

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
            })
        },

        postAccessToken({rootGetters, getters, commit, dispatch, state}){
            const url = getters.root.url('access_token')
            const authHeaders = {'Authorization': 'Bearer ' + state.idToken}
            return getters.http({
                data: {domain: rootGetters.subdomain},
                method: 'post',
                url,
                headers:authHeaders,
            }).then(response => {
                commit('setAccessToken', {token: response.data})
                return state.accessToken
            }).catch(error => {
                commit('setAccessToken', {token: null})
                throw error
            })
        },

        deleteAccessToken({commit}){
            commit('setAccessToken', {token: null})
        },
    },
}
