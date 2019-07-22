import find from 'lodash/fp/find'
import findIndex from 'lodash/fp/findIndex'

import Vue from 'vue'

const Inquiry = {
    namespaced: true,

    state: {
        products: [],
        billingAddress: {},
        shippingAddress: {},
        comments:null,
    },

    getters: {
        productAdded(state){
            return function(product_id){
                return find(p=>{
                    return p.product_id==product_id 
                })(state.products)
            }
        },
    },

    mutations: {
        resetInquiry(state){
            initInquiry({state})
        },

        addProduct(state, {rfq}){
            const index = findIndex(p=>{
                return p.product_id==rfq.product_id
            })(state.products)
            if(index==-1){
                state.products.push(rfq)
            } else {
                state.products[index] = rfq
            }
            state.products = [...state.products]
            //Vue.set(state.products, product_id, rfq)
        },

        removeProduct(state, {product_id}){
            const index = findIndex(p=>{
                return p.product_id==product_id
            })(state.products)
            if (index!=-1){
                state.products.splice(index,1)
            }
        },
        pingMutation(state, {}){
            state.inquiry 
        },
    },
}
function initInquiry({state, skip=[]}){
    const jsoncopy = obj=> JSON.parse(JSON.stringify(obj))
    let initState = {
        products: [],
        billingAddress: {},
        shippingAddress: {},
        comments:null,
    }
    
    // delete everything not in the skip list
    // or reset to initState
    Object.keys(state).concat(Object.keys(initState)).forEach(k=>{
        if (skip.includes(k)){
            return // skip
        }
        state[k] = initState[k]
    })
}

initInquiry({state:Inquiry.state})

export default Inquiry
