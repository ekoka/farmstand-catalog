import {HAL} from '@/utils/hal'

export default {
    state:{
        filterSets:null,
    },
    getters:{
        filterSets(state){
            if(!state.filterSets){
                return null
            }
            return HAL(state.filterSets)
        },
    },

    mutations:{

        setFilterSets(state, {filterSets}){
            state.filterSets = filterSets
        },
        updateFilterSet(state, {filter}){
            const fsts = HAL(state.filterSets).embedded('filter_sets')
            fsts.forEach(fs=>{
                fs.updateItem({
                    collection:'filters',
                    identifier:'filter_id',
                    replacement:filter,
                })
            })
        },
        deleteFilter(state, {filter_id}){
            const fsts = HAL(state.filterSets).embedded('filter_sets')
            fsts.forEach(fs=>{
                fs.deleteItem({
                    collection:'filters',
                    identifier:'filter_id',
                    value:filter_id,
                })
            })
        },
    },

    actions:{
        getFilterSets({commit,getters},{refresh=false}={}){
            if (getters.filterSets && !refresh){
                // return early
                return getters.filterSets
            }
            const url = getters.tenant.url('filter_sets')
            return getters.http({url}).then(response=>{
                commit('setFilterSets', {filterSets:response.data})
                return getters.filterSets
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
                throw error
            })
        },
        postFilter({getters, commit, dispatch},{data, url}){
            return getters.http({
                url, data, method:'post',auth:true
            }).then(response=>{
                return dispatch('getFilterSets', {refresh:true}).then(()=>{
                    // get filter
                    return getters.http({
                        url:HAL(response.data).url('location')
                    }).then(resp=>{
                        console.log(resp.data)
                        return HAL(resp.data)
                    })
                })
            }).catch(error=>{
                console.log(error)
            })
        },

        putFilter({getters, dispatch}, {data}){
            const filter_id = data.filter_id
            let url = getters.filterSets.url(
                'filter', {filter_id})
            return getters.http({
                url, method:'put', data, auth:true
            }).then(resp=>{
                return dispatch('getFilter', {filter_id, refresh:true})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        getFilter({getters, commit},{filter_id, refresh=false}){
            const url = getters.filterSets.url('filter', {filter_id})
            if (!refresh){ 
                let resource = getters.cache({key:url})
                if (resource){
                    return HAL(resource)
                }
            }

            return getters.http({url}).then(response=>{
                commit('cache', {key:url, value:response.data})
                commit('updateFilterSet', {filter:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
        
        deleteFilter({getters, commit}, {filter_id}){
            const url = getters.filterSets.url('filter', {filter_id})
            return getters.http({url, method:'delete', auth:true
            }).then(resp=>{
                commit('deleteFilter', {filter_id})
                commit('uncache', {key:url})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
        
    },
}
