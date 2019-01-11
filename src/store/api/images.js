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
            let url = getters.tenant.url('source_images')
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
            let url = getters.tenant.url('images',null,qsparams)
            return getters.http({
                url,
                auth:true,
            }).then((response)=>{
                return HAL(response.data)
            })
        },
    },
}
