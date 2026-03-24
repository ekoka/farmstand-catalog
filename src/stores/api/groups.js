import { defineStore } from 'pinia'
import { HAL } from '@/utils/hal' // helper to navigate HAL API resources
import { Buffer } from '@/utils/cache'
import { difference, union } from '@/utils/ds'
import { http } from '@/stores/http'
import useDomainStore from './domain'


export default defineStore('groups', {

    state: {
        groupCache: { stack:[], lock:[] }, // Buffer storage
    },

    getters: {
        groups (state) {
            return ({ group_id=null }={})=>{
                if (state.groups) {
                    const groups = HAL(state.groups)
                }
                if (!group_id) {
                    // if no group_id is specified, return all groups
                    return groups
                } else {
                    // only return group associated with group_id
                    return groups.embedded('groups').find(f=>{
                        return f.key('group_id')===group_id
                    })
                }
            }
        },
    },

    actions: {

        async postGroup({ data }) {
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('groups')
            return http({
                url,
                data, 
                method:'post',
                auth:true
            }).then(resp => {
                // async refresh group list
                const group_id = HAL(resp.data).data.group_id
                this.getGroups()
                return group_id
            }).then( group_id => this.getGroup({ group_id }) )
        },

        async getGroups({ params }={}){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('groups')
            return http({url, auth:true})
                .then( resp => HAL(resp.data) )
        },

        async getGroup({ url, group_id }){
            // always returns a fresh copy of group resource
            if (group_id) {
                const domainStore = useDomainStore()
                const url = domainStore.domain.url('groups', { group_id })
            }

            return http({url, auth:true}).then(resp => {
                // halify
                const group_id = HAL(resp.data).key('group_id')
                const path = { group_id }
                Buffer(this.state.groupCache).store(path, resp.data)
                return HAL(resp.data)
            })
        },

        async getGroupResources({ group_ids }){
            const buffer = Buffer(this.state.groupCache)
            const { found, foundIds } = group_ids.reduce((accumulator, group_id) => {
                const resource = buffer.fetch({ group_id })
                if (resource) {
                    accumulator.found.push(resource)
                    accumulator.foundIds.push(group_id)
                }
                return accumulator
            }, { found:[], foundIds:[] }) 


            const notfound = Array.from(difference(group_ids, foundIds))
            if (notfound.length===0) 
                return found.map(f => HAL(f))

            const domainStore = useDomainStore()
            const url = domainStore.domain.url('group_resources', null, { fid:notfound })
            return http({ url, auth:true }).then(resp => {
                const resources = HAL(resp.data)
                resources.embedded('groups').forEach(g => {
                    const group = g.resource
                    const group_id = HAL(group).key('group_id')
                    const path = { group_id }
                    Buffer(this.state.groupCache).store(path, group)
                })
                return Array.from(union(found.map(f => HAL(f)), resources.embedded('groups')))
            })
        },

        async putGroup({ group_id, data }){
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('groups', { group_id })
            return http({
                url,
                method:'put',
                data,
                auth:true,
            }).then( _ => Buffer(this.state.groupCache).remove({ group_id }) )
        },

        async deleteGroup({ group_id }) {
            // we delete by group_id rather than by url, because we can generate the url
            // from the ID, the reverse is more difficult.
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('groups', { group_id })
            return http({ url, method:'delete', auth:true })
                // remove cached group resource
                .then( _ => Buffer(this.state.groupCache).remove({ group_id }) )
        },
        
        async getGroupOption({ url }) {
            return http({ url, auth: true, })
                .then(resp => HAL(resp.data) )
        },

        async putGroupOptionProducts({ url, data }) {
            return http({
                url,
                data,
                method: 'put',
                auth: true,
            }).then(resp => HAL(resp.data) )

        },
    }
})
