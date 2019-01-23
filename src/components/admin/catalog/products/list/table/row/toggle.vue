<template>
<a @click="toggleValue" class="button" :class="buttonClass">
    <slot v-if="mutable.value==on" name="on"></slot>
    <slot v-if="mutable.value==off" name="off"></slot>
</a>
</template>

<script>
export default {
    model: {
        prop: 'initValue',
        event: 'toggled',
    },
    props:['initValue', 'values', 'css'],

    data(){
        return {
            mutable:{
                value: this.initValue,
            },
            on: (this.values && this.values[0]) || true,
            off: (this.values && (this.values[1] ||
                        !this.values[0])) || false,

        }
    },

    computed:{
        buttonClass(){
            return this.mutable.value?this.css[true]:this.css[false]
        }
    },

    methods:{
        toggleValue(){
            this.mutable.value = this.mutable.value==this.on?this.off:this.on
            this.$emit('toggled', this.mutable.value)
        }
    },
}
</script>
