import Vue from 'vue'
import Router from 'vue-router'

import Showcase from './showcase'
import Admin from './admin'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        Admin,
        Showcase,
    ]
})
