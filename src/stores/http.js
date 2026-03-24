import axios from 'axios'
import cnf from '@/config'
import useAuthStore from './api/auth'

const CURRENT_LANG = 'en'

export default function http (req = { url, method:'get', data:undefined, auth:false, params }) {
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
