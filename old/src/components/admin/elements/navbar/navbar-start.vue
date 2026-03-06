<template>
<div class="navbar-start">
    <router-link class="navbar-item is-active" :to="{name: 'AdminProductList'}">
        <span class="icon has-text-primary">
            <i class="iconify mdi" data-icon="mdi-book-open-page-variant"></i>
                <!-- notebook -->
        </span>
        <span class="is-hidden-touch is-hidden-widescreen">
            Catalog
        </span>
        <span class="is-hidden-desktop-only">
            Catalog
        </span>
    </router-link>


    <router-link class="navbar-item" :to="{name: 'AdminUserList'}">
        <span class="icon has-text-danger">
            <i class="iconify mdi" data-icon="mdi-account"></i>
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
            <i class="iconify mdi" data-icon="mdi-message-bulleted"></i>
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

    <a class="navbar-item">
        <span class="icon has-text-primary">
            <i class="iconify mdi" data-icon="mdi-finance"></i>
        </span>
        <span>Reports</span>
    </a>

</div><!-- navbar-start -->
</template>

<script>
    export default {}
</script>
