<script setup>
import useRootStore from '@/stores/api/root'
import useAuthStore from '@/stores/api/auth'

const rootStore = useRootStore()
rootStore.getRoot()

const authStore = useAuthStore()
authStore.syncIdToken()
authStore.postAccessToken()

</script>

<template>
    <h1> Hello </h1>
    {{ rootStore.root }}
    <br/>
    {{ authStore.idToken }}
    <div> 
        <pre> </pre>
    </div>
</template>

<style scoped>

</style>
