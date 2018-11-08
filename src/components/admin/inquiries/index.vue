<template>
<div>
    <h2 class="subtitle">Inquiries</h2>

    <router-view/>

</div>
</template>

<script>
export default {
    created(){
        this.cmpalias('router-link', 'rl')
    },
}
</script>

