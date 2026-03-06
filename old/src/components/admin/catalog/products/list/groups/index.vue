<template>
<div class="menu" >
    <hr/>
    <div class="group" v-for="g, i in groups"> 
        <!--<p @click="toggleShow(g.group_id)" class="has-pointer has-margin-top-l subtitle is-6">{{g.data.label}}</p>-->

        <div class="group-header has-icon-right has-pointer has-margin-top-l">
            <p @click="toggleShow(g.group_id)" class="title is-6">
                {{g.data.label}}
                <span v-show="!show[g.group_id]" class="icon">
                    <i class="iconify mdi" data-icon="mdi-chevron-right">
                    </i>
                </span>
                <span v-show="show[g.group_id]" class="icon">
                    <i  class="iconify mdi" data-icon="mdi-chevron-down">
                    </i>
                </span>

            </p>
        </div><!-- group-header -->

        <div v-show="show[g.group_id]" class="group-content">
            <div class="group-item" v-for="o,i in g.options">
                <label>
                    <input type="checkbox" :value="o.group_option_id" v-model="mutable.selectedGroupOptions[g.group_id]">
                    {{o.data.label}}
                </label>
            </div>
        </div>
    </div><!-- group -->
</div>
</template>

<script>
import each from 'lodash/fp/each'
import {mapMutations, mapState} from 'vuex'
export default {

    data(){
        return {
            show:{},
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
        },
        //show:{
        //    handler(){},
        //    deep:true,
        //},
    },

    mounted(){
        each(g=>{
            this.$set(this.mutable.selectedGroupOptions, g.group_id, [])
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
        toggleShow(group_id){
            this.$set(this.show, group_id, !this.show[group_id])
        },
        //showOptions(group_id){
        //    return this.show[group_id]
        //},
    }
}
</script>
