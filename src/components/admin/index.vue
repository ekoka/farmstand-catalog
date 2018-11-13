<template>
<div>
    <h2 class="title">Catalog Manager</h2>
    <div><a @click="signout">Sign out</a></div>

    <div v-if="tenant">
        <rl :to="{name:'AdminInquiries'}"> Inquiries </rl> | <rl :to="{name:'AdminProducts'}">Catalog</rl> | <rl :to="{name:'AdminSettings'}">Settings</rl>

        <router-view/>
    </div>

</div>
</template>

<script>
import URI from 'urijs'
import {mapActions, mapMutations} from 'vuex'
export default {

    data(){
        return {
            tenant: null,
            account: null,
        }
    },

    mounted(){
        if(!this.account){
            //this.$router.push({name:'Signup'})
            //window.location.replace('http://localhost:8080/signup')
        }
    },
    created(){
        this.cmpalias('router-link', 'rl')

        //let url = URI(window.location.href)
        //let tenant = url.subdomain()
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
        signout(){
            this.$store.commit('api/resetApi')
            //this.$router.push({name:'Signup'})
            window.location.replace('http://localhost:8080/signup')
        },

        ...mapMutations({
            setAccessKey: 'api/setAccessKey',
        }),

        ...mapActions({
            'getRoot': 'api/getRoot',
            'getTenant': 'api/getTenant',
            'getAccount': 'api/getAccount',
        })

    }
}
</script>

