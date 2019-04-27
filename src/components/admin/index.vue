<template>
<div v-if="ready">
    <navbar class="container is-fluid"/>
    <section class="section"> 
        <router-view class="container is-fluid" />
    </section>
</div>
</template>

<script>
import cookies from '@/utils/cookies'
import URI from 'urijs'
import {mapActions, mapMutations} from 'vuex'

export default {
    components: {
        navbar: ()=>import('./elements/navbar'),
    },

    data(){
        return {
            ready: false
        }
    },

    computed: {
        loggedIn(){
            const token = this.$store.state.accessToken 
            return token && token.payload.role=='admin'
        }
    },

    mounted(){
        if(!this.loggedIn){
            return
        }
        const account = this.$store.getters['api/account']
        if(!account){
            // not logged in
            this.$router.push({name:'Index'})
            return
        }
        this.getRoot().then(()=>{
            return this.getDomain({
                domain:this.$store.getters.subdomain
            })
        }).then(()=>{
            this.ready = true
        })
    },

    watch: {
        loggedIn: {
            immediate: true,
            handler(newValue, oldValue){
                if(!newValue){
                    this.$router.push({name:'Index'})
                }
            }
        },
    },


    methods:{
        ...mapActions({
            'getRoot': 'api/getRoot',
            'getDomain': 'api/getDomain',
            'getAccount': 'api/getAccount',
            'getProfile': 'api/getProfile',
        }),
        ...mapMutations({
            'setAccessToken': 'api/setAccessToken',
        }),
    }


}
</script>
