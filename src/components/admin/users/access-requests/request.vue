<template>
<div>
    <p class="content">
        <span class="tag" :class="tagClass(request.status)">
            {{request.status}}
        </span>
    </p>
    <p class="heading">
        <strong>Date and time of request</strong>
    </p>
    <p class="content">
        {{request.creation_date}}
    </p>

    <p class="heading">
        <strong>Message</strong>
    </p><!-- content -->
    <p class="content">
        {{request.message}}
    </p>

    <p class="heading">
        <strong>From </strong>
        <p>
            <strong>{{name}}</strong> 
        </p>
        <p><code>{{request.account.email}}</code></p>
    </p>

    <p class="content">
        <template v-if="request.account.phone">
            {{request.account.phone}}
            <br>
        </template>
        <template v-if="request.account.role">
            {{request.account.role}}
            <br>
        </template>
        <template v-if="request.account.company">
            {{request.account.company}}
            <br>
        </template>
        <template v-if="request.account.city">
            {{request.account.city}}
            <br>
        </template>
        <template v-if="request.account.country">
            {{request.account.country}}
        </template>
    </p><!-- content -->

    <p class="heading">
        <strong>Reply (optional)</strong>
    </p>
    <div class="field">
        <textarea class="textarea"></textarea>
    </div>

    <p class="heading">
        <strong>Actions</strong>
    </p>

    <div class="buttons">
        <button @click="approveRequest" class="button is-success is-outlined">Approve</button>
        <button @click="declineRequest" class="button  is-danger is-outlined">Decline</button>
        <!--<button class="button  is-dark is-outlined">Blacklist</button>-->
        <button @click="archiveRequest" :disabled="request.status=='pending'" class="button is-warning ">Archive</button>
    </div><!-- buttons -->
</div>
</template>

<script>
import {mapActions} from 'vuex'
import {HAL} from '@/utils/hal' 
export default {
    props: ['request'],
    computed:{
        name(){
            const account = this.request.account
            return account.first_name + ' ' + account.last_name 
        },
        url(){
            return HAL(this.request).self
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

    methods:{
        approveRequest(){
            this.postDomainAccount({data:{
                account_id:this.request.account.account_id,
                role: 'user',
            }}).then(response=>{
                this.patchAccessRequest({
                    url:this.url,
                    data:{
                        status: 'approved',
                    },
                })
            }).catch(error=>{
                console.log(error)
            })
        },

        declineRequest(){
            this.deleteDomainAccount({
                account_id: this.request.account.account_id
            }).then(response=>{
               return this.patchAccessRequest({
                    url:this.url,
                    data:{
                        status: 'declined',
                    },
                })
            })
        },

        archiveRequest(){
            this.patchAccessRequest({
                url: this.url,
                data: {
                    archived:true,
                }
            })
        },
        ...mapActions({
            postDomainAccount: 'api/postDomainAccount',
            deleteDomainAccount: 'api/deleteDomainAccount',
            patchAccessRequest: 'api/patchDomainAccessRequest',
        })
    },
}
</script>
