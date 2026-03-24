<template>
<div>
    <top-nav/>
    <router-view />
</div>
</template>

<script>
export default {
    components: {
        topNav: ()=>import  ( '../elements/top-nav'),
    },
}
</script>

