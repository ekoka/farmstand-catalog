<template>
<div class="navbar-end">
    <div class="navbar-item has-dropdown is-hoverable">
        <div class="navbar-link">
            {{account.first_name}} {{account.last_name}}
        </div>
        <div class="navbar-dropdown">
            <a class="navbar-item">
                <div>
                        <a target="_blank" :href="accountUrl">
                        <span class="icon is-small">
                            <i class="mdi mdi-account-circle"></i>
                        </span>
                        Go to your account
                    </a>
                </div>
            </a>

            <!--<a class="navbar-item">
                <div>
                    <span class="icon is-small">
                        <i class="mdi mdi-logout"></i>
                    </span>
                    Exit Productlist
                </div>
            </a>-->

        </div>
    </div>
</div><!-- navbar-end -->
</template>
<script>
import {PRODUCTLIST_INDEX} from '@/assets/js/config'
import URI from 'urijs'
import cookies from '@/utils/cookies'
export default {
    computed:{
        account(){
            return this.$store.getters['api/account'].data
        },
        accountUrl(){
            return URI(PRODUCTLIST_INDEX).path('/account')
        },
    },
    methods:{

    }
}
</script>
