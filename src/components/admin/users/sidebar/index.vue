<template>
<div>
    <nav class="menu">
        <p class="subtitle is-4">
           Users /
        </p>
        <ul class="menu-list">
            <li>
                <router-link :to="{name:'AdminUserList'}" :exact="!existingUsersRoute" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span class="is-size-4">Clients</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminAccessRequests'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span class="is-size-4">Access requests</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminUserInvites'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span class="is-size-4">Invites</span>
                </router-link>
            </li>
        </ul>
    </nav><!-- menu -->
</div><!-- column -->
</template>
<script>
import find from 'lodash/fp/find'

export default {
    computed: {
        existingUsersRoute(){
            const routeNames = [ 
                'AdminUserList', 'AdminNewUser', 'AdminEditUser',]
            const rv = find(name=>{
                return this.$route.name==name
            })(routeNames)
            return rv
        }
    }
}
</script>
