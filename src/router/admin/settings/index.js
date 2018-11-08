import Index from '@/components/admin/settings'
import Fields from '@/components/admin/settings/fields'
// routes
import Filters from './filters'
export default {
    name:'AdminSettings',
    component: Index,
    path:'settings',
    children: [
        {name:'AdminFields', path:'product-fields', component: Fields},
        ...Filters,
    ]
}
