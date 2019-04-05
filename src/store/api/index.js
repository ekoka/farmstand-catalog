import axios from 'axios'
import accounts from './accounts'
import products from './products'
import inquiries from './inquiries'
import groups from './groups'
import images from './images'
import publicapi from './publicapi'
import {HAL} from '@/utils/hal'
import {API_ROOT, API_HOST} from '@/assets/js/config'


const jsoncopy = obj=> JSON.parse(JSON.stringify(obj))
const mkstate = ()=>{ 
    // deep copy the init state from each submodule 
    // as opposed to simply just copying the 1st level references.
    // this step is useful, for modules that make use of caching,
    // since the cache is a nested object.
    return {
        root: null,
        ...jsoncopy(accounts.state),
        ...jsoncopy(groups.state),
        ...jsoncopy(products.state),
        ...jsoncopy(inquiries.state),
        ...jsoncopy(images.state),
        ...jsoncopy(publicapi.state),
    }
}

const initApi = (state) => {
    const initState = mkstate() 
    Object.keys(initState).forEach(k=>{
        // reinitialize state
        state[k] = initState[k]
    })
}


const API = {
    namespaced: true,

    /* Do not put any attributes in the `state{}` here!
     *
     * They will be overwritten since initialization of `state`
     * happens in initApi().
     * You should place your desired attributes either in the 
     * `mkstate()` function or in one of the submodules.
     * */
    state:{},  // Warning /!\ Do not put anything here /!\

    getters: {

        http(state, getters){
            return (req={url, method:'get', data:undefined, auth:false})=>{
                if (req.auth){
                    req.headers = getters.authHeaders
                }
                delete req.auth
                return axios(req)
            }
        },

        authHeaders(state, getters){
            const authScheme = 'access_token'
            const auth = authScheme + ' ' + state.accessToken
            return {'Authorization': auth}
        },

        root(state){
            if (state.root){
                return HAL(state.root)
            }
        },
        ...accounts.getters,
        ...products.getters,
        ...inquiries.getters,
        ...groups.getters,
        ...publicapi.getters,
        ...images.getters,
    },
    mutations: {

        setRoot(state, {root}){
            state.root = root
        },

        ...accounts.mutations,
        ...products.mutations,
        ...inquiries.mutations,
        ...groups.mutations,
        ...publicapi.mutations,
        ...images.mutations,

        resetApi(state){
            initApi(state) 
        },
    },
        
    actions: {
        getRoot({getters,commit,state}){
            return getters.http({
                url: API_ROOT
            }).then(response=>{
                commit('setRoot', {root:response.data})
                return HAL(response.data)
            })
        },

        resetApi({commit, dispatch}){
            commit('resetApi')
            return dispatch('getRoot')
        },

        ...accounts.actions,
        ...groups.actions,
        ...products.actions,
        ...inquiries.actions,
        ...images.actions,
        ...publicapi.actions,
    },
}

// initialize the API state for first time before exporting.
initApi(API.state)
export default API
