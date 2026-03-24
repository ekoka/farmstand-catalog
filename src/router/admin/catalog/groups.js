// components
const Index= ()=>import  ( '@/components/admin/catalog/groups')
const List= ()=>import  ( '@/components/admin/catalog/groups/list')
const Group= ()=>import  ( '@/components/admin/catalog/groups/item')


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
