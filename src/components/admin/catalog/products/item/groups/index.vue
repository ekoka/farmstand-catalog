<template>
<div class="box">
    <h3 class="subtitle is-5">Groups</h3>
    <div v-for="f in groups">
        <div class="field is-grouped ">
            <div class="control">
                <label class="label">
                    {{f.data.label}}
                </label>
            </div>
            <div class="control">
                <button class="button" @click="openGroupSelection(f)">Select options</button>
            </div>
        </div>
    </div>
    <options v-if="groupSelection.active" 
        v-bind="groupSelection" 
        @productOptions:update="updateProductOptions($event, groupSelection.group)"
        @close="closeGroupSelection">
    </options> </div>
</template>

<script>
import {map} from 'lodash/fp'
import {mapActions, mapMutations, mapGetters, mapState} from 'vuex'

import options from './options'

export default {
    components: {
        options,
    },
    props: ['product', 'productGroups'],
    
    data(){
        return {
            unwatch: null,
            groups: [],
            mutable:{
                productGroups: this.productGroups,
            },
            groupSelection: {
                active: false,
                group: null,
                product: null,
                productOptions: null,
            },
        }
    },

    //watch:{
    //    'mutable.productGroups': {
    //        handler(v){
    //            this.$emit('productGroups:update', v)
    //        },
    //    },
    //},

    mounted(){
        this.loadGroups()
    },

    computed: {
        ...mapGetters({}),
        ...mapState({}),
    },

    methods: {
        openGroupSelection(f){
            this.unwatch = this.$watch(function(){
                return this.mutable.productGroups[f.group_id]
            }, function(){
                this.$emit('productGroups:update', this.mutable.productGroups)
            })
            this.groupSelection = {
                group: f,
                product: this.product,
                productOptions: [...(this.productGroups[f.group_id] || [])],
                active: true,
            }
        },
        closeGroupSelection(){
            this.unwatch()
            this.groupSelection['active'] = null
            this.groupSelection['group'] = null
            this.groupSelection['product'] = false
            this.groupSelection['productOptions'] = null
        },
        groupLabel(f){
            return f.data.label
        },

        updateProductOptions(options, group){
            this.$set(this.mutable.productGroups, group.group_id, options)
        },

        loadGroups(){
            this.getGroups().then(groups=>{
                this.groups = map(f=>f.data)(groups.embedded('groups'))
            })
        },
        ...mapMutations({}),
        ...mapActions({
            getGroups: 'api/getGroups',
        }),
    },
}
</script>
