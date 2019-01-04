<template>
<nav class="menu">
    <p class="menu-label">
        Menu
    </p>
    <ul class="menu-list">
        <li>
            <router-link :to="{name: 'Catalog'}" :class="{'is-active': active=='catalog'}">
                <span class="icon">
                    <i class="mdi mdi-notebook"></i>
                </span>
               Catalog 
            </router-link>
        </li>

        <li>
            <router-link :to="{name: 'CatalogInquiry'}" :class="{'is-active': active=='inquiry'}">
                <span class="icon">
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
               Request for Quotation
            </router-link>
        </li>
    </ul>
</nav><!-- menu -->
</template>

<script>
export default {
    props: ['active']
}
</script>
