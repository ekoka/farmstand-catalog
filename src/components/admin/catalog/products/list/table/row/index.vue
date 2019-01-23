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
                @toggled="toggleAvailability($event)"
                :initValue="rowData.available.value" 
                :css="{false: 'is-outlined'}">
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
        <!-- <status-switch :options="visibilitySwitch" :value="this.rowData.visible"/>-->
            <toggle 
                :initValue="rowData.visible" 
                @toggled='toggleVisibility($event)' 
                class="is-small" 
                :css="{false: 'is-warning', true:'is-success'}">
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
            <span class="icon"><i class="mdi" :class="{'mdi-plus': !expanded,'mdi-minus': expanded}"></i></span>
        </button>
    </div><!-- prod-item -->
    <div v-if="expanded" class="column is-full">
        <p class="subtitle is-5">Description:</p>
        <p>{{description}}</p>
    </div>
</div><!-- prod-row -->
</template>

<script>
//import statusSwitch from '@/components/admin/elements/status-switch'
import _ from 'lodash/fp'
import toggle from './toggle'
import {mapActions} from 'vuex'
export default {
    components: { toggle},
    props: ['product'],
    data(){
        return {
            mutable:{
                product: {...this.product},
            },
            expanded: false,
            description: null,
        }
    },
    computed:{
        rowData(){
            const data = {
                visible: this.mutable.product.visible,
                product_id: this.mutable.product.product_id,
            }
            if(this.mutable.product.images.length){
                data['image'] = this.mutable.product.images[0]['1:1']
            }
            _.map((f) => {
                data[f.name] = f
            })(_.filter((f)=>{
                return ['name', 'number', 'available',].includes(f.name)
            })(this.mutable.product.data.fields))
                    
            //this.mutable.product.data.fields.filter((f) =>{
            //    return ['name', 'number', 'available',].includes(f.name)
            //}).map((f) => {
            //    data[f.name] = f
            //})
            return data
        },
    },

    methods: {
        expand(){
            this.expanded=!this.expanded
            if (this.expanded && !this.description){
                this.getProduct({
                    product_id:this.mutable.product.product_id,
                    partial: 0,
                }).then((product) => {
                    const fields = product.data.data.fields
                    this.description = fields.find((f) => {
                        console.log(f.name)
                        return f.name == 'description'
                    }).value
                })
            }
        },

        tag(status){
            return {
                true: 'is-success',
                false: 'is-warning',
            }[status]
        },

        toggleAvailability(value){
            const available = _.find(f=>{
                return f.name=='available'
            })(this.mutable.product.data.fields)
            available.value = value
            const data = {
                data: {
                    fields: [available]
                }
            }
            this.patchProduct({
                data, 
                product_id: this.mutable.product.product_id
            }).then(()=>{
                // if we got here then maybe all was well
                //this.mutable.product.visible = value
            }).catch(error=>{
                console.log(error)
                // a message should be emitted here letting user
                // know that they should try again later. e.g. 
                // network problems.
            })
        },

        toggleVisibility(value){
            const data = {
                visible: value
            }
            this.patchProduct({
                data, 
                product_id: this.mutable.product.product_id
            }).then(()=>{
                // if we got here then maybe all was well
                this.mutable.product.visible = value
            }).catch(error=>{
                console.log(error)
                // a message should be emitted here letting user
                // know that they should try again later. e.g. 
                // network problems.
            })
        },

        ...mapActions({
            getProduct: 'api/getProduct',
            patchProduct: 'api/patchProduct',
        }),
    },
}
</script>
