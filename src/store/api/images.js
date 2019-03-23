import {HAL} from '@/utils/hal'
import {Cache} from '@/utils/cache'

export default {
    state:{},
    getters:{},
    mutations:{
        setImage(){
        },
    },
    actions:{
        postSourceImage({getters}, {image}){
            //const lang = '?' + ctx.rootGetters.qs_lang
            //const url = ctx.rootState.apiUrl + contentsUrl + lang
            const formData = new FormData()
            formData.append('image', image)
            let url = getters.domain.url('source_images')
            return getters.http({
                // url: getters.sourceImageUrl,
                url,
                auth:true,
                method: 'post',
                header: {'Content-Type': 'multipart/form-data'},
                data: formData,
            }).then((response)=>{
                return getters.http({
                    // get image
                    url: HAL(response.data).url('image')
                }).then(resp=>{
                    // get response and return in Hal
                    return HAL(resp.data)
                })

            })
        },

        getImages({getters},{qsparams}={qsparams:null}){
            let url = getters.domain.url('images',null,qsparams)
            return getters.http({
                url,
                auth:true,
            }).then((response)=>{
                return HAL(response.data)
            })
        },

        getProductImages({getters, dispatch}, {product_id}){
            return dispatch('getProductResources', {
                product_ids:[product_id]
            }).then(([product])=>{
                const url = product.url('images')
                return getters.http({
                    url,
                    auth:true,
                }).then((response)=>{
                    return HAL(response.data)
                })
            })
        },

        putProductImages({getters,dispatch}, {product_id, images}){
            return dispatch('getProduct', {
                product_id, 
                partial:0
            }).then(product=>{
                const url = product.url('images')
                return getters.http({
                    url,
                    auth:true,
                    data: images,
                    method: 'put',
                })
            }).then((response)=> {
                return HAL(response.data)
            })
        },
    },
}
