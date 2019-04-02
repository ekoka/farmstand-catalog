<template>
    <div></div>
</template>
<script>
import URI from 'urijs'
export default {
    mounted(){
        const params = URI(window.location.href).query(true)
        window.location.href = decodeURIComponent(params.next)
    }
}
</script>

