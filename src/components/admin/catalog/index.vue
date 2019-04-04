<template>
<div class="columns">
    <notification 
        eventName="notification-message" 
        :defaults="{timeout:2}">
    </notification>
    <sidebar class="column is-2-tablet is-2-desktop is-2-widescreen"></sidebar>
    <router-view class="column"/>
</div>
</template>

<script>
import sidebar from './sidebar'
import notification from '@/components/utils/messaging/notification'
export default {
    components : {sidebar, notification}
}
</script>
