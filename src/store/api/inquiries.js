import {HAL} from '@/utils/hal'
export default {
    state: {},
    getters:{},

    mutations:{
        setInquiries(state, {inquiries}){
            state.inquiries = inquiries
        },
    },

    actions:{
        getInquiries({getters, commit}, {refresh=false}={}){
            let url = getters.domain.url('inquiries')
            if (!refresh){
                let resource = getters.cache({key:url})
                if(resource){
                    return HAL(resource)
                }
            }
            return getters.http({url, auth:true}).then(response=>{
                commit('cache', {key:url, value:response.data})
                commit('setInquiries', {inquiries:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
    },
}
