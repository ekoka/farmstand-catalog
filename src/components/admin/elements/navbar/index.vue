<template>
<nav class="navbar has-shadow is-spaced">
    <!-- is-spaced -->
    <div class="container">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
                <figure class="image">
                    <img src="@/assets/images/logo.png" >
                </figure>
            </a>

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
    </div><!-- container -->
</nav>
</template>

<script>
import navbarStart from './navbar-start'
import navbarEnd from './navbar-end'

export default {
    components: { navbarStart, navbarEnd, }

}
</script>
