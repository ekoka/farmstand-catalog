// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import './assets/css/main.scss'
import URI from 'urijs'
import cookies from '@/utils/cookies'
import {PRODUCTLIST_INDEX} from '@/assets/js/config'


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

/* eslint-disable no-new */
const VERSION = '1'
new Vue({
    el: '#app',

    data(){
        return {
            ready: false
        }
    },

    mounted(){
        // check versions
        this.versionReset()

        // init API
        this.$store.dispatch('api/getRoot')

        this.monitorIdTokenCookie().then(()=>{
            if (this.$store.state.api.idToken){ // logged into productlist
                return this.$store.dispatch('api/postAccessToken').then(()=>{
                    // logged into subdomain
                    this.monitorAccessToken()
                }).catch(error=>{
                    // handle 401
                    if(error.response.status==401){
                        // we're not authorized to access domain.
                        // no accessToken issued.
                        return 
                    }
                    // rethrow any other error
                    throw error
                })
            }
            // not logged in
            return this.initApi()
        }).then(()=>{
            this.ready = true
        })
    },

    methods:{

        initApi: async function (){
            await this.$store.dispatch('api/resetApi')
            await this.$store.dispatch('api/getRoot')
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
                //this.$store.commit('inquiry/resetInquiry')
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
                if (exp/1000 >= accessToken.payload.exp){
                    this.$store.dispatch('api/postAccessToken').then(()=>{
                        // we keep monitoring as long as we obtain a good access token
                        setTimeout(this.monitorAccessToken, delay)
                    }).catch(error=>{
                        return this.$store.dispatch('api/deleteAccessToken')
                        if (error.response.status==401){ 
                            // idToken is not valid anymore
                            return
                        }
                    })
                }
            }
        },
    },

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
