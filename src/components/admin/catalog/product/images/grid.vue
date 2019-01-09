<template>
<div>
    <template v-for="i, k in images">  
            {{i.aspect_ratios['1:1']['thumb']}}
    <img :src="i.aspect_ratios['1:1']['thumb']" />
    </template>
</div>
</template>

<script>
export default {
    props: ['images'],
}
</script>
