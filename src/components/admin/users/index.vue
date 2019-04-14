<template>
<div class="columns">
    <sidebar class="column is-2-tablet is-2-desktop is-2-widescreen">
    </sidebar>
    <div class="column">
        <router-view class="container is-fluid"/>
    </div>
</div>
</template>

<script>
export default {
    components : {
        sidebar: ()=>import  ( './sidebar'),
    }
}
</script>
