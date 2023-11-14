// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import './assets/css/main.scss'
import URI from 'urijs'
import cookies from '@/utils/cookies'
import cnf from '@/config'
import {i18n} from './plugins/i18n'


// adding a global event bus
const EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
    $eventBus: {
        get () {
            return EventBus
        }
    },
})

store.$eventBus = EventBus

Vue.config.productionTip = false
Vue.prototype.$jsoncopy = obj=> JSON.parse(JSON.stringify(obj))
Vue.prototype.$cnf = cnf

/* eslint-disable no-new */
const VERSION = '1'
new Vue({
    el: '#app',

    data(){
        return {
            ready: false
        }
    },

    computed:{
        lang(){
            return this.$store.getters.lang
        }
    },
    watch:{
        lang: {
            handler(v){
                this.$i18n.locale = v
                import(`./lang/${v}.js`).then(response=>{
                    this.$i18n.setLocaleMessage(v, response.default)
                })
            },
            immediate: true,
        },
    },

    mounted(){
        // check versions
        this.versionReset()
        //this.$i18n.locale = this.$store.getters.lang

        // init API
        this.$store.dispatch('api/getRoot').then(()=>{
            return this.monitorIdTokenCookie()
        }).then(()=>{
            return this.$store.dispatch('api/getPublicRoot')
        }).then(()=>{
            return this.$store.dispatch('api/getPublicDomain')
        }).then(()=>{
            if (this.$store.state.api.idToken){
                console.log('logged in')
                // logged in; obtain an access token
                return this.$store.dispatch('api/postAccessToken').then(()=>{
                    // start monitoring access token
                    this.monitorAccessToken()
                }).catch((error)=>{
                    // handle 401 (id token has likely been revoked)
                    if(error.response.status==401){
                        // no accessToken issued.
                        return
                    }
                    // rethrow any other error
                    throw error
                })
            }
            console.log('not logged in')
            // not logged in
            return this.initApi()
        }).then(()=>{
            this.ready = true
        })
    },

    methods:{

        initApi: async function (){
            // reinitialize the store (empty data)
            await this.$store.dispatch('api/resetApi')
            // repopulate API root
            await this.$store.dispatch('api/getRoot')
            await this.$store.dispatch('api/getPublicRoot')
            await this.$store.dispatch('api/getPublicDomain')
        },

        versionReset(){
            /* Clear the state if the version changes. This ensures
             that clients are not stuck with a state that is inconsistent
             with latest changes.
             */
            // if versions are the same return
            if(localStorage.getItem('VERSION') == VERSION){
                return
            }
            // otherwise clear all
            this.$store.dispatch('api/resetApi').then(()=>{
                localStorage.setItem('VERSION', VERSION)
                window.location.reload()
            })
        },

        monitorIdTokenCookie: async function(){
            // synchronize idToken in cookie with idToken in localStorage
            const idToken = cookies.getCookie('idToken')
            if(idToken!=this.$store.state.api.idToken){
                // change of state
                this.$store.dispatch('api/syncIdToken').then(()=>{
                    // if the change of state was a removal of the idToken
                    // also remove the accessToken
                    if(!this.$store.state.api.idToken){
                        this.$store.dispatch('api/deleteAccessToken')
                    }
                })
            }
            setTimeout(this.monitorIdTokenCookie, 2000)
        },

        monitorAccessToken(){
            const delay = 5 * 60 * 1000 // 5 minutes
            if(this.$store.state.api.idToken){
                const accessToken = this.$store.state.api.accessToken
                const exp = Date.now() + delay*2 // 10 minutes before expiry
                if (exp>=accessToken.payload.exp){
                    // refresh access token
                    this.$store.dispatch('api/postAccessToken').catch(error=>{
                        if (error.response.status==401){
                            // idToken is not valid anymore
                            this.$store.dispatch('api/deleteAccessToken')
                        }
                        return
                    })
                }
                // try again in 5 minutes
                // we keep monitoring as long as we obtain an access token
                setTimeout(this.monitorAccessToken, delay)
            }
        },
    },

    i18n,
    store,
    router,
    components: {
        App: ()=> import('./App'),
    },
    // App component is loaded only once bootstrapping is done
    template: '<App :ready="ready"/>'

})

window.onerror = function(message, source, lineno, colno, error) {
    console.log('Exception: ', error)
}
