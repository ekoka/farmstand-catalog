import UserIndex from '@/components/admin/users'
import UserList from '@/components/admin/users/list'
import UserItem from '@/components/admin/users/item'
import AccessRequests from '@/components/admin/users/access-requests'
import Invites from '@/components/admin/users/invites'

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
            path: 'access-requests',
            component: AccessRequests,
            name: 'AdminAccessRequests',
        },
        {
            path: 'invites',
            component: Invites,
            name: 'AdminUserInvites',
        },
        {
            path: 'new',
            component: UserItem,
            name: 'AdminNewUser',
        },
        // make sure to place this after the other routes
        {
            path: ':user_id',
            component: UserItem,
            name: 'AdminEditUser',
            props:true,
        },
    ]
}
