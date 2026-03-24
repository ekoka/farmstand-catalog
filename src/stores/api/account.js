import { defineStore } from 'pinia'
import { HAL } from '@/utils/hal'
import { http } from '@/stores/http'
import useRootStore from './root'

export default defineStore('account', {

    state: {

        profile: null,
        account: null,
    },

    actions: {

        async getAccount(account_id) {
            const rootStore = useRootStore()
            const url = rootStore.root.url('account', {account_id})
            return http({url, auth:true}).then(resp => {
                this.account = HAL(resp.data)
                return this.account
            })
        },

        async getProfile() {
            const rootStore = useRootStore()
            const url = rootStore.root.url('profile')
            return http({url, auth:true}).then(resp => {
                this.profile = HAL(resp.data)
                return this.profile
            })
        },

        unsetProfile(){
            this.state.profile = null
        },

        unsetAccount(){
            this.state.account = null
        },
    },
})
