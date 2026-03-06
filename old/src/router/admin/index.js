// components
const Admin= ()=>import  ( '@/components/admin')
const Domain= ()=>import  ( '@/components/admin/domain')
// routes
import Catalog from './catalog'
import Users from './users'
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
    ]
}
