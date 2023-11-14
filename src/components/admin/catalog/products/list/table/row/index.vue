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
import compose from 'lodash/fp/compose'
import filter from 'lodash/fp/filter'
import find from 'lodash/fp/find'
import each from 'lodash/fp/each'
import map from 'lodash/fp/map'
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
            const data = {
                product_id: this.mutable.product.product_id,
            }
            if(this.mutable.product.images.length){
                data['image'] = this.mutable.product.images[0]['1:1']
            }
            const addtodata = each(f => {
                data[f.name] = f
            })
            const selectfields = filter(f=>{
                return ['name', 'number', 'available', 'visible','description'].includes(
                    f.name
                )
            })

            compose(addtodata, selectfields)(this.mutable.product.fields)
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
            //        description = find(f => {
            //            return f.name == 'description'
            //        })(fields)
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
            const available = find(f=>{
                return f.name=='available'
            })(this.mutable.product.fields)
            available.value = value
            this.patchProduct({
                data: {fields:{fields: [available]}},
                product_id: this.mutable.product.product_id
            })
        },

        toggleVisibility(value){
            const visible = find(f=>{
                return f.name=='visible'
            })(this.mutable.product.fields)
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
