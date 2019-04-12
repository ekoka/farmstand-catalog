<template>
<div>
    <nav class="menu">
        <p class="menu-label">
           Catalog 
        </p>
        <ul class="menu-list">
            <li>
                <router-link :to="{name:'AdminProductList'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Products</span>
                </router-link>
            </li>

            <li>
                <router-link :to="{name:'AdminGroupList'}" active-class="is-active">
                    <span>Groups</span>
                </router-link>
            </li>

        </ul>
    </nav><!-- menu -->

    <productGroups v-if="showGroups"></productGroups>

</div><!-- column -->
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'

export default {

    components:{
        productGroups: ()=>import  ( '../products/list/groups'),
    },

    computed:{
        ...mapState('admin/products', {
            showGroups: 'showGroups',
        })
    },

    data(){
        return{
            sidebarComponent: null
        }
    },

    methods: {
        loadSidebarComponent({componentName, component}){
            //this.sidebarComponent = true
            this.sidebarComponent = componentName
            Vue.component(componentName, component)
        }
    },
}
</script>
