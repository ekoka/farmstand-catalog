<template>
<div>
    <h1 class="title">Filters</h1>
    <div class="level">
        <div class="level-left">
            <div class="level-item is-hidden-tablet-only">
                <div class="field has-addons">
                </div><!-- field -->
            </div><!-- level-item -->
            <div class="level-item">
            </div><!-- level-item -->

        </div><!-- level-left -->
        <div class="level-right">
            <div class="level-item">
                <router-link class="button is-link" :to="{name:'AdminNewFilter'}">Add a new filter</router-link>
            </div><!-- level-item -->
        </div><!-- level-right -->
    </div><!-- level -->
    <filter-table :filters="filters"></filter-table>
    <!--<product-table v-if="ready" v-model="products" />-->
</div>
</template>

<script>
import filterTable from './table'
import _ from 'lodash/fp'
import {mapActions, mapGetters} from 'vuex'
export default {
    data(){
        return {
            filters:[]
        }
    },
    components: {
        filterTable
    },
    mounted(){
        this.loadFilters()
    },

    methods: {
        loadFilters(){
            this.getFilters({refresh:true}).then((filters)=>{
                filters.embedded('filters').forEach(f=>{
                    this.filters.push(f.data)
                })
            })
        },
        options(filter){
            return filter.embedded('options').map(f=>{
                return f.data
            })
        },

        removeFilter(filter_id){
            this.deleteFilter({filter_id})
        },

        ...mapActions({
            getFilters:'api/getFilters',
            //deleteFilter:'api/deleteFilter',
        })
    }

}
</script>

