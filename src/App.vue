<template>
    <router-view v-if="ready"/>
</template>

<script>
export default {
    name: 'App',
    props: ['ready'],
}
</script>

