<template>
<div>
    <template v-if="filterSets">
    <template v-for="fs in filterSets.embedded('filter_sets')">
        <div class="subtitle is-6">{{fs.key('label')}} <a>edit</a></div>
        <ul>
            <li v-for="f in filtersData(fs)">
                <rl :to="{name:'AdminEditFilter', params:{filter_id:f.filter_id}}" >{{f.label}}</rl> <button @click="removeFilter(f.filter_id)">x</button>
            </li>
        </ul>

        <div> <rl :to="{name:'AdminAddFilter', params:{filter_set_id:fs.key('filter_set_id')}}">Add Another</rl> </div>

        <hr>
    </template>
    </template>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    created(){
        this.cmpalias('router-link', 'rl')
        this.getFilterSets()
    },

    computed:{
        ...mapGetters({
            filterSets: 'api/filterSets'
        }),
    },

    methods: {
        filtersData(filterSet){
            return filterSet.embedded('filters').map(f=>{
                return f.data
            })
        },

        removeFilter(filter_id){
            this.deleteFilter({filter_id})
        },

        ...mapActions({
            getFilterSets:'api/getFilterSets',
            deleteFilter:'api/deleteFilter',
        })
    }

}
</script>

