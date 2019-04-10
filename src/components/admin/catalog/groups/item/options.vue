<template>
<div>
    <Modal v-if="modalComponent.component" :modalComponent.sync="modalComponent.component" 
        :listenFor="Object.keys(modalComponent.events)"
        :params="modalComponent.params"
        v-on="modalComponent.events"
        >
    </Modal>

    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <button @click="addOption" class="button is-link is-outlined">
                    <span class="icon is-small">
                        <i class="iconify mdi" data-icon="mdi-plus-circle-outline"></i>
                    </span>
                    <span>Add one</span>
                </button>
            </div>
        </div>
    </div>
        
    <div class="field has-addons" v-for="o,i in mutable.options">
        <div class="control">
            <button class="button" title="Remove this option" @click="removeOption(i, o)"><span class="icon is-small" :class="{'has-text-danger': o.group_option_id}" ><i class="iconify mdi" data-icon="mdi-minus-circle-outline"></i></span>
                <span>remove</span>
            
            </button>
        </div><!-- control -->

        <div class="control">
            <input class="input" v-model="o.data.label">
        </div><!-- control -->
        <div class="control">
            <button 
                class="button is-text is-outlined" 
                :disabled="!o.group_option_id"
                @click="openProductSelection(o.group_option_id)">
                select products
            </button>
        </div><!-- control -->

    </div><!-- field -->
</div><!--  -->
</template>

<script>
import _ from 'lodash/fp'
import Message from './message'
import Modal from '@/components/admin/elements/modal'
import GroupOptionProducts from './group-option-products'
import {HAL} from '@/utils/hal'

export default {
    components: {
        Modal,
        Message,
        GroupOptionProducts
    },
    props: ['options', 'groupResource'],

    data(){
        return {
            // modal params
            modalComponent: {},
            //listenFor: [],

            mutable: {
                options:[],
            },
        }
    },
    watch:{
        options: {
            handler(val){
                // temporary suspend watcher on mutable.options
                // while we're setting items on them so as not to 
                // trigger a never-ending cycle of event between 
                // data.mutable.options and props.options
                if (this.mutableOptionsUnwatch){
                    this.mutableOptionsUnwatch()
                }
                this.mutable.options = [...this.options]
                if(!this.mutable.options.length){
                    this.mutable.options.push(this.newOption())
                }


                this.mutableOptionsUnwatch = this.$watch(
                    'mutable.options', function(val){
                        this.$emit('update:options', val)
                    }, { deep: true, })
            },
            immediate: true
        }
    },
    methods: {
        addOption(i){
            this.mutable.options.push(this.newOption())
        },

        newOption(){
            /* return a new option object */
            return {
                data:{label: null}
            }
        },

        resetModalComponent(){
            _.each(k=>{
                this.modalComponent[k] = null
            })(Object.keys(this.modalComponent))
        },

        removeOption(optionIndex, option){
            const remove = (e)=>{
                if(e==true){
                    this.mutable.options.splice(optionIndex, 1)
                }
            }
            if(option.group_option_id){
                this.modalComponent = {
                    component:Message,
                    params:{},
                    events: {answer:remove},
                }
                return
            }
            // we only get here if no group_option_id,
            // in which case we just remove.
            remove(true)

        },

        openProductSelection(group_option_id){
            const group = HAL(this.groupResource)
            const optionUrl = group.url('option', {group_option_id })
            const groupData = group.key('data')

            this.modalComponent = {
                component: GroupOptionProducts,
                params:{
                    group_option_id, 
                    optionUrl,
                    groupData,
                },
                events:{close(){
                    },
                },
            }
        },
    },
}
</script>
