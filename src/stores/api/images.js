import { defineStore } from 'pinia'
import { HAL } from '@/utils/hal'
import { http } from '@/stores/http'
import useDomainStore from './domain'
import useProductStore from './products'

export default defineStore('images', {
    actions:{

        postSourceImage({ image }) {
            //const lang = '?' + ctx.rootGetters.qs_lang
            //const url = ctx.rootState.apiUrl + contentsUrl + lang
            const formData = new FormData()
            formData.append('image', image)
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('source_images')
            return http({
                url,
                auth:true,
                method: 'post',
                header: {'Content-Type': 'multipart/form-data'},
                data: formData,
            }).then(resp => http({ url: HAL(resp.data).url('image') }) // get image
                            .then(resp => HAL(resp.data)) // return response in Hal
            )
        },

        getImages({ qsparams=null }) {
            const domainStore = useDomainStore()
            const url = domainStore.domain.url('images', null, qsparams)
            return http({
                url,
                auth:true,
            }).then((response)=>{
                return HAL(response.data)
            })
        },

        async getProductImages({ product_id }) {
            const productStore = useProductStore()
            const [ product ] = await productStore.getProductResources({ product_ids: [product_id] })
            const url = product.url('images')
            return http({ url, auth:true })
                .then( resp => HAL(resp.data) )
        },

        async putProductImages({ product_id, images }){
            const productStore = useProductStore()
            const product = await productStore.getProduct({ product_id, partial:0 })
            const url = product.url('images')
            return http({
                url,
                auth:true,
                data: images,
                method: 'put',
            }).then( resp => HAL(resp.data) )
        },
    },
})
