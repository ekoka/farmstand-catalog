import Vue from 'vue'
import Router from 'vue-router'

import Showcase from './showcase'
import Admin from './admin'
import Redirect from '@/components/redirect'
import Index from '@/components/home'


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        Admin,
        Showcase,
        {
            name: 'Redirect',
            path: '/redirect',
            component: Redirect,
        },
        {
            name: 'Index',
            path: '',
            component: Index,
        },
    ]
})
