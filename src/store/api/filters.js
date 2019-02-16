import {HAL} from '@/utils/hal' // helper to navigate HAL API resources
import {Cache} from '@/utils/cache' // helper to manipulate a cache
import _ from 'lodash/fp'

export default {
    state:{},
    getters:{
        filters(state, getters){
            return ({filter_id=null}={})=>{
                const url = getters.domain.url('filters')
                const filters = HAL(getters.cache({key:url}))
                if(!filter_id){
                    // if no filter_id is specified, return all filters
                    return filters
                } else {
                    // only return filter associated with filter_id
                    if (filters){
                        let filter = _.find(f=>{
                            return f.key('filter_id')===filter_id
                        })(filters.embedded('filters'))
                        return filter
                    }
                }
            }
        },
    },

    mutations:{
        setFilters(state, {filters}){
            // filters is an API resource in HAL format 
            // use the helper to navigate it
            filters = HAL(filters)

            // first store the filter list in cache 
            // filters.self is a shortcut to filters.url('self')
            // filters.resource is the original JSON from the http response
            Cache(state.cache).store(filters.self, filters.resource)

            // store each filter in cache
            filters.embedded('filters').forEach(f=>{
                Cache(state.cache).store(f.self, f.resource)
            })
        },

        removeFilter(state, {filters, filter_id}){
            //filters. 
        }
    },


    actions:{
        postFilter({getters, commit, dispatch},{data}){
            let url = getters.domain.url('filters')
            return getters.http({
                url, 
                data, 
                method:'post',
                auth:true
            }).then(response=>{
                // async refresh filter list
                let filter_id = HAL(response.data).data.filter_id
                return dispatch('getFilters', {refresh:true}).then(()=>{
                    return dispatch('getFilter', {filter_id})
                })
            })
        },

        getFilters({getters, commit}, {refresh=false}={}){
            if (!refresh){
                const filters = getters.filters()
                if (filters){
                    return filters
                }
            }
            const url = getters.domain.url('filters')
            return getters.http({
                url,
                auth: true,
            }).then(response=>{
                commit('setFilters', {filters:response.data})
                let filters = getters.filters()
                return filters
            }).catch(error=>{
                console.log(error)
            })
        },

        getFilter({getters, commit}, {filter_id, refresh=false}){
            if (!refresh){ 
                let filter = getters.filters({filter_id})
                if(filter){
                    return filter
                }
            }
            const url = getters.filters().url('filter', {filter_id})

            return getters.http({
                url,
                auth:true,
            }).then(response=>{
                commit('cache', {key:url, value:response.data})
                return HAL(response.data)
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
        
        putFilter({getters, dispatch}, {filter_id, data}){
            let url = getters.filters({filter_id}).self
            return getters.http({
                url,
                method:'put',
                data,
                auth:true,
            }).then(resp=>{
                return dispatch('getFilter', {filter_id, refresh:true})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },

        deleteFilter({getters, commit}, {filter_id}){
            const url = getters.filters().url('filter', {filter_id})
            return getters.http({
                url, 
                method:'delete',
                auth:true,
            }).then(resp=>{
                commit('removeFilter', {
                    filters: getters.filters(),
                    filter_id
                })
                commit('uncache', {key:url})
            }).catch(error=>{
                console.log(error)
                console.log(error.response)
            })
        },
        
        getFilterOption({getters}, {url}){
            return getters.http({
                url,
                auth: true,
            }).then(response=>{
                return HAL(response.data)
            })
        },

        putFilterOptionProducts({getters}, {url, data}){
            return getters.http({
                url,
                data,
                method: 'put',
                auth: true,
            }).then(response=>{
                return HAL(response.data)
            })
        },
    },
}
