import {HAL} from '@/utils/hal' // helper to navigate HAL API resources
import {Cache} from '@/utils/cache' // helper to manipulate a cache
import {find} from 'lodash/fp'
import {Buffer} from '@/utils/cache'
import {map, reduce, difference, each, union} from 'lodash/fp'


export default {
    state:{
        filterCache: {stack:[], lock:[]},
    },
    getters:{
        filters(state){
            return ({filter_id=null}={})=>{
                if (state.filters){
                    const filters = HAL(state.filters)
                }
                if(!filter_id){
                    // if no filter_id is specified, return all filters
                    return filters
                } else {
                    // only return filter associated with filter_id
                    return find(f=>{
                        return f.key('filter_id')===filter_id
                    })(filters.embedded('filters'))
                }
            }
        },
    },

    mutations:{
        setFilters(state, {filters}){
            // filters is an API resource in HAL format 
            // use the helper to navigate it
            state.filters = filters
        },

        removeFilter(state, {filter_id=null}){
            Buffer(state.filterCache).remove({filter_id})
        },

        setFilter(state, {filter}){
            const filter_id = HAL(filter).key('filter_id')
            const path = {filter_id}
            Buffer(state.filterCache).store(path, filter)
        },
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
                dispatch('getFilters')
                return filter_id
            }).then((filter_id)=>{
                return dispatch('getFilter', {filter_id})
            })
        },

        getFilters({getters, commit}, {params}={}){
            const url = getters.domain.url('filters')
            return getters.http({url, auth:true}).then(response=>{
                return HAL(response.data)
            })
        },

        //getFilterResources({getters, commit}){
        //    const url = getters.domain.url('filters')
        //    return getters.http({
        //        url,
        //        auth: true,
        //    }).then(response=>{
        //        commit('setFilters', {filters:response.data})
        //        return getters.filters()
        //    }).catch(error=>{
        //        console.log(error)
        //    })
        //},        
        getFilterResources({getters, state, commit, rootState}, {filter_ids}){
            const buffer = Buffer(state.filterCache)
            const halify = map(f=>{
                return HAL(f)
            })
            const finder = reduce((accumulator, filter_id)=>{
                const resource = buffer.fetch({filter_id})
                if(resource){
                    accumulator.found.push(resource)
                    accumulator.foundIds.push(filter_id)
                }
                return accumulator
            }, {found:[], foundIds:[]})
            const {found, foundIds} = finder(filter_ids)
            const notfound = difference(filter_ids, foundIds)

            if(notfound.length==0){
                return halify(found)
            }
                
            const url = getters.domain.url('filter_resources', null, {
                fid:notfound
            })
            return getters.http({
                url,
                auth:true
            }).then(response=>{
                const addNewResources = each(f=>{
                    commit('setFilter', {filter:f.resource})
                })
                const resources = HAL(response.data)
                addNewResources(resources.embedded('filters'))
                return union(halify(found), resources.embedded('filters'))
            })
        },



        //getFilter({getters, commit}, {filter_id}){
        //    const url = getters.filters().url('filter', {filter_id})

        //    return getters.http({
        //        url,
        //        auth:true,
        //    }).then(response=>{
        //        return HAL(response.data)
        //    })
        //},

        getFilter({getters, commit},{url, filter_id}){
            // always returns a fresh copy of filter resource
            if (filter_id){
                url = getters.domain.url('filter', {filter_id})
            }
            return getters.http({url, auth:true}).then(response=>{
                // halify
                commit('setFilter', {filter:response.data})
                return HAL(response.data)
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
                return dispatch('getFilter', {filter_id})
            })
        },

        deleteFilter({getters, commit}, {filter_id}){
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            let url = getters.domain.url('filter', {filter_id})
            return getters.http({
                url, method:'delete', auth:true
            }).then(r=>{
                // remove cached filter resource
                commit('removeFilter', {filter_id})
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
