export default {
    namespaced: true,

    state:{
        showFilters: false,
        filters: [],
        productFilters: {},
    },

    getters:{
    },

    mutations:{
        showFilters(state, {value}){
            state.showFilters = value
        },

        setFilters(state, {filters}){
            state.filters = filters 
        },

        setProductFilters(state, {filters}){
            state.productFilters = filters || {}
        },
    },

    actions:{
    },
}
