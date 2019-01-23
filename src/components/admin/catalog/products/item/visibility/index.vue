<template>
<div class="level">
    <div class="level-left">
        <div class="level-item">
            <toggle @click.native="toggleVisibility" :visible="visible"></toggle>
        </div><!-- level-item -->
    </div><!-- level-left -->
    <div v-if="false" class="level-right">
        <div class="level-item">
            <current-status :visible="visible"></current-status>
        </div><!-- level-item -->
    </div><!-- level-right -->
</div><!-- level -->
</template>

<script>
import CurrentStatus from './status'
import Toggle from './toggle'
export default {
    model: {
        prop: 'visible', 
        event: 'toggled'
    },
    props: ['visible'],

    components: {
        CurrentStatus,
        Toggle,
    },

    methods:{
        toggleVisibility(){
            this.$emit('toggled', !this.visible) 
        }
    },

}
</script>
