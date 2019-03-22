<template>
<div>
    <nav class="breadcrumb">
        <ul>
            <li>
                <router-link :to="{name:'AdminFilterList'}">Filters</router-link>
            </li>
            <li class="is-active">
                <a href="">Edit Filter</a>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->

    <div class="box">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <div class="field">
                        <div class="control">
                            <button class="button is-danger is-outlined" @click="removeFilter">Delete this filter</button>
                        </div>
                    </div>
                </div>
                <div class="level-item">
                    <div class="field">
                        <div class="control">
                            <button class="button is-link" @click="saveFilter">Save your changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                    Can a product be linked to more than one option? 
                </label>
            </div>
            <div class="control">
                <label class="">
                    <input type="radio" class="radio" v-model="mutable.filter.multichoice" :value="true">
                    Yes
                </label>
            </div>
            <div class="control">
                <label class="">
                    <input type="radio" class="radio" v-model="mutable.filter.multichoice" :value="false">
                   No 
                </label>
            </div>
            <tooltip>How many simultaneous options can a product be associated with. For example, in a "Category" filter each product could belong to multiple categories. On the other hand a "Maker" filter could be set up such that each product can only be linked to a single manufacturer. Note that once a filter has been saved, it can only be changed from Single to Multiple choice, not the other way around.</tooltip>
        </div><!-- field -->
    </div>
    <option-list class="box" v-if="ready" 
        :filterResource="filterResource"
        :options.sync="mutable.filter.options">
    </option-list>
</div>
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

    // we don't use props here because for some reason they're not being updated 
    // on route push that resolve to the same component. 
    //props:['filter_id'],

    data(){
        return {
            // filter_id is initialized to null and later updated by a watcher 
            // on `$route.params.filter_id` that triggers asap. It thus acts as 
            // the initializer.
            filter_id: null,
            // the HAL resource returned from the store
            filterResource: null,
            displayHelp: false,
            // this flags prevents the `OptionList` component from being prematurely
            // loaded. It set to true once the filter's resources have been fetched 
            // from the api.
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

        // just making sure to watch
        'mutable.filter.options': {
            deep:true,
            handler(){},
        },

        // this param updates `filter_id` on the model and 
        // reloads the filter if necessary.
        '$route.params.filter_id': {
            handler(filter_id){
                // if `filter_id` has a value
                if(filter_id){
                    // set model's `filter_id`
                    this.filter_id = filter_id
                    // then load filter's resource
                    this.loadFilter().then(()=>{
                        // set the ready flag, so that options component can be loaded
                        this.ready = true
                    })
                } else {
                    // set the ready flag, so that options component can be loaded
                    this.ready = true
                }
            },
            // fire this handler immediately upon mounting component
            immediate:true,
        }
    },

    methods:{
        // save filter to API
        saveFilter(){
            // mutable version of filter is the data 
            let data = this.mutable.filter

            // if no `filter_id` on model, assume this is a new filter
            if(!this.filter_id){
                // create new filter
                return this.postFilter({
                    data
                }).then(f=>{
                    // push new filter's url.
                    // but since it resolves to the same component, the change of url
                    // won't trigger the usual initializers (created(), mounted(), etc).
                    // Luckily we're relying on a watcher on `$route.params.filter_id`
                    // for initialization.
                    this.$router.push({
                        name: 'AdminEditFilter', params:{
                            filter_id: f.data.filter_id
                        },
                    })
                })
            } else { // if this.filter_id is set
                // updating an existing filter
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
            }).then(filter=>{
                this.filterResource = filter.resource
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
