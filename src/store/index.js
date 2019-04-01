import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import createPersistedState from '@/assets/js/persistedstate'

import api from './api'
import admin from './admin'
import inquiry from './inquiry'
import URI from 'urijs'

import {BASE_URL} from '@/assets/js/config'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {api, inquiry, admin},
    state: {
        currentLang: 'en',
        defaultLang: 'en',
    },
    getters: {
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
