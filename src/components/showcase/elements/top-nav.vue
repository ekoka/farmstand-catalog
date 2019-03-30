<template>
    <nav class="navbar has-shadow">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item">
                <h1 class="title is-4">{{$store.getters.subdomain}}</h1>
            </router-link>
            <div class="navbar-burger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div><!-- navbar-brand -->

        <div class="navbar-menu">
            <div class="navbar-start">
                <router-link class="navbar-item" :to="{name: 'Showcase'}">
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
                <router-link class="navbar-item" 
                    :to="{name: 'ShowcaseInquiry'}">
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

                    <span>Request for quotation</span>
                </router-link><!-- navbar-item -->
            </div>

            <div class="navbar-end">
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        Alex Johnson
                    </div>
                    <div class="navbar-dropdown">
                        <a class="navbar-item">
                            <div>
                                <span class="icon is-small">
                                    <i class="fa fa-user-circle-o"></i>
                                </span>
                                Profile
                            </div>
                        </a>

                        <a class="navbar-item">
                            <div>
                                <span class="icon is-small">
                                    <i class="fa fa-bug"></i>
                                </span>
                                Report bug
                            </div>
                        </a>

                        <a class="navbar-item">
                            <div>
                                <span class="icon is-small">
                                    <i class="fa fa-sign-out"></i>
                                </span>
                                Sign Out
                            </div>
                        </a>

                    </div>
                </div>
            </div><!-- navbar-end -->
        </div><!-- navbar-menu -->
    </nav>
</template

<script>
import {mapActions} from 'vuex'

export default {
    methods:{
    }
}
</script>
