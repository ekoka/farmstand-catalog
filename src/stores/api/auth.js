import { defineStore } from 'pinia'
import { parseJwt } from '@/utils/jwt'
import cnf from '@/config'
import http from '@/stores/http'
import {HAL} from '@/utils/hal'
import cookies from '@/utils/cookies'
import useRootStore from './root'

export default defineStore('auth', {
    state: () => ({
        accessToken: null,
        idToken: null,
    }),

    getters: {
        authHeaders: (state) => ({ 'Authorization': `Bearer ${state.accessToken.token}` })
    },

    actions: {
        async postAccessToken() {
            const rootStore = useRootStore()
            await rootStore.getRoot()
            //const url = rootStore.root.value.url('access_token')
            const url = rootStore.root.url('access_token')
            return http({
                data: {domain: cnf.SUBDOMAIN},
                method: 'post',
                url,
                headers: { 'Authorization': 'Bearer ' + this.idToken }
            }).then( resp => {
                if(!resp.data){
                    this.accessToken = null
                    return
                }
                this.accessToken = { token: HAL(resp.data).key('token') }
                const payload = this.accessToken.token.split('.')[1]
                this.accessToken.payload = parseJwt(payload)
                return this.accessToken
            }).catch( err => {
                this.accessToken = null
                throw err
            })
        },

        async deleteAccessToken(){
            this.accessToken = null 
        },

        async syncIdToken() {
            // cookie is source of truth during sync
            this.idToken = cookies.getCookie('idToken')
        },
    },
})
