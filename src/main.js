import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
//import router from './router'
import EventBus from './utils/event-bus'

const app = createApp(App)

//const vuex = JSON.parse(window.localStorage.vuex)
//console.log(Object.keys(vuex))
//console.log(vuex.api)
//console.log(vuex.api.idToken)
////console.log(vuex.api.accessToken.payload)
//console.log(vuex.api.accessToken.token)
//
//
//console.log(window.location.href)
//const url = new URL(window.location.href)
//console.log(url.href)
//console.log(url.host.split('.'))
//console.log(url)

app.use(createPinia())
//app.use(router)
// EventBus plugin
app.provide('events', EventBus({}))
app.mount('#app')

//import store from './store'
//import router from './router'

//import URI from 'urijs'
//import cookies from '@/utils/cookies'
//import cnf from '@/config'
//import {i18n} from './plugins/i18n'
//
//Vue.prototype.$jsoncopy = obj=> JSON.parse(JSON.stringify(obj))
//Vue.prototype.$cnf = cnf

/* eslint-disable no-new */
//const VERSION = '1'
//new Vue({
//    el: '#app',
//
//
//
//})
//
//window.onerror = function(message, source, lineno, colno, error) {
//    console.log('Exception: ', error)
//}
