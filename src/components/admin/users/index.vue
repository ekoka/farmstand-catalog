<template>
<div class="columns">
    <sidebar class="column is-2-tablet is-2-desktop is-2-widescreen"></sidebar>
    <router-view class="column"/>
</div>
</template>

<script>
export default {
    components : {
        sidebar: ()=>import  ( './sidebar'),
    }
}
</script>
