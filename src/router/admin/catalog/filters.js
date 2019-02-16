// components
import Index from '@/components/admin/catalog/filters'
import List from '@/components/admin/catalog/filters/list'
import Filter from '@/components/admin/catalog/filters/item'


export default [
    {
        path: 'filters',
        component: Index,
        children:[
            {
                path: '', 
                name:'AdminFilters',
                component: List
            },
            {
                path:'new',
                component:Filter, 
                name:'AdminNewFilter', 
                props:true
            },
            {
                path:':filter_id',
                component:Filter,
                name:'AdminEditFilter',
                props:true
            },
        ]
    },
]
