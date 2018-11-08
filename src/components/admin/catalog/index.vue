<template>
<div>
    <router-view/>
</div>
</template>

<script>
export default {
    created(){
        this.cmpalias('router-link', 'rl')
    }
}
</script>
