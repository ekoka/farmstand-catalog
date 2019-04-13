const UserIndex= ()=>import  ( '@/components/admin/users')
const UserList= ()=>import  ( '@/components/admin/users/list')
const UserItem= ()=>import  ( '@/components/admin/users/item')
const AccessRequests= ()=>import  ( '@/components/admin/users/access-requests')
const Invites= ()=>import  ( '@/components/admin/users/invites')

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
