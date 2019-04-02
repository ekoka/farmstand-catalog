// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
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
        this.versionReset()
        this.checkIsLoggedIn().then(()=>{
            //return this.$store.dispatch('api/getDomain', {
            //    domain:this.$store.getters['subdomain']
            //})
        }).then(()=>{
            this.ready = true
        })
    },

    methods:{
        checkIsLoggedIn: async function(){
            // (1) first check if accessk token is provided in url
            await this.authenticate()

            // (2) access token not provided in url
            // check if there's an "account_id" cookie present, which 
            // indicates that user is already logged in to productlist.io
            // (via her account) 
            const account_id = cookies.getCookie('account_id')
            if (account_id){
                // user is indeed logged in
                
                // but does the data in localStorage correspond
                // to this user, or is it some other user.
                // let's verify.
                // first try retrieving account if it was stored 
                // in sometime ago in localStorage.
                const account = this.$store.getters['api/account']
                if (account){
                    // we found an account indeed.
                    // check if it matches the cookie
                    if (account.data.account_id==account_id){
                        // both accounts match! we're done here, this is 
                        // a returning user.
                        this.ready = true 
                        return 
                    } 
                }
                // if we're here it means one of two things:
                // - either there was a mismatch between account_id in
                // cookie (actual logged in user) and account_id in 
                // localStorage.
                // - or there was no account_id in localStorage at all
                // (user was not logged in to this catalog). 
                //
                // In both cases the cookie is the source of truth since
                // it's set by the authentication process in the account 
                // admin.
                // localStorage must be cleared and the user must be
                // redirected to her account to get an access_token.
                this.redirectToAccountAdmin()
                return 
            }
            // account was not found in cookie, meaning user is not logged
            // in. Let's ensure a clean state with no lingering account 
            // information.
            // Normally we shouldn't need this, but one never knows what
            // a user does with their browser.
            await this.$store.dispatch('api/resetApi')
            
            // no account_id in cookie, we're done. Let subcomponents
            // handle this situation.
            this.ready = true
        },

        authenticate: async function (){
            const query = URI(window.location.search).query(true)
            if(query.access_token){
                // if access_token was provided
                // reset all resources
                await this.$store.dispatch('api/resetApi')
                // and set the new access token
                this.$store.commit('api/setAccessToken', {
                    accessToken:query.access_token
                })
            }
            // refresh the root resource
            await this.$store.dispatch('api/getRoot')

            if(!this.$store.state.api.accessToken){
                // if there's no access token in storage, just return
                return
            }
            let profile = null
            // so we have an access token and we have the urls

            // let's see if we can get a profile
            try {
                profile = await this.$store.dispatch('api/getProfile')
            }catch(e){
                // if we get here it means the access token 
                // doesn't have a matching profile.
                // let's just return, we'll let each component handles
                // the situation as it sees fit.
                return
            }
            // if we got here it means we could get a profile
            // let's try to get an account as well.
            // This should normally always be successful.
            try{
                await this.$store.dispatch('api/getAccount', {
                    account_id:profile.data.account_id
                })
            }catch(e){
                // we normally shouldn't end up here;
                // in case we do, let's just abort the whole thing;
                await this.$store.dispatch('api/resetApi')
            }
            // not really needed here
            //await this.$store.dispatch('api/getDomain', {
            //    domain:this.$store.getters['urlSubdomain']
            //})
        },

        redirectToAccountAdmin(){
            const domain = this.$store.getters['subdomain']
            const path = URI(window.location.href).path()
            const params = URI(window.location.href).query(true)
            // remove old access token in case it's present
            delete params['access_token']
            // build next url
            const next = encodeURIComponent(URI(path).query(params).href())
            const redirect = URI(PRODUCTLIST_INDEX).path(
                '/account/authorize').query({next, domain})
            window.location.href = redirect.href()
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
        }
    },

    store,
    router,
    components: {App},
    // App component is loaded only once bootstrapping is done 
    template: '<App :ready="ready"/>'

})
