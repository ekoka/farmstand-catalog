<template>
<section class="section" v-if="ready">
    <modal id="request" :active.sync="activateRequest">
        <regUserRequest :domain="domain" />
    </modal>
    <br/>
    <span v-if="show">{{name}}</span>
    <button @click="change">switch</button>
    <button @click="change2">switch2</button>
    <button @click="change3">switch3</button>
    <div class="container">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title is-1">{{label}}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="field is-grouped">
                        <div v-if="!loggedIn" class="control">
                            <button @click="accessRequest" class="button is-primary">
                                Request access
                            </button>
                        </div>
                        <div v-if="!idToken" class="control">
                            <button class="button is-primary">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import findIndex from 'lodash/fp/findIndex'
import modal from '@/components/utils/modal'
import regUserRequest from './access-request/registered'
import {mapActions} from 'vuex'

export default{
    components: {
        modal, regUserRequest,
    },
    mounted(){
        // this data might already be available
        this.getResource({resource:'publicRoot'}).then(root=>{
            return this.getResource({resource:'publicDomain'})
        }).then(domain=>{
            this.domain = domain.data
            this.ready = true
        })
    },
    computed:{
        label(){
            return this.domain.data.label ? this.domain.data.label : this.domain.name
        },
        loggedIn (){
            if(!this.accessToken){
                return false
            }
            const idx = findIndex(role=>{
                this.accessToken.payload.role==role
            })['user', 'admin']
            return idx==-1
        },
        idToken(){
            return this.$store.state.api.idToken
        },
        accessToken(){
            return this.$store.state.api.accessToken
        },
    },
    data(){
        return {
            reactivePropertyFactory: {_:null},
            domain: null,
            activateRequest: false,
            ready: false,
            show: false,
        }
    },
    methods: {
        makeReactiveProperty(key, value=null) {
            // add a new item to `reactivePropertyFactory`
            this.reactivePropertyFactory[key] = value
            // make it reactive by reassigning a copy of itself to `reactivePropertyFactory`
            this.reactivePropertyFactory = {...this.reactivePropertyFactory}
            // assign the new reactive item to the component using the same name
            if (!this[key]) {
                this.unmapped = this.reactivePropertyFactory[key]
            }
            this[key] = this.reactivePropertyFactory[key]
            // empty reactivePropertyFactory
            this.reactivePropertyFactory = {}
            this.show = true
        },
        change(){
            this.makeReactiveProperty('name', 'Michael')
        },
        change2(){
            this.name = 'John'
        },
        change3(){
            this.name.last = 'Moore'
            this.unmapped.last = 'Woo'
        },

        accessRequest(){
            if(this.idToken && !this.loggedIn){
                this.activateRequest = true
                return
            }
            const params = {
                domain: this.domain.name,
                action: 'access',
            }
            const projectUrl = this.$store.getters.PROJECT_URI
            window.location.href = projectUrl.path('/access').query(params)
        },
        ...mapActions({
            getResource: 'api/getResource'
        })
    },
}
</script>
