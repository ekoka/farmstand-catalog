// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'

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
Vue.prototype.cmpalias = function(cmpName, alias) {
    /* because sometimes global components names are too damn long! */
    this.$options.components[alias] = this.$options.components[cmpName]
}

/* eslint-disable no-new */
const VERSION = '1'
new Vue({
    el: '#app',
    created(){
        this.versionReset()
        //localStorage.clear()
        this.$store.dispatch('api/getRoot')
    },
    methods:{
        versionReset(){
            // Clear the state if the version changes. This ensures
            // that clients are not stuck with a state that is inconsistent 
            // with latest changes.
            if(localStorage.getItem('VERSION') == VERSION){
                return
            }
            this.$store.commit('api/resetApi')
            this.$store.commit('inquiry/resetInquiry')
            localStorage.setItem('VERSION', VERSION)
        }
    },
    store,
    router,
    components: { App },
    template: '<App/>'
})


window.onerror = function(message, source, lineno, colno, error) {
  console.log('Exception: ', error)
}
