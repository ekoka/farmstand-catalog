<template>
<div class="prod-row columns is-multiline">
    <div class="prod-item column is-2">
        <router-link :to="{name: 'AdminEditProduct', params: {product_id: rowData.product_id}}">
            <strong>{{rowData.number.value}}</strong>
        </router-link>
    </div><!-- prod-item -->
    <div class="prod-item column is-2">
        {{rowData.name.value}}
    </div><!-- prod-item -->
    <div class="prod-item column">
        <status-switch :options="availabilitySwitch" :value="this.rowData.available.value"/>
            <!--<span class="tag" :class="availabilitySwitch.class" >{{availabilitySwitch.label}}</span>-->
    </div><!-- prod-item -->
    <div class="prod-item column is-2">
        <status-switch :options="visibilitySwitch" :value="this.rowData.visible"/>
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
import statusSwitch from '@/components/admin/elements/status-switch'
import {mapActions} from 'vuex'
export default {
    components: { statusSwitch },
    props: ['product'],
    data(){
        return {
            expanded: false,
            description: null,
        }
    },
    computed:{
        rowData(){
            const data = {
                visible: this.product.visible,
                product_id: this.product.product_id,
            }
            this.product.data.fields.filter((f) =>{
                return ['name', 'number', 'available',].includes(f.name)
            }).map((f) => {
                data[f.name] = f
            })
            return data
        },

        visibilitySwitch(){
            //return {
            //    'class': this.rowData.visible ? 'is-success' : 'is-warning',
            //    'label': this.rowData.visible ? 'visible' : 'hidden',
            //}
            return [
            {
                value: true, 
                //css: 'has-background-white-bis has-text-info',
                css: 'is-success',
                label: 'published'
            },
            {
                value: false, 
                //css: 'has-background-warning has-text-grey-dark',
                css: 'is-warning',
                label: 'hidden'
            },
            ]
        },
        availabilitySwitch(){
            return [
            {
                value: true, 
                //css: 'has-background-primary has-text-white-bis',
                css: 'is-warning',
                label: 'available'
            },
            {
                value: false, 
                //css: 'has-background-white-bis has-text-primary',
                css: 'is-outlined',
                label: 'not available'
            },
            ]
        },
    },

    methods: {
        expand(){
            this.expanded=!this.expanded
            if (this.expanded && !this.description){
                this.getProduct({
                    product_id:this.product.product_id,
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
        ...mapActions({
            getProduct: 'api/getProduct',
        }),
    },
}
</script>
