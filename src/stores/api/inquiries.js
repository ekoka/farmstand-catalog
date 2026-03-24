import { HAL } from '@/utils/hal'
import { http } from '@/stores/http'

export default {
    state: {
        inquiries: null,
    },

    mutations:{
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
            return http({url, auth:true}).then(resp => {
                const cache = useCacheStore()
                commit('cache', {key:url, value:resp.data})
                this.state.inquiries = resp.data
                return HAL(resp.data)
            }).catch(err => {
                console.log(err)
            })
        },
    },
}
