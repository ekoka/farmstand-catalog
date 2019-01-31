<template>
<div class="box">
    <h3 class="subtitle is-5">Filters</h3>
    <div v-for="f in filters">
        <div class="field is-grouped ">
            <div class="control">
                <label class="label">
                    {{f.data.label}}
                </label>
            </div>
            <div class="control">
                <button class="button" @click="openFilterSelection(f)">Select options</button>
            </div>
        </div>
    </div>
    <options v-if="filterSelection.active" 
        v-bind="filterSelection" 
        @productOptions:update="updateProductOptions($event, filterSelection.filter)"
        @close="closeFilterSelection">
    </options> </div>
</template>

<script>
import _ from 'lodash/fp'
import {mapActions, mapMutations, mapGetters, mapState} from 'vuex'

import options from './options'

export default {
    components: {
        options,
    },
    props: ['product', 'productFilters'],
    
    data(){
        return {
            unwatch: null,
            filters: [],
            mutable:{
                productFilters: this.productFilters,
            },
            filterSelection: {
                active: false,
                filter: null,
                product: null,
                productOptions: null,
            },
        }
    },

    //watch:{
    //    'mutable.productFilters': {
    //        handler(v){
    //            this.$emit('productFilters:update', v)
    //        },
    //    },
    //},

    mounted(){
        this.loadFilters()
    },

    computed: {
        ...mapGetters({}),
        ...mapState({}),
    },

    methods: {
        openFilterSelection(f){
            this.unwatch = this.$watch(function(){
                return this.mutable.productFilters[f.filter_id]
            }, function(){
                this.$emit('productFilters:update', this.mutable.productFilters)
            })
            this.filterSelection = {
                filter: f,
                product: this.product,
                productOptions: [...(this.productFilters[f.filter_id] || [])],
                active: true,
            }
        },
        closeFilterSelection(){
            this.unwatch()
            this.filterSelection['active'] = null
            this.filterSelection['filter'] = null
            this.filterSelection['product'] = false
            this.filterSelection['productOptions'] = null
        },
        filterLabel(f){
            return f.data.label
        },

        updateProductOptions(options, filter){
            this.$set(this.mutable.productFilters, filter.filter_id, options)
        },

        loadFilters(){
            this.getFilters().then(filters=>{
                this.filters = _.map(f=>f.data)(filters.embedded('filters'))
            })
        },
        ...mapMutations({}),
        ...mapActions({
            getFilters: 'api/getFilters',
        }),
    },
}
</script>
