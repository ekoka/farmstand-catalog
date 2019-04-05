export default {
    namespaced: true,

    state:{
        showGroups: false,
        groups: [],
        productGroups: {},
    },

    getters:{
    },

    mutations:{
        showGroups(state, {value}){
            state.showGroups = value
        },

        setGroups(state, {groups}){
            state.groups = groups 
        },

        setProductGroups(state, {groups}){
            state.productGroups = groups || {}
        },
    },

    actions:{
    },
}
