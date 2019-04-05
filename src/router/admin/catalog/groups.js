// components
import Index from '@/components/admin/catalog/groups'
import List from '@/components/admin/catalog/groups/list'
import Group from '@/components/admin/catalog/groups/item'


export default [
    {
        path: 'groups',
        component: Index,
        children:[
            {
                path: '', 
                name:'AdminGroups',
                component: List
            },
            {
                path:'new',
                component:Group, 
                name:'AdminNewGroup', 
                props:true
            },
            {
                path:':group_id',
                component:Group,
                name:'AdminEditGroup',
                props:true
            },
        ]
    },
]
