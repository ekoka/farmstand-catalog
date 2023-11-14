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
                    <span class="is-size-6">Have access</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminAccessRequests'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span class="is-size-6">Requested access</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name:'AdminUserInvites'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span class="is-size-6">Invited</span>
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
