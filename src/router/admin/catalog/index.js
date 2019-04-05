// components
import Catalog from '@/components/admin/catalog'
import ProductIndex from '@/components/admin/catalog/products'
import ProductList from '@/components/admin/catalog/products/list'
import ProductItem from '@/components/admin/catalog/products/item'
import ProductJson from '@/components/admin/catalog/products/item/json'


import GroupIndex from '@/components/admin/catalog/groups'
import GroupList from '@/components/admin/catalog/groups/list'
import GroupItem from '@/components/admin/catalog/groups/item'


export default {
    name: 'AdminCatalog',
    path: 'catalog',
    component: Catalog,
    children: [
        // Products
        {
            path:'products',
            component: ProductIndex,
            children: [
                {
                    name: 'AdminProductList',
                    path: '',
                    component: ProductList,
                },
                {
                    name:'AdminNewProduct',
                    path:'new',
                    component: ProductItem,
                    props:true
                },
                {
                    name:'AdminEditProduct',
                    path:':product_id', 
                    component: ProductItem, 
                    props:true
                },
                {
                    name:'AdminEditProductJson',
                    path:':product_id/json', 
                    component: ProductJson, 
                    props:true
                },
            ],
        },
        // Groups
        {
            path: 'groups',
            component: GroupIndex,
            children: [
                {
                    path: '', 
                    name:'AdminGroupList',
                    component: GroupList,
                },
                {
                    path:'new',
                    component:GroupItem, 
                    name:'AdminNewGroup', 
                    props:true,
                },
                {
                    path:':group_id',
                    component:GroupItem,
                    name:'AdminEditGroup',
                    props:true,
                },
            ]
        },
    ]
}
