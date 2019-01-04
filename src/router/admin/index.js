// components
import Admin from '@/components/admin'
import Tenant from '@/components/admin/tenant'
// routes
import Catalog from './catalog'
import Settings from './settings'
import Inquiries from './inquiries'


export default {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children:[
        Catalog,
        Inquiries,
        {
            name:'AdminTenant', 
            component: Tenant, 
            path:'tenant', 
            props: true
        },
        Settings,
    ]
}
