// components
import Admin from '@/components/admin'
import Domain from '@/components/admin/domain'
// routes
import Catalog from './catalog'
import Users from './users'
import Settings from './settings'
import Inquiries from './inquiries'


export default {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children:[
        Catalog,
        Inquiries,
        Users,
        {
            name:'AdminDomain', 
            component: Domain, 
            path:'domain', 
            props: true
        },
        Settings,
    ]
}
