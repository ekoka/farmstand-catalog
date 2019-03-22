<template>
<div>
    <navbar />
    <section class="section"> 
        <router-view/>
    </section>
</div>
</template>

<script>
import URI from 'urijs'
import {mapActions, mapMutations} from 'vuex'

import navbar from './elements/navbar'

export default {
    components: {navbar,},

    created(){
        const query = URI(window.location.search).query(true)
        let access_token = query.access_token

        if (access_token){
            this.setAccessToken({accessToken:access_token})
        }

        let lang = query.lang
        this.getRoot().then(root=>{
            return this.getProfile()
        }).then(profile=>{
            return this.getAccount({account_id:profile.data.account_id})
        }).then(account=>{
            //this.domain = domain.data
            return this.getDomain({
                domain:this.$store.getters['urlSubdomain']
            })
        })
        
        //.then(account=>{
        //            this.account = account.data
        //        })
        //    })
        //})
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
