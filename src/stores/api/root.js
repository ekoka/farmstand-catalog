import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import cnf from '@/config'
import http from '@/stores/http'
import {HAL} from '@/utils/hal'

export default defineStore('root', () => {
    const root = ref(null)                          // HAL resource
    const rawRoot = computed( () => root.resource ) // raw resource
    function getRoot() {
        if (root.value) return root
        http({ url: cnf.API_ROOT }).then( resp => {
            root.value = HAL(resp.data)
            return root
        })
    }

    function resetApi() {
        return this.getRoot()
    }

    return { getRoot, root, resetApi }
})
