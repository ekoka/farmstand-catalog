<template>
<nav class="navbar has-shadow">
    <!--<nav class="navbar has-shadow is-spaced">-->
    <!-- is-spaced -->
    <!--<div class="container">-->
    <div class="navbar-brand">
        <router-link to="/admin" class="navbar-item has-background-grey-dark has-text-white-ter" >
            <span class="has-text-weight-bold is-size-4">
                {{label}}
            </span>
            <span class="is-size-7">
                &nbsp;admin
            </span>
        </router-link>

        <div id="navbarBurger" class="navbar-burger burger" data-target="navMenuDocumentation">
            <span></span>
            <span></span>
            <span></span>
        </div><!-- navbarBurger -->
    </div><!-- navbar-brand -->

    <div id="navMenuDocumentation" class="navbar-menu">
        <navbar-start />
        <navbar-end />
    </div>
    <!--</div> container -->
</nav>
</template>

<script>
import navbarStart from './navbar-start'
import navbarEnd from './navbar-end'
import {mapGetters} from 'vuex'

export default {
    components: {
        navbarStart,
        navbarEnd,
    },

    computed: {
        ...mapGetters({
            domain: 'api/publicDomain',
        }),
        label(){
            const lbl = this.domain.key('data').label
            const name = this.domain.key('name')
            return lbl ? lbl : name
        },

    }


}
</script>
