<template>
<div>
    <confirmation 
        :active.sync="activeConfirmation" 
        @confirmation="removeHandler">
        Do yo want to remove this grouping <span class="is-size-6">(any existing associations with products will be severed)</span>?
    </confirmation>
    <nav class="breadcrumb">
        <ul>
            <li>
                <router-link :to="{name:'AdminGroupList'}">Groups</router-link>
            </li>
            <li class="is-active">
                <a href="">Edit Group</a>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->

    <stickycontent>
        <div class="level">
            <div class="level-left">
            </div>
            <div class="level-left">
                <notification eventName="notification-group-saved">
                </notification>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-danger is-outlined" @click="removeGroup">Delete this group</button>
                        </div>
                        <div class="control">
                            <button class="button is-link" @click="saveGroup">Save your changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </stickycontent>

    <div class="box">

        <div class="field ">
            <div class="control">
                <label class="label">Name</label>
            </div>
            <div class="control is-expanded">
                <input class="input" v-model="mutable.group.data.label">
            </div>
        </div><!-- field -->
        <div class="field ">
            <div class="control">
                <label class="label">Description</label>
            </div>
            <div class="control is-expanded">
                <input class="input" v-model="mutable.group.data.description">
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label">Enabled
                    <input type="checkbox" class="checkbox" v-model="mutable.group.active">
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
                    <input type="radio" class="radio" v-model="mutable.group.multichoice" :value="true">
                    Yes
                </label>
            </div>
            <div class="control">
                <label class="">
                    <input type="radio" class="radio" v-model="mutable.group.multichoice" :value="false">
                   No 
                </label>
            </div>
            <tooltip>How many simultaneous options can a product be associated with. For example, in a "Category" group each product could belong to multiple categories. On the other hand a "Maker" group could be set up such that each product can only be linked to a single manufacturer. Note that once a group has been saved, it can only be changed from Single to Multiple choice, not the other way around.</tooltip>
        </div><!-- field -->
    </div>
    <option-list class="box" v-if="ready" 
        :groupResource="groupResource"
        :options.sync="mutable.group.options">
    </option-list>
</div>
</template>

<script>
import OptionList from './options'
import Tooltip from '@/components/admin/elements/tooltip'
import {mapActions} from 'vuex'
import confirmation from '@/components/utils/messaging/confirmation'
import notification from '@/components/utils/messaging/notification'
import stickycontent from '@/components/utils/sticky-content'
export default {
    components: {
        OptionList,
        Tooltip,
        confirmation,
        notification,
        stickycontent,
    },

    // we don't use props here because for some reason they're not being updated 
    // on route push that resolve to the same component. 
    //props:['group_id'],

    data(){
        return {
            // group_id is initialized to null and later updated by a watcher 
            // on `$route.params.group_id` that triggers asap. It thus acts as 
            // the initializer.
            group_id: null,
            // the HAL resource returned from the store
            groupResource: null,
            displayHelp: false,
            // this flags prevents the `OptionList` component from being prematurely
            // loaded. It set to true once the group's resources have been fetched 
            // from the api.
            ready: false,
            mutable: {
                group: {
                    group_id: undefined,
                    active: false,
                    multichoice: false,
                    data: {
                        label: undefined,
                        description: undefined,
                    },
                    options: [],
                },
            },
            activeConfirmation: false,
        }
    },

    watch:{

        // just making sure to watch
        'mutable.group.options': {
            deep:true,
            handler(){},
        },

        // this param updates `group_id` on the model and 
        // reloads the group if necessary.
        '$route.params.group_id': {
            handler(group_id){
                // if `group_id` has a value
                if(group_id){
                    // set model's `group_id`
                    this.group_id = group_id
                    // then load group's resource
                    this.loadGroup().then(()=>{
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
        // save group to API
        saveGroup(){
            // mutable version of group is the data 
            let data = this.mutable.group

            // if no `group_id` on model, assume this is a new group
            if(!this.group_id){
                // create new group
                return this.postGroup({
                    data
                }).then(f=>{
                    // push new group's url.
                    // but since it resolves to the same component, the change of url
                    // won't trigger the usual initializers (created(), mounted(), etc).
                    // Luckily we're relying on a watcher on `$route.params.group_id`
                    // for initialization.
                    this.$router.push({
                        name: 'AdminEditGroup', params:{
                            group_id: f.data.group_id
                        },
                    })
                }).then(()=>{
                    this.$eventBus.$emit('notification-group-saved', {
                        message: 'Added',
                        options:{
                            close: false,
                            timeout: 1,
                            size: 'is-medium',
                            color: 'is-warning',
                        }
                    })
                })
            } else { // if this.group_id is set
                // updating an existing group
                return this.putGroup({
                    group_id:this.group_id,
                    data,
                }).then(()=>{
                    return this.loadGroup()
                }).then(()=>{
                    this.$eventBus.$emit('notification-group-saved', {
                        message: 'Saved',
                        options:{
                            close: false,
                            timeout: 1,
                            size: 'is-medium',
                            color: 'is-warning',
                        }
                    })
                })
            }
        },

        loadGroup(){
            return this.getGroup({
                group_id:this.group_id,
            }).then(group=>{
                this.groupResource = group.resource
                this.mutable.group = group.data
            })
        },

        removeGroup(){
            if(this.group_id){
                this.activeConfirmation = true
            }
        },

        removeHandler(e){
            if(this.group_id && e){
                this.deleteGroup({
                    group_id:this.group_id
                }).then(resp=>{
                    this.$router.push({name: 'AdminGroupList'})
                })
            }
        },

        ...mapActions({
            postGroup: 'api/postGroup',
            getGroup: 'api/getGroup',
            deleteGroup: 'api/deleteGroup',
            putGroup: 'api/putGroup',
            postGroupOption: 'api/postGroupOption'
        })
    },

}
</script>
