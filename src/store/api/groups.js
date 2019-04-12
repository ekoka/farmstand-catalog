import {HAL} from '@/utils/hal' // helper to navigate HAL API resources
import {Buffer} from '@/utils/cache'
import find from 'lodash/fp/find'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import difference from 'lodash/fp/difference'
import each from 'lodash/fp/each'
import union from 'lodash/fp/union'

export default {
    state:{
        groupCache: {stack:[], lock:[]},
    },
    getters:{
        groups(state){
            return ({group_id=null}={})=>{
                if (state.groups){
                    const groups = HAL(state.groups)
                }
                if(!group_id){
                    // if no group_id is specified, return all groups
                    return groups
                } else {
                    // only return group associated with group_id
                    return find(f=>{
                        return f.key('group_id')===group_id
                    })(groups.embedded('groups'))
                }
            }
        },
    },

    mutations:{
        setGroups(state, {groups}){
            // groups is an API resource in HAL format 
            // use the helper to navigate it
            state.groups = groups
        },

        removeGroup(state, {group_id=null}){
            Buffer(state.groupCache).remove({group_id})
        },

        setGroup(state, {group}){
            const group_id = HAL(group).key('group_id')
            const path = {group_id}
            Buffer(state.groupCache).store(path, group)
        },
    },


    actions:{
        postGroup({getters, commit, dispatch},{data}){
            let url = getters.domain.url('groups')
            return getters.http({
                url, 
                data, 
                method:'post',
                auth:true
            }).then(response=>{
                // async refresh group list
                let group_id = HAL(response.data).data.group_id
                dispatch('getGroups')
                return group_id
            }).then((group_id)=>{
                return dispatch('getGroup', {group_id})
            })
        },

        getGroups({getters, commit}, {params}={}){
            const url = getters.domain.url('groups')
            return getters.http({url, auth:true}).then(response=>{
                return HAL(response.data)
            })
        },

        //getGroupResources({getters, commit}){
        //    const url = getters.domain.url('groups')
        //    return getters.http({
        //        url,
        //        auth: true,
        //    }).then(response=>{
        //        commit('setGroups', {groups:response.data})
        //        return getters.groups()
        //    }).catch(error=>{
        //        console.log(error)
        //    })
        //},        
        getGroupResources({getters, state, commit, rootState}, {group_ids}){
            const buffer = Buffer(state.groupCache)
            const halify = map(f=>{
                return HAL(f)
            })
            const finder = reduce((accumulator, group_id)=>{
                const resource = buffer.fetch({group_id})
                if(resource){
                    accumulator.found.push(resource)
                    accumulator.foundIds.push(group_id)
                }
                return accumulator
            }, {found:[], foundIds:[]})
            const {found, foundIds} = finder(group_ids)
            const notfound = difference(group_ids, foundIds)

            if(notfound.length==0){
                return halify(found)
            }
                
            const url = getters.domain.url('group_resources', null, {
                fid:notfound
            })
            return getters.http({
                url,
                auth:true
            }).then(response=>{
                const addNewResources = each(f=>{
                    commit('setGroup', {group:f.resource})
                })
                const resources = HAL(response.data)
                addNewResources(resources.embedded('groups'))
                return union(halify(found), resources.embedded('groups'))
            })
        },



        //getGroup({getters, commit}, {group_id}){
        //    const url = getters.groups().url('group', {group_id})

        //    return getters.http({
        //        url,
        //        auth:true,
        //    }).then(response=>{
        //        return HAL(response.data)
        //    })
        //},

        getGroup({getters, commit},{url, group_id}){
            // always returns a fresh copy of group resource
            if (group_id){
                url = getters.domain.url('group', {group_id})
            }
            return getters.http({url, auth:true}).then(response=>{
                // halify
                commit('setGroup', {group:response.data})
                return HAL(response.data)
            })
        },

        
        putGroup({getters, commit}, {group_id, data}){
            const url = getters.domain.url('group', {group_id})
            return getters.http({
                url,
                method:'put',
                data,
                auth:true,
            }).then(resp=>{
                return commit('removeGroup', {group_id})
            })
        },

        deleteGroup({getters, commit}, {group_id}){
            // we don't delete by url because we can generate the url
            // from the ID, the reverse is more difficult
            let url = getters.domain.url('group', {group_id})
            return getters.http({
                url, method:'delete', auth:true
            }).then(r=>{
                // remove cached group resource
                commit('removeGroup', {group_id})
            })
        },
        
        getGroupOption({getters}, {url}){
            return getters.http({
                url,
                auth: true,
            }).then(response=>{
                return HAL(response.data)
            })
        },

        putGroupOptionProducts({getters}, {url, data}){
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
