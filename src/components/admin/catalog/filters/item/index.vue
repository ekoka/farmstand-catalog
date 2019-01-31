<template>
<div class="columns">
    <div class="column is-8-tablet">
        <div class="field ">
            <div class="control">
                <label class="label">Name</label>
            </div>
            <div class="control is-expanded">
                <input class="input" v-model="mutable.filter.data.label">
            </div>
        </div><!-- field -->
        <div class="field ">
            <div class="control">
                <label class="label">Description</label>
            </div>
            <div class="control is-expanded">
                <input class="input" v-model="mutable.filter.data.description">
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label">Enabled
                    <input type="checkbox" class="checkbox" v-model="mutable.filter.active">
                </label>
            </div>
        </div><!-- field -->
        <div class="field is-grouped is-grouped-left">
            <div class="control">
                <label class="label">
                    Filter option selection type: 
                </label>
            </div>
            <div class="control">
                <label class="">
                    <input type="radio" class="radio" v-model="mutable.filter.multichoice" :value="false">
                    Single
                </label>
            </div>
            <div class="control">
                <label class="">
                    <input type="radio" class="radio" v-model="mutable.filter.multichoice" :value="true">
                    Multiple
                </label>
            </div>
            <tooltip>Pertains to how many simultaneous options a product can be associated with (i.e. can a product be linked to more than one option at a time). Note that once a filter has been saved, it can only be changed from single to multiple choice, not the other way around.</tooltip>
        </div><!-- field -->
        <option-list v-if="ready" 
            :filterResource="filterResource"
            :options.sync="mutable.filter.options">
        </option-list>
    </div><!-- column -->

    <div class="column">
        <div class="field">
            <div class="control">
                <button class="button is-link" @click="saveFilter">Save your changes</button>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <button class="button is-danger is-outlined" @click="removeFilter">Delete this filter</button>
            </div>
        </div>
    </div><!-- column -->
</div><!-- columns -->
</template>

<script>
import _ from 'lodash/fp'
import OptionList from './options'
import Tooltip from '@/components/admin/elements/tooltip'
import {mapActions} from 'vuex'
export default {
    components: {
        OptionList,
        Tooltip,
    },

    props:['filter_id'],

    data(){
        return {
            filterResource: null,
            displayHelp: false,
            ready: false,
            mutable: {
                filter: {
                    filter_id: undefined,
                    active: false,
                    multichoice: false,
                    data: {
                        label: undefined,
                        description: undefined,
                    },
                    options: [],
                },
            },
        }
    },

    watch:{
        'mutable.filter.options': {
            deep:true,
            handler(){},
        },
    },

    mounted(){
        if (this.filter_id){
            this.loadFilter().then(()=>{
                this.ready = true
            })
        } else {
            this.ready = true
        }
    },

    methods:{
        saveFilter(){
            let data = this.mutable.filter
            if(!this.filter_id){
                // create new filter
                return this.postFilter({
                    data
                }).then(f=>{
                    // redirect to filter's page
                    this.$router.push({
                        name: 'AdminEditFilter', params:{
                            filter_id: f.data.filter_id
                        },
                    })
                })
            } else {
                return this.putFilter({
                    filter_id:this.filter_id,
                    data,
                }).then(()=>{
                    this.loadFilter()
                })
            }
        },

        loadFilter(){
            return this.getFilter({
                filter_id:this.filter_id,
                refresh:true
            }).then(filter=>{
                this.filterResource = filter
                this.mutable.filter = filter.data
            })
        },

        removeFilter(){
            if(this.filter_id){
                return this.deleteFilter({
                    filter_id:this.filter_id
                }).then(resp=>{
                    this.$router.push({name: 'AdminFilterList'})
                })
            }
        },

        ...mapActions({
            postFilter: 'api/postFilter',
            getFilter: 'api/getFilter',
            deleteFilter: 'api/deleteFilter',
            putFilter: 'api/putFilter',
            postFilterOption: 'api/postFilterOption'
        })
    },

}
</script>
