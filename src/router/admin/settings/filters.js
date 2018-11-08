// components
import Index from '@/components/admin/settings/filters'
import List from '@/components/admin/settings/filters/list'
import Filter from '@/components/admin/settings/filters/filter'


export default [
    {
        path: 'filters',
        component: Index,
        children:[
            {path: '', name:'AdminFilters', component: List},
            {path:':filter_set_id/add', component:Filter, 
                        name:'AdminAddFilter', props:true},
        ]
    },
    {
        path: 'filter',
        component: Index,
        children:[
            {path:':filter_id', component:Filter, name:'AdminEditFilter',
                props:true},
        ]
    },
]
