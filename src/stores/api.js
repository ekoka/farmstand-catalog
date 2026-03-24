import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { parseJwt } from '@/utils/jwt'
import cnf from '@/config'
import {HAL} from '@/utils/hal'
import cookies from '@/utils/cookies'

const CURRENT_LANG = 'en'

export const useRootStore = defineStore('ApiStore', () => {
    //const count = ref(0)
    //const doubleCount = computed(() => count.value * 2)
    const root = ref(null)
    async function getRoot() {
        if (root.value) return root
        return http({ url: cnf.API_ROOT }).then( resp => {
            root.value = HAL(resp.data)
            return root
        })
    }
    return { getRoot, root }
})

export const useAuthStore = defineStore('auth', {
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

        deleteAccessToken(){
            this.accessToken = null 
        },

        syncIdToken() {
            // cookie is source of truth during sync
            this.idToken = cookies.getCookie('idToken')
        },
    },
})

function http (req = { url, method:'get', data:undefined, auth:false, params }) {
    if (req.params===undefined) {
        req.params = {}
    }
    if (!req.params.lang) {
        req.params.lang = CURRENT_LANG || cnf.DEFAULT_LANG
    }
    if (req.auth) {
        // note: axios automatically adds "Content-Type: application/json" when 
        // data is detected as object.
        const authStore = useAuthStore()
        req.headers = authStore.authHeaders
        delete req.auth
    }
    return axios(req)
}
