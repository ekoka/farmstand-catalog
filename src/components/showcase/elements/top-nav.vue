<template>
    <nav class="navbar has-shadow">
        <div class="container">
            <div class="navbar-brand">
                <router-link to="/" class="navbar-item">
                    <h1 class="title is-4">{{domain.key('data').label}}</h1>
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
                            {{$t('catalog_mnu')}}
                        </span>
                        <span class="is-hidden-desktop-only">
                            {{$t('catalog_mnu')}}
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

                        <span>{{$t('rfq_mnu')}}</span>
                    </router-link><!-- navbar-item -->
                </div>

                <div class="navbar-end">
                    <div v-if="false" class="navbar-item has-dropdown is-hoverable">
                        <div class="navbar-link">
                            {{$store.getters.lang}}
                        </div>
                        <div class="navbar-dropdown">
                            <a @click="setLang('fr')" class="navbar-item" >
                                <span>Français</span>
                            </a>
                            <a @click="setLang('en')" class="navbar-item">
                                <span>English</span>
                            </a>
                        </div>
                    </div>
                    <div class="navbar-item has-dropdown is-hoverable">
                        <div class="navbar-link">{{account.data.name}}</div>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" target="_blank" :href="accountUrl">
                                <span class="icon">
                                    <i class="iconify mdi"
                                        data-icon="mdi-account-circle"></i>
                                </span>
                                <span>{{$t('account_mnu')}}</span>
                            </a>
                            <a class="navbar-item">
                                <span class="icon">
                                    <i class="iconify mdi"
                                        data-icon="mdi-logout"></i>
                                </span>
                                <span>{{$t('logout_mnu')}}</span>
                            </a>

                        </div>
                    </div>
                </div><!-- navbar-end -->
            </div><!-- navbar-menu -->
        </div>
    </nav>
</template>
<script>
import URI from 'urijs'
import {mapGetters} from 'vuex'

export default {
    computed:{
        ...mapGetters({
            account: 'api/account',
            domain: 'api/publicDomain',
        }),
        label(){
            const lbl = this.domain.key('data').label
            const name = this.domain.key('name')
            return lbl ? lbl : name
        },
        accountUrl(){
            return URI(this.$cnf.PROJECT_INDEX).path('/account')
        },
    },
    methods:{
        setLang(lang){
            this.$store.commit('setLang', {lang})
        }
    }
}
</script>
