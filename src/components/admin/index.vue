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
        let access_key = query.access_key

        if (access_key){
            this.setAccessKey({accessKey:access_key})
        }

        let lang = query.lang

        this.getRoot().then(root=>{
            this.getTenant({tenant:this.$store.getters['subdomain']}).then(tenant=>{
                this.tenant = tenant.data
                this.getAccount().then(account=>{
                    this.account = account.data
                })
            })
        })
    },
    methods:{
        ...mapActions({
            'getRoot': 'api/getRoot',
            'getTenant': 'api/getTenant',
            'getAccount': 'api/getAccount',
        }),
        ...mapMutations({
            'setAccessKey': 'api/setAccessKey',
        }),
    }


}
</script>
