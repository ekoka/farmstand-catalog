<template>
<div class="navbar-end">
    <div class="navbar-item has-dropdown is-hoverable">
        <div class="navbar-link">
            {{account.name}}
        </div>
        <div class="navbar-dropdown">
            <a class="navbar-item" target="_blank" :href="accountUrl">
                <span class="icon">
                    <i class="iconify mdi"
                        data-icon="mdi-account-circle"></i>
                </span>
                <span>Your account</span>
            </a>

            <!--<a class="navbar-item">
                <div>
                    <span class="icon is-small">
                        <i class="mdi mdi-logout"></i>
                    </span>
                    Exit
                </div>
            </a>-->

        </div>
    </div>
</div><!-- navbar-end -->
</template>
<script>
import URI from 'urijs'
export default {
    computed:{
        account(){
            return this.$store.getters['api/account'].data
        },
        accountUrl(){
            const project_url = this.$root.$cnf.PROJECT_INDEX
            return URI(project_url).path('/account')
        },
    },
    methods:{

    }
}
</script>
