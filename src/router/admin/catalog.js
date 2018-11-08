// components
import Catalog from '@/components/admin/catalog'
import Products from '@/components/admin/catalog/products'
import Product from '@/components/admin/catalog/product'

export default {
    path: 'catalog',
    name: 'AdminCatalog',
    component: Catalog,
    children: [
        {name:'AdminProducts', path:'products', component: Products},
        {name:'AdminAddProduct', path:'products/add', component: Product,
            props:true},
        {name:'AdminEditProduct', path:'products/:product_id', 
            component: Product, props:true},
    ]
}
