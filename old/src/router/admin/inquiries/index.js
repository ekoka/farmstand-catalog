// components
const Index= ()=>import  ( '@/components/admin/inquiries')
//import List from '@/components/admin/inquiries/list'
//import Item from '@/components/admin/inquiries/item'

export default {
    name: 'AdminInquiries',
    path: 'inquiries',
    component: Index, 
    props: true,
    children:[
    ],
}
