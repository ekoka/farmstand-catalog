<template>
<div>
    <div v-for="f, i in groups"> 
        <h2 class="subtitle">{{f.data.label}}</h2>
        <div v-for="o,i in f.options">
            <label>
                <input type="checkbox" :value="o.group_option_id" v-model="mutable.selectedGroupOptions[f.group_id]">
                {{o.data.label}}
            </label>
        </div>
    </div>
</div>
</template>

<script>
import each from 'lodash/fp/each'
import {mapMutations, mapState} from 'vuex'
export default {

    data(){
        return {
            mutable:{
                selectedGroupOptions:{}
            }
        }
    },

    watch:{
        'mutable.selectedGroupOptions':{
            handler(){
                this.setProductGroups({
                    groups: {...this.mutable.selectedGroupOptions},
                })
            },
            deep:true,
        }
    },

    mounted(){
        each(f=>{
            this.$set(this.mutable.selectedGroupOptions, f.group_id, [])
        })(this.groups)
    },

    computed:{
        ...mapState('admin/products', {
            groups: 'groups'
        }),
    },

    methods:{
        ...mapMutations('admin/products', {
            setProductGroups: 'setProductGroups'
        }),
    }
}
</script>
