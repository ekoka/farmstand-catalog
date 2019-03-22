import axios from 'axios'
import accounts from './accounts'
import products from './products'
import inquiries from './inquiries'
import filters from './filters'
import images from './images'
import publicapi from './publicapi'
import {HAL} from '@/utils/hal'
import {Cache} from '@/utils/cache'
import {API_ROOT, API_HOST} from '@/assets/js/config'

/*
cache API:

- store(uri, value)
- cache(key)
    returns value stored at storage[key] 
- fetch(uri)

- remove(uri)
    delete storage[key][version]

- clear(uri)
    delete storage[key]

- reset(uri)
    alias for clear(uri)
*/


const API = {
    namespaced: true,

    state:{}, // initialization of state happens in initApi()

    getters: {
        cache(state){
            return ({key})=>{
                return Cache(state.cache).fetch(key)
            }
        },

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
        ...filters.getters,
        ...publicapi.getters,
        ...images.getters,
    },
    mutations: {
        cache(state, {key, value}){
            Cache(state.cache).store(key, value)
        },

        uncache(state, {key}){
            Cache(state.cache).remove(key)
        },

        setRoot(state, {root}){
            state.root = root
        },

        ...accounts.mutations,
        ...products.mutations,
        ...inquiries.mutations,
        ...filters.mutations,
        ...publicapi.mutations,
        ...images.mutations,

        resetApi(state){
            initApi({state, skip:['root']})
            //initApi({state})
        }
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
        ...accounts.actions,
        ...filters.actions,
        ...products.actions,
        ...inquiries.actions,
        ...images.actions,
        ...publicapi.actions,
    },
}

function initApi({state, skip=[]}){
    const jsoncopy = obj=> JSON.parse(JSON.stringify(obj))
    let initState = {
        cache: {},
        root: null,
        // deep copy the state from each submodule as opposed to simply just
        // copying the 1st level references.
        // TODO: is this step really necessary?
        ...jsoncopy(accounts.state),
        ...jsoncopy(filters.state),
        ...jsoncopy(products.state),
        ...jsoncopy(inquiries.state),
        ...jsoncopy(images.state),
        ...jsoncopy(publicapi.state),
    }
    
    // delete everything not in the skip list
    // or reset to initState
    const allKeys = Object.keys(state).concat(Object.keys(initState))
    allKeys.forEach(k=>{
        if (skip.includes(k)){
            return // skip
        }
        state[k] = initState[k]
    })
}

initApi({state:API.state})

export default API
