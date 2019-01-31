<template>
<div class="columns">
    <message :class="{'is-active':showConfirmation}"
        v-bind="confirmMessage"
        @close="showConfirmation=false">
    </message>

    <filterOptionProducts 
        v-if="productSelection.active" 
        v-bind="productSelection"
        @close="closeProductSelection">
    </filterOptionProducts>

    <div class="column">
        Options
        <div class="field has-addons" v-for="o,i in mutable.options">
            <div class="control">
                <button class="button" title="Add an option after this one" @click="addOption(i)">
                    <span class="icon is-small"><i class="mdi mdi-plus-circle-outline"></i></span>
                </button>
            </div><!-- control -->
            <div class="control">
                <button class="button" title="Remove this option" @click="confirmRemoval(i)"><span class="icon is-small" :class="{'has-text-danger': o.filter_option_id}" ><i class="mdi mdi-minus-circle-outline"></i></span>
                
                </button>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="o.data.label">
            </div><!-- control -->
            <div class="control">
                <button 
                    class="button is-outlined" 
                    :disabled="!o.filter_option_id"
                    @click="openProductSelection(o.filter_option_id)">
                    select products
                </button>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- column -->
</div><!-- columns -->
</template>

<script>
import _ from 'lodash/fp'
import message from '@/components/admin/elements/messages'
import filterOptionProducts from './filter-option-products'

export default {
    components: {
        message,
        filterOptionProducts
    },
    props: ['options', 'filterResource'],

    data(){
        return {
            productSelection: {
                active: false,
                filter: null,
                filter_option_id: null,
            },
            mutable: {
                options:[],
            },
            confirmMessage:{
                level: 'warning',
                confirmBtn:{
                    label: "Remove",
                    css: "is-warning"
                },
                callback:this.removeOption,
                params:{
                    optionIndex: 0,
                },
                cancelBtn:{
                    label: 'Cancel',
                    css: 'is-light',
                },
                header: 'Remove option',
                message:"This option might be associated with a few products. Do you want to remove it?", 
            },
            showConfirmation: false,
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

        insertItem(arr, index, items){
            /* insert items in array at the indicated index */
            return [
                ...arr.slice(0,index), 
                ...items, 
                ...arr.slice(index)]
        },

        addOption(i){
            /* add a new option to the list of options at the specified index.
             */
            this.mutable.options = this.insertItem(
                    this.mutable.options, i+1, [this.newOption()])
        },

        newOption(){
            /* return a new option object */
            return {
                data:{label: null}
            }
        },

        confirmRemoval(index){
            /* record the index of the option being removed and set the 
               display flag of the confirmation modal panel.
             */
            this.confirmMessage.params.optionIndex = index
            this.showConfirmation = true
        },

        removeOption({optionIndex}){
            /* remove option at the specified index */
            this.mutable.options.splice(optionIndex,1)
        },

        openProductSelection(filter_option_id){
            this.productSelection['filter_option_id'] = filter_option_id
            this.productSelection['filter'] = this.filterResource
            this.productSelection['active'] = true
        },
        closeProductSelection(){
            this.productSelection['filter_option_id'] = null
            this.productSelection['filter'] = null
            this.productSelection['active'] = false
        },
    },
}
</script>
