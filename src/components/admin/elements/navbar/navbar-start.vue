<template>
<div class="navbar-start">
    <router-link class="navbar-item is-active" :to="{name: 'AdminProductList'}">
        <span class="icon has-text-primary">
            <i class="mdi mdi-book-open-page-variant"></i>
                <!-- notebook -->
        </span>
        <span class="is-hidden-touch is-hidden-widescreen">
            Catalog
        </span>
        <span class="is-hidden-desktop-only">
            Browse catalog
        </span>
    </router-link>


    <router-link class="navbar-item" :to="{name: 'AdminUserList'}">
        <span class="icon has-text-danger">
            <i class="mdi mdi-account"></i>
            <!--
            mdi-package-variant
            mdi-comment-text-outline
            mdi-comment-text-multiple-outline
            mdi-calculator
            mdi-comment-search-outline
            mdi-comment-question
            mdi-comment-question-outline
            mdi-comment-outline
            mdi-comment-check-outline
            mdi-message-bulleted
            mdi-message-text-outline
            -->
        </span>

        <span>Users</span>
    </router-link><!-- navbar-item -->

    <router-link class="navbar-item" :to="{name: 'AdminInquiries'}">
        <span class="icon has-text-info">
            <i class="mdi mdi-message-bulleted"></i>
            <!--
            mdi-package-variant
            mdi-comment-text-outline
            mdi-comment-text-multiple-outline
            mdi-calculator
            mdi-comment-search-outline
            mdi-comment-question
            mdi-comment-question-outline
            mdi-comment-outline
            mdi-comment-check-outline
            mdi-message-bulleted
            mdi-message-text-outline
            -->
        </span>

        <span>Inquiries</span>
    </router-link><!-- navbar-item -->

</div><!-- navbar-start -->
</template>

<script>
    export default {}
</script>
