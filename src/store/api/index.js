import axios from 'axios'
import upperFirst from 'lodash/fp/upperFirst'
import accounts from './accounts'
import products from './products'
import domains from './domains'
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
        ...jsoncopy(domains.state),
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

        http(state, getters, rootState, rootGetter){
            return (req={url, method:'get', data:undefined, 
                    auth:false, params})=>{
                if(req.params===undefined){
                    req.params = {}
                }
                if (req.params.lang===undefined){
                    req.params.lang = rootGetter.lang
                }
                if (req.auth){
                    req.headers = getters.authHeaders
                }
                delete req.auth
                return axios(req)
            }
        },

        authHeaders(state, getters){
            const authScheme = 'Bearer'
            const auth = authScheme + ' ' + state.accessToken.token
            return {'Authorization': auth}
        },

        root(state){
            if (state.root){
                return HAL(state.root)
            }
        },
        ...accounts.getters,
        ...domains.getters,
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
        ...domains.mutations,
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

        getResource({getters, commit, dispatch}, {resource, params=null}){
            if(getters[resource]){
                return getters[resource]
            }
            const capitalized = upperFirst(resource)
            return dispatch('get'+capitalized, params)
        },

        resetApi({commit, dispatch}){
            commit('resetApi')
            return dispatch('getRoot')
        },

        ...accounts.actions,
        ...domains.actions,
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
