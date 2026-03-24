import { defineStore } from 'pinia'
import { difference, union } from '@/utils/ds'
import { HAL } from '@/utils/hal'
import http from '@/stores/http'
import { Buffer } from '@/utils/cache'
import useDomainStore from './domain'

//export defineStore('inquiries', default {
export defineStore('inquiries', () => {
    const inquiries = ref(null)

    function getInquiries() {
        const domainStore = useDomainStore()
        const url = domainStore.domain.url('inquiries')
        return http({url, auth:true}).then( resp => {
            inquiries.value = HAL(resp.data)
            return inquiries
        })
    }

    return { inquiries, getInquiries }
})
