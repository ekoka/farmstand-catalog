<template>
<div>
    <h1 class="title">Groups</h1>
    <div class="level">
        <div class="level-left">
            <div class="level-item is-hidden-tablet-only">
                <div class="field has-addons">
                </div><!-- field -->
            </div><!-- level-item -->
            <div class="level-item">
            </div><!-- level-item -->

        </div><!-- level-left -->
        <div class="level-right">
            <div class="level-item">
                <router-link class="button is-link" :to="{name:'AdminNewGroup'}">Add a new group</router-link>
            </div><!-- level-item -->
        </div><!-- level-right -->
    </div><!-- level -->
    <group-table :groups="groups"></group-table>
    <!--<product-table v-if="ready" v-model="products" />-->
</div>
</template>

<script>
import each from 'lodash/fp/each'
import {mapActions, mapGetters} from 'vuex'
export default {
    data(){
        return {
            groups:[]
        }
    },
    components: {
        groupTable: ()=>import  ( './table'),
    },
    mounted(){
        this.loadGroups()
    },

    methods: {
        loadGroups(){
            this.getGroups().then(groups=>{
                this.getGroupResources({
                    group_ids:groups.data.group_ids
                }).then(groups=>{
                    each(f=>{
                        this.groups.push(f.data)
                    })(groups)
                })
            })
        },

        options(group){
            return group.embedded('options').map(f=>{
                return f.data
            })
        },

        removeGroup(group_id){
            this.deleteGroup({group_id})
        },

        ...mapActions({
            getGroups:'api/getGroups',
            getGroupResources:'api/getGroupResources',
        })
    }

}
</script>

