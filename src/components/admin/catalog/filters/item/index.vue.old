<template>
<div>
    <div><label>Name: <input v-model="filter.label"/></label></div>
    <button @click="saveFilter">save</button>
</div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    //props: ['filter_set_id', 'filter_id'],
    data(){
        return {
            filterSet:null,
            filter: {
                filter_id: null,
                label: null, 
            },
        }
    },
    created(){
        this.cmpalias('router-link', 'rl')
        const route = this.$route
        if(route.params.filter_set_id){
            this.findFilterSet(route.params.filter_set_id)
        }
        if(route.params.filter_id){
            this.getFilter({filter_id:route.params.filter_id}).then(filter=>{
                this.filter = filter.data
            })
        }
    },

    watch:{
        '$route.params.filter_set_id': {
            handler: function(filter_set_id){
                if(filter_set_id){
                    this.findFilterSet(filter_set_id)
                }
            },
        },
        '$route.params.filter_id': {
            handler: function(filter_id){
                if(filter_id){
                    this.getFilter({filter_id}).then(filter=>{
                        this.filter = filter.data
                    })
                }
            },
            //deep:true
        },
    },

    methods: {
        findFilterSet(filter_set_id){
            this.getFilterSets().then(()=>{
                let filterSets = this.$store.getters['api/filterSets'].embedded(
                        'filter_sets')
                this.filterSet = filterSets.find(fs=>{
                    return fs.key('filter_set_id')==filter_set_id 
                })
            })
        },
        saveFilter(){
            const data = this.filter
            if (data.filter_id){
                return this.putFilter({data})
            }
            return this.postFilter({
                data, url:this.filterSet.url('self')}).then(f=>{
                console.log(f)
                this.$router.push({
                    name:'AdminEditFilter', 
                    params:{filter_id:f.key('filter_id')}})
            })
        },
        ...mapActions({
            getFilter: 'api/getFilter',
            getFilterSets:'api/getFilterSets',
            postFilter:'api/postFilter',
            putFilter:'api/putFilter',
            deleteFilter:'api/deleteFilter',
        })
    }
}
</script>

