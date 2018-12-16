<template>
<div>
    <h1>KISS Order Manager</h1>
    <router-link :to="{name:'Signin'}">Log In</router-link> | <router-link :to="{name:'Signup'}">Sign Up</router-link>

    <router-view></router-view>

</div>
</template>

<script>
export default {}
</script>

