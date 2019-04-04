<template>
<div v-if="ready">
    <navbar />
    <section class="section"> 
        <router-view />
    </section>
</div>
</template>

<script>






import cookies from '@/utils/cookies'
import URI from 'urijs'
import {mapActions, mapMutations} from 'vuex'
import navbar from './elements/navbar'

export default {
    components: {navbar,},

    data(){
        return {
            ready: false
        }
    },

    created(){
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

    mounted(){
        const watchLoggedState = ()=>{
            // are we logged in?
            const account_id = cookies.getCookie('account_id')
            //if(!this.$store.state['loggedIn']){
            if(!account_id){
                this.ready = false
                // clear the state again, just in case the cookie was
                // removed by another app than this one (e.g. subdomain).
                this.$store.dispatch('api/resetApi').then(()=>{
                    this.$router.push({name:'Index'})
                })
            }
            setTimeout(watchLoggedState, 2000)
        }
        watchLoggedState()
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
