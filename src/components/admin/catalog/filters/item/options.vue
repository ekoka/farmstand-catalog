<template>
<div class="columns">
    <message :class="{'is-active':showConfirmation}"
        :callback="removeOption"
        :params="{optionIndex}"
        v-bind="confirmMessage"
        @close="showConfirmation=false">
    </message>
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
                <button class="button is-outlined" @click="associateProducts(o)">
                    select products
                </button>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- column -->
</div>
</template>

<script>
import _ from 'lodash/fp'
import message from '@/components/admin/elements/messages'

export default {
    components: {
        message
    },
    props: ['options'],

    data(){
        return {
            confirmMessage:{
                level: 'warning',
                callback:"removeOption",
                confirmBtn:{
                    label: "Remove",
                    css: "is-warning"
                },
                cancelBtn:{
                    label: 'Cancel',
                    css: 'is-light',
                },
                header: 'Remove option',
                message:"This option might be associated with a few products. Do you want to remove it?", 
            },
            optionIndex: undefined,
            showConfirmation: false,
            mutable: {
                options:[...this.options]
            }
        }
    },
    watch:{
        'mutable.options': {
            handler(){
                if(!this.mutable.options.length){
                    this.mutable.options.push(this.newOption())
                }
                this.$emit('update:options', this.mutable.options)
            },
            deep:true,
            immediate: true,
        }
    },
    methods: {
        insert(arr, index, items){
            return [...arr.slice(0,index), ...items, ...arr.slice(index)]
        },
        addOption(i){
            this.mutable.options = this.insert(
                    this.mutable.options, i+1, [this.newOption()])
        },
        confirmRemoval(index){
            this.optionIndex = index
            this.showConfirmation = true
        },
        removeOption({optionIndex}){
            this.mutable.options.splice(optionIndex,1)
        },
        newOption(){
            return {
                data:{label: null}
            }
        },
    },
}
</script>
