<template>
<div>
    <nav class="breadcrumb is-large has-arrow-separator">
        <ul>
            <li class="is-active">
                <router-link :to="{name:'AdminAccessRequests'}">Access requests</router-link>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->
    <div class="columns">
        <div class="column is-12-tablet is-6-desktop is-4-fullhd">
            <div class="card">
                <div class="card-content">
                    <div v-for="req in access_requests" class="media">
                        <div class="media-content">
                            <p class="title is-5 is-spaced is-marginless">
                                <a @click="access_request=req">{{name(req.account)}}</a>
                            </p>
                            <p class="is-size-6">{{company(req.account)}}</p>
                        </div><!-- media-content -->

                        <div class="media-right">
                            <span class="tag" :class="tagClass(req.status)">{{req.status}}</span>
                        </div><!-- media-right -->
                    </div><!-- media -->
                </div><!-- card-content-->
            </div><!-- card -->
        </div><!-- column -->

        <request v-if="access_request" :request="access_request" 
            class="column is-6-desktop is-6-widescreen">
        </request>

    </div><!-- columns -->
</div>
</template>

<script>
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import request from './request'
import {mapActions} from 'vuex'
export default {
    components:{
        request,
    },
    data(){
        return {
            access_request:null,
            access_requests: [],
        }
    },

    computed:{
        name(){
            return (account)=>{
                return account.first_name + ' ' + account.last_name
            }
        },

        company(){
            return (account)=>{
                const company = [account.company]
                const location = account.city || account.country
                if(location){
                   company.push(location) 
                }
                return company.join(', ')
            }
        },
        tagClass(){
            return (status)=> {
                return {
                    pending: 'is-warning',
                    approved: 'is-success',
                    declined: 'is-danger',
                }[status]
            }
        },
    },

    mounted(){
        this.getAccessRequests().then(response=>{
            this.access_requests = map(access_request=>{
                return access_request.resource
            })(response.embedded('access_requests'))
        })
    },

    methods:{
        ...mapActions({
            getAccessRequests: 'api/getDomainAccessRequests',
            //patchAccessRequest: 'api/patchAccessRequest',
            postDomainAccount: 'api/postDomainAccount',
        }),
    },
}
</script>
