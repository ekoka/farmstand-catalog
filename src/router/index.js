import Vue from 'vue'
import Router from 'vue-router'

import Showcase from './showcase'
import Admin from './admin'
const Index = ()=>import  ( '@/components/home')


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        Admin,
        Showcase,
        {
            name: 'Index',
            path: '',
            component: Index,
        },
    ]
})
