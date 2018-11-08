// components
import Catalog from '@/components/catalog'
import Inquiry from '@/components/catalog/inquiry'

export default {
    path: '/',
    name: 'Catalog',
    component: Catalog,
    children:[
        {name:'CatalogInquiry', component: Inquiry, path:'inquiry'},
    ],
}
