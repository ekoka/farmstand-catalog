// components
const Catalog= ()=>import  ( '@/components/admin/catalog')
const ProductIndex= ()=>import  ( '@/components/admin/catalog/products')
const ProductList= ()=>import  ( '@/components/admin/catalog/products/list')
const ProductItem= ()=>import  ( '@/components/admin/catalog/products/item')
const ProductJson= ()=>import  ( '@/components/admin/catalog/products/item/json')
const GroupIndex= ()=>import  ( '@/components/admin/catalog/groups')
const GroupList= ()=>import  ( '@/components/admin/catalog/groups/list')
const GroupItem= ()=>import  ( '@/components/admin/catalog/groups/item')


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
