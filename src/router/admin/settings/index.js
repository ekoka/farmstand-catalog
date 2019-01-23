import Index from '@/components/admin/settings'
import Fields from '@/components/admin/settings/fields'
// routes
export default {
    name:'AdminSettings',
    component: Index,
    path:'settings',
    children: [
        {name:'AdminFields', path:'product-fields', component: Fields},
    ]
}
