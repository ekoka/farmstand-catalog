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
                <router-link :to="{name:'AdminFilterList'}" active-class="is-active">
                    <span>Filters</span>
                </router-link>
            </li>

        </ul>
    </nav><!-- menu -->

    <productFilters v-if="showFilters"></productFilters>

</div><!-- column -->
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'

import productFilters from '../products/list/filters'

export default {

    components:{
        productFilters,
    },

    computed:{
        ...mapState('admin/products', {
            showFilters: 'showFilters',
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
