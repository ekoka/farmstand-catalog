import Vue from 'vue'
import Router from 'vue-router'

// components
//import KISS from '@/components/'
//import AdminIndex from '@/components/admin'
//routes
import Catalog from './catalog'
import Admin from './admin'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        Admin,
        //{'name': 'KISS', path:'/kiss', component: KISS},
        //{path: '/admin', name: 'AdminIndex', component: AdminIndex,},

        Catalog,
    ]
})
