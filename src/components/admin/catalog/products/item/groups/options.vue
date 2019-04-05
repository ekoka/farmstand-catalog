<template>
<div class="is-active modal">
    <div @click="$emit('close')" class="modal-background"></div>
    <div class="card">

        <h4>Product</h4>

        <h4>Group options</h4>
        <div v-for="o, i in group.options">
            <label>
                <input type="checkbox" 
                    :value="o.group_option_id" 
                    v-model="mutable.productOptions">
                {{o.data.label}}
            </label>
        </div>
    </div><!-- card -->
</div><!-- modal -->
</template>

<script>
import _ from 'lodash/fp'
import {mapActions} from 'vuex' 

export default {
    props: ['group', 'product', 'productOptions'],

    data(){
        return {
            mutable:{
                productOptions:this.productOptions,
            }
        }
    },

    watch: {
        'mutable.productOptions': function(value){
            this.$emit('productOptions:update', value) 
        },
    },
}
</script>
