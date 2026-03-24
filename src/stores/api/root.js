import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import cnf from '@/config'
import http from '@/stores/http'
import {HAL} from '@/utils/hal'

export default defineStore('root', () => {
    const root = ref(null)                          // HAL resource
    const rawRoot = computed( () => root.resource ) // raw resource
    async function getRoot() {
        if (root.value) return root
        return http({ url: cnf.API_ROOT }).then( resp => {
            root.value = HAL(resp.data)
            return root
        })
    }

    function getResource({getters, commit, dispatch}, {resource, params=null}){
        if(getters[resource]){
            return getters[resource]
        }
        const capitalized = upperFirst(resource)
        return dispatch('get'+capitalized, params)
    }

    function resetApi({commit, dispatch}){
        commit('resetApi')
        return dispatch('getRoot')
    }








    return { getRoot, root }
})
