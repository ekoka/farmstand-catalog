const Inquiry = {
    namespaced: true,
    state: {
        products:[],
        billingAddress: {},
        shippingAddress: {},
        comments:null,
    },
    getters: {
        productAdded(state, getters){
            return function(product_id){
                return -1!=getters.productIndex(product_id)
            }
        },

        productIndex(state){
            return function(product_id){
                return state.products.findIndex(p=>{
                    if (!p){
                        return
                    }
                    return p.product_id==product_id
                })
            }
        },
    },
    mutations: {
        resetInquiry(state){
            initInquiry({state})
        },
        addProduct(state, {product}){
            state.products.push(product)
        },
        removeProduct(state, {index}){
            if(index==-1){
                return
            }
            state.products.splice(index,1)
        },
        pingMutation(state, {}){
            // simply because vuex-persistedstate listens to mutations
        }
    },
    actions: {
        addProduct({commit, getters}, {product}){
            const data = {
                product_id: product.product_id,
                fields: product.fields,
                quantity: null,
                comments: null,
            }
            if (getters.productAdded(data.product_id)){
                return
            }
            commit('addProduct', {product:data})
        },
        removeProduct({getters, commit}, {product}){
            const index = getters.productIndex(product.product_id)
            commit('removeProduct', {index})
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
