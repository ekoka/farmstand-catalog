<template>
<div class="field is-grouped has-addons status-switch">
    <div>
    <div class="status-switch-display control">
        <a @click="selecting=!selecting" v-if="selectedValue" class="button is-small" :class="selectedValue.css">
            <span class="is-size-6">
                {{this.selectedValue.label}}
            </span>
            <span class="icon">
                <i class="mdi mdi-chevron-double-down"></i>
            </span>
        </a>
        <p v-else> ------ </p>
    </div>
    <choices @updated="select" v-model="options" class="status-switch-choices" v-if="selecting">
    </choices>
    </div>
</div>
</template>

<script>
import choices from './choices'

export default {
    components: {choices},
    model: {
        prop: 'value',
        event: 'updated',
    },
    props: ['options', 'value'],
    mounted(){
        this.selectedValue = this.options.find(o=>{
            return o.value==this.value
        })
    },
    data(){
        return {
            selecting: false,
            selectedValue: null,
        }
    },

    computed:{
        selection(){
            return this.selectedValue || this.defaultValue
        },
    },
    methods:{
        select(option){
            this.selecting = false
            this.selectedValue = option
        },
    },
}
</script>

<style>
.status-switch {
    height: 25px;
    max-width: 150px;
    position: relative;
}

.status-switch .status-switch-choices, .status-switch .status-switch-display{
    width: 120px;
}
.status-switch .status-switch-choices{
    z-index: 1;
}

.status-switch .status-switch-choices .button,
.status-switch .status-switch-display .button{
    width: 100%;
}

</style>
