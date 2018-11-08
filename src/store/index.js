import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import api from './api'
import inquiry from './inquiry'
import URI from 'urijs'

import {BASE_URL} from '@/assets/js/config'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {api, inquiry},
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
        subdomain(state, getters){
            return URI(window.location.href).subdomain()
        },
    },
    plugins: [createPersistedState()],
})
