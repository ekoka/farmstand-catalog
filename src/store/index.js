import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import createPersistedState from '@/assets/js/persistedstate'

import api from './api'
import admin from './admin'
import inquiry from './inquiry'
import URI from 'urijs'

import {
    DOMAIN_HOST_TEMPLATE,
    API_ROOT,
    API_PUBLIC_ROOT,
    PRODUCTLIST_INDEX,
} from '@/assets/js/config'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {api, inquiry, admin},

    state: {
        currentLang: 'en',
        defaultLang: 'en',
    },

    getters: {
        DOMAIN_URI(state, getters){
            return URI.expand(DOMAIN_HOST_TEMPLATE, getters.subdomain)
        },
        API_ROOT_URI(state, getters){
            return URI(API_ROOT)
        },
        API_PUBLIC_ROOT_URI(state, getters){
            return URI(API_PUBLIC_ROOT)
        },
        PRODUCTLIST_URI(state, getters){
            return URI(PRODUCTLIST_INDEX)
        },

        URI(state, getters){
            return URI
        },

        lang (state, getters){
            return state.currentLang || state.defaultLang
        },
        qs_lang (state, getters){
            return 'lang=' + getters.lang
        },
        urlSubdomain(state, getters){
            return URI(window.location.href).subdomain()
        },
        subdomain(state, getters){
            return getters.urlSubdomain
        },
    },
    plugins: [createPersistedState()],
})
