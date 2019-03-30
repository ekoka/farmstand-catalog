<template>
<div>
    <nav class="menu">
        <p class="menu-label">
           User management 
        </p>
        <ul class="menu-list">
            <li>
                <router-link :to="{name:'AdminUserList'}" :exact="!existingUsersRoute" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Users</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminAccessRequests'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Access requests</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminUserInvites'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Invites</span>
                </router-link>
            </li>
        </ul>
    </nav><!-- menu -->
</div><!-- column -->
</template>
<script>
import {find} from 'lodash/fp'

export default {
    computed: {
        existingUsersRoute(){
            const routeNames = [ 
                'AdminUserList', 'AdminNewUser', 'AdminEditUser',]
            const rv = find(name=>{
                return this.$route.name==name
            })(routeNames)
            console.log(this.$route.name)
            console.log(rv)
            return rv
        }
    }
}
</script>
