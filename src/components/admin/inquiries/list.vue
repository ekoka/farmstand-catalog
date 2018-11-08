<template>
<div>
    <ul>
        <li v-for="i in inquiries">{{
            i.key('status')}} @
            {{i.key('date')}} from 
            {{i.key('contact').first_name}} {{i.key('contact').last_name}} 
            ({{i.key('contact').email}})
        </li>
    </ul>
</div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data (){
        return {
            inquiries: [],
        }
    },
    created(){
        this.cmpalias('router-link', 'rl')
        this.getInquiries({refresh:true}).then(inquiries=>{
            if(inquiries){
                this.inquiries = inquiries.embedded('items')
            }
        })
    },

    methods:{
        
        ...mapActions({
            getInquiries: 'api/getInquiries',
        }),
    },
}
</script>

