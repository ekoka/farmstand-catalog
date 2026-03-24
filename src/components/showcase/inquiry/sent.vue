<template>
<section class="section">
    <div class="columns">
        <div class="column is-4-tablet is-3-desktop is-2-widescreen">
            <!--<left-nav active="inquiry"/>-->
        </div>
        <div class="column">
            <h3 class="subtitle is-3">{{$t('inquiry.msg.inquiry_sent')}}</h3>
            <router-link :to="{name: 'Showcase'}">{{$t('inquiry.msg.return_to_catalog')}}</router-link>
        </div>
    </div>
</section>
</template>

<script>
export default {
}
</script>
