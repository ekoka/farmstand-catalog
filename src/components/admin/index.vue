<template>
<div v-if="ready">
    <navbar class="container is-fluid"/>
    <section class="section">
        <router-view class="container is-fluid" />
    </section>
</div>
</template>

<script>
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
        accessToken(){
            return this.$store.state.api.accessToken
        },
        loggedIn(){
            const token = this.accessToken
            return token && token.payload.role=='admin'
        },
    },

    mounted(){
        if(!this.loggedIn){
            return
        }
        const account_id = this.accessToken.payload.account_id
        return this.getAccount({account_id}).then(()=>{
            this.ready = true
        })
    },

    watch: {
        loggedIn: {
            immediate: true,
            handler(value){
                if(!value){
                    this.$router.push({name:'Index'})
                }
            }
        },
    },


    methods:{
        ...mapActions({
            'getAccount': 'api/getAccount',
        }),
    }


}
</script>
