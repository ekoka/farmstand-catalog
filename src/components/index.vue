<template>
<div>
    <h1>KISS Order Manager</h1>
    <rl :to="{name:'Signin'}">Log In</rl> | <rl :to="{name:'Signup'}">Sign Up</rl>

    <router-view></router-view>

</div>
</template>

<script>
export default {
    created(){
        this.cmpalias('router-link', 'rl')
    }
}
</script>

