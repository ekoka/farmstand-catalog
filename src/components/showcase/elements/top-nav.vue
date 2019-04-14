<template>
    <nav class="navbar has-shadow">
        <div class="container">
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
                            <i class="iconify mdi" data-icon="mdi-book-open-page-variant"></i>
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

                        <span>Request for quotation</span>
                    </router-link><!-- navbar-item -->
                </div>

                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <div class="navbar-link">
                            {{account.first_name}} {{account.last_name}}
                        </div>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" target="_blank" :href="accountUrl">
                                <span class="icon">
                                    <i class="iconify mdi" 
                                        data-icon="mdi-account-circle"></i>
                                </span>
                                <span>Account</span>
                            </a>
                            <a class="navbar-item">
                                <span class="icon">
                                    <i class="iconify mdi" 
                                        data-icon="mdi-bug"></i>
                                </span>
                                <span>Report bug</span>
                            </a>

                            <a class="navbar-item">
                                <span class="icon">
                                    <i class="iconify mdi" 
                                        data-icon="mdi-logout"></i>
                                </span>
                                <span>Log out</span>
                            </a>

                        </div>
                    </div>
                </div><!-- navbar-end -->
            </div><!-- navbar-menu -->
        </div>
    </nav>
</template>
<script>
import {PRODUCTLIST_INDEX} from '@/assets/js/config'
import URI from 'urijs'
import cookies from '@/utils/cookies'
export default {
    computed:{
        account(){
            return this.$store.getters['api/account'].data
        },
        accountUrl(){
            return URI(PRODUCTLIST_INDEX).path('/account')
        },
    },
    methods:{

    }
}
</script>
