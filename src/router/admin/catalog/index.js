// components
import Catalog from '@/components/admin/catalog'
import ProductIndex from '@/components/admin/catalog/products'
import ProductList from '@/components/admin/catalog/products/list'
import ProductItem from '@/components/admin/catalog/products/item'


import FilterIndex from '@/components/admin/catalog/filters'
import FilterList from '@/components/admin/catalog/filters/list'
import FilterItem from '@/components/admin/catalog/filters/item'


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
            ],
        },
        // Filters
        {
            path: 'filters',
            component: FilterIndex,
            children: [
                {
                    path: '', 
                    name:'AdminFilterList',
                    component: FilterList,
                },
                {
                    path:'new',
                    component:FilterItem, 
                    name:'AdminNewFilter', 
                    props:true,
                },
                {
                    path:':filter_id',
                    component:FilterItem,
                    name:'AdminEditFilter',
                    props:true,
                },
            ]
        },
    ]
}
