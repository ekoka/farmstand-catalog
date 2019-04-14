<template>
<div>
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
        <confirmation 
            :active.sync="activeConfirmation" 
            :key="o.group_option_id"
            @confirmation="removeHandler($event, i)">
            Do yo want to remove this option <span class="is-size-6">(any existing associations with products will be severed)</span>?
        </confirmation>
        <modal v-if="o.group_option_id" :key="o.group_option_id" :active.sync="productModal" @close="productModal=false">
            <group-option-products 
                :key="o.group_option_id"
                v-bind="productSelectionParams(o.group_option_id)"
                @close="productModal=false">
            </group-option-products> 
        </modal>
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
                @click="productModal=true">
                select products
            </button>
        </div><!-- control -->

    </div><!-- field -->
</div><!--  -->
</template>

<script>
import each from 'lodash/fp/each'
import {HAL} from '@/utils/hal'

export default {
    components: {
        confirmation: ()=>import('@/components/utils/messaging/confirmation'),
        GroupOptionProducts: ()=>import  ( './group-option-products'),
        modal : ()=>import('@/components/utils/modal'), 
    },
    props: ['options', 'groupResource'],

    data(){
        return {

            activeConfirmation: false,
            productModal:false,
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
            each(k=>{
                this.modalComponent[k] = null
            })(Object.keys(this.modalComponent))
        },

        removeHandler(confirmed, optionIndex){
            if(confirmed){
                this.mutable.options.splice(optionIndex, 1)
            }
        },

        removeOption(optionIndex, option){
            if(option.group_option_id){
                this.activeConfirmation = true
                return
            }
            // we only get here if no group_option_id,
            // in which case we just remove.
            this.removeHandler(true, optionIndex)

        },

        productSelectionParams(group_option_id){
            const group = HAL(this.groupResource)
            return {
                group_option_id,
                optionUrl: group.url('option', {group_option_id }),
                groupData: group.key('data'),
            }
        },

        //openProductSelection(group_option_id){
        //    const group = HAL(this.groupResource)
        //    const optionUrl = group.url('option', {group_option_id })
        //    const groupData = group.key('data')

        //    this.modalComponent = {
        //        component: GroupOptionProducts,
        //        params:{
        //            group_option_id, 
        //            optionUrl,
        //            groupData,
        //        },
        //        events:{close(){
        //            },
        //        },
        //    }
        //},
    },
}
</script>
