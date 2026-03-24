<template>
<section class="section" v-if="ready">
    <Modal id="request" :active.sync="activateRequest">
        <regUserRequest :domain="domain" />
    </Modal>
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

<script setup>
import {onMounted, ref} from 'vue'
import {useSchemaStore} from '@/store/api'

const Modal = () => import('@/components/utils/modal/index.vue'),
const regUserRequest = () => import('./access-request/registered.vue'),

import {useStore} from 'pina'

const store = useStore() 

const domain = ref(null)
const activateRequest = ref(false)
const ready = ref(false)
const show = ref(false)

onMounted((){
    // this data might already be available
    //this.getResource({resource:'publicRoot'}).then(root=>{
    //    return this.getResource({resource:'publicDomain'})
    //}).then(domain=>{
    //    this.domain = domain.data
    //    this.ready = true
    //})
})

const label = computed(() => domain.value.data.label ? domain.value.data.label : domain.value.name)
const loggedIn = computed(() => {
    if(!accessToken.value){
        return false
    }
    const idx = ['user', 'admin'].findIndex(role=>{
        accessToken.value.payload.role==role
    })
    return idx==-1
})
const idToken = computed(() => store.state.api.idToken )
const accessToken = computed(() => store.state.api.accessToken )

            
function accessRequest(){
    if(idToken && !loggedIn){
        activateRequest.value = true
        return
    }
    const params = {
        domain: domain.value.name,
        action: 'access',
    }
    const projectUrl = store.getters.PROJECT_URI
    window.location.href = projectUrl.path('/access').query(params)
}

...mapActions({
    getResource: 'api/getResource'
})
</script>
