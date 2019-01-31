<template>
<div>
    <div v-for="f, i in filters"> 
        <h2 class="subtitle">{{f.data.label}}</h2>
        <div v-for="o,i in f.options">
            <label>
                <input type="checkbox" :value="o.filter_option_id" v-model="mutable.selectedFilterOptions[f.filter_id]">
                {{o.data.label}}
            </label>
        </div>
    </div>
</div>
</template>

<script>
import _ from 'lodash/fp'
import {mapMutations, mapState} from 'vuex'
export default {

    data(){
        return {
            mutable:{
                selectedFilterOptions:{}
            }
        }
    },

    watch:{
        'mutable.selectedFilterOptions':{
            deep:true,
            handler(){
                this.setProductFilters({
                    filters: {...this.mutable.selectedFilterOptions},
                })
            }
        }
    },

    mounted(){
        _.each(f=>{
            this.$set(this.mutable.selectedFilterOptions, f.filter_id, [])
        })(this.filters)
    },

    computed:{
        ...mapState('admin/products', {
            filters: 'filters'
        }),
    },

    methods:{
        ...mapMutations('admin/products', {
            setProductFilters: 'setProductFilters'
        }),
    }
}
</script>
