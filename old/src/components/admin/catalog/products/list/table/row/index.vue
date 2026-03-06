<template>
<div class="prod-row columns is-multiline">
    <div class="prod-item column is-1">
        <router-link :to="{name: 'AdminEditProduct', params: {product_id: rowData.product_id}}">
            <div v-if="rowData.image" class="image is-48x48">
                <img :src="rowData.image.thumb" />
            </div>
        </router-link>
    </div>
    <div class="prod-item column is-2">
        <router-link :to="{name: 'AdminEditProduct', params: {product_id: rowData.product_id}}">
            <strong>{{rowData.number.value || 'N/A'}}</strong>
        </router-link>
    </div><!-- prod-item -->
    <div class="prod-item column">
        {{rowData.name.value}}
    </div><!-- prod-item -->
    <div class="prod-item column is-2">
        <!-- <status-switch :options="availabilitySwitch" :value="this.rowData.available.value"/> -->
            <toggle
                class="is-info is-small"
                :css="{false: 'is-outlined'}"
                @toggled="toggleAvailability($event)"
                :initValue="rowData.available.value" >
                <template slot="on">
                    available
                </template>
                <template slot="off">
                    not available
                </template>
            </toggle>
            <!--<span class="tag" :class="availabilitySwitch.class" >{{availabilitySwitch.label}}</span>-->
    </div><!-- prod-item -->
    <div class="prod-item column is-2">
        <!--<status-switch :options="visibilitySwitch" :value="this.rowData.visible"/> -->
            <toggle
                class="is-small"
                :css="{false: 'is-warning', true:'is-success'}"
                :initValue="rowData.visible.value"
                @toggled='toggleVisibility($event)' >
                <template slot="on">
                   published
                </template>
                <template slot="off">
                    hidden
                </template>
            </toggle>
            <!--<span class="tag" :class="visibilitySwitch.class" >{{visibilitySwitch.label}}</span>-->
    </div><!-- prod-item -->
    <div class="prod-item column is-1">
        <button class="button is-small" @click="expand">
            <template v-if="expanded">
                <span class="icon">
                    <i class="iconify mdi" data-icon="mdi-minus"></i>
                </span>
            </template>
            <template v-else>
                <span class="icon">
                    <i class="iconify mdi" data-icon="mdi-plus"></i>
                </span>
            </template>
        </button>
    </div><!-- prod-item -->
    <div v-if="expanded" class="column is-full">
        <p class="subtitle is-5">Description:</p>
        <p>{{rowData.description.value}}</p>
    </div>
</div><!-- prod-row -->
</template>

<script>
//import statusSwitch from '@/components/admin/elements/status-switch'
import {mapActions} from 'vuex'
export default {
    components: {
        toggle: ()=>import('./toggle'),
    },
    props: ['product'],
    data(){
        return {
            mutable:{
                product: {...this.product},
            },
            expanded: false,
            //description: null,
        }
    },
    computed:{
        rowData(){
            // TODO: list of fields should be formalized.
            const fields = ['name', 'number', 'available', 'visible','description']
            const data = {
                product_id: this.mutable.product.product_id,
            }
            fields.forEach(f=>{
                data[f] = {value:''}; // default value
            })
            this.mutable.product.fields.forEach(f=>{
                if (fields.includes(f.name)) {
                    data[f.name] = f
                } 
            })
            return data
        },
    },

    methods: {
        expand(){
            this.expanded=!this.expanded
            //if (this.expanded && !this.description){
            //    this.getProduct({
            //        product_id:this.mutable.product.product_id,
            //        partial: 0,
            //    }).then(product => {
            //        const fields = product.data.fields
            //        description = fields.find(f => f.name=='description')
            //        if (description){
            //            this.description = description.value
            //        }
            //    })
            //}
        },

        tag(status){
            return {
                true: 'is-success',
                false: 'is-warning',
            }[status]
        },

        toggleAvailability(value){
            const available = this.mutable.product.fields.find(f=>f.name=='available')
            available.value = value
            this.patchProduct({
                data: {fields:{fields: [available]}},
                product_id: this.mutable.product.product_id
            })
        },

        toggleVisibility(value){
            const visible = this.mutable.product.fields.find(f=>f.name=='visible')
            visible.value = value
            this.patchProduct({
                data: {fields:{fields: [visible]}},
                product_id: this.mutable.product.product_id
            })
        },

        ...mapActions({
            getProduct: 'api/getProduct',
            patchProduct: 'api/patchProduct',
        }),
    },
}
</script>
