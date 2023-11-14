import Vue from 'vue'
import Vuex from 'vuex'
import URI from 'urijs'
//import createPersistedState from 'vuex-persistedstate'
import createPersistedState from '@/utils/persistedstate'
import api from './api'
import admin from './admin'
import inquiry from './inquiry'
import cnf from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {api, inquiry, admin},

    state: {
        currentLang: 'en',
        defaultLang: 'en',
    },

    getters: {
        DOMAIN_URI(state, getters){
            return URI.expand(cnf.DOMAIN_HOST_TEMPLATE, getters.subdomain)
        },
        API_ROOT_URI(state, getters){
            return URI(cnf.API_ROOT)
        },
        API_PUBLIC_ROOT_URI(state, getters){
            return URI(cnf.API_PUBLIC_ROOT)
        },
        PROJECT_URI(state, getters){
            return URI(cnf.PROJECT_INDEX)
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

    mutations: {
        setLang(state, {lang}){
            state.currentLang = lang
        },
    },

    plugins: [createPersistedState()],
})
