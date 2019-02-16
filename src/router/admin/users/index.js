import UserIndex from '@/components/admin/users'
import UserList from '@/components/admin/users/list'
import UserItem from '@/components/admin/users/item'

export default {
    path: 'users',
    component: UserIndex,
    children: [
        // Products
        {
            path:'',
            component: UserList,
            name: 'AdminUserList'
        },
        {
            path: 'new',
            component: UserItem,
            name: 'AdminNewUser',
        },
        {
            path: ':user_id',
            component: UserItem,
            name: 'AdminEditUser',
            props:true,
        }
    ]
}
