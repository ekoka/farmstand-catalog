// components
import Catalog from '@/components/admin/catalog'
import Products from '@/components/admin/catalog/products'
import Product from '@/components/admin/catalog/product'

export default {
    path: 'catalog',
    component: Catalog,
    children: [
        {
            name:'AdminProducts',
            path:'',
            component: Products},
        {
            name:'AdminNewProduct',
            path:'products/new',
            component: Product,
            props:true
        },
        {
            name:'AdminEditProduct',
            path:'products/:product_id', 
            component: Product, props:true
        },
    ]
}
