<template>
<div class="field">
    <div class="control">
        <label class="label">{{schema.schema.label}}</label>
    </div>
    <!-- TODO: add meta controls (display, searchable) -->
    <label class="radio">
        <input :name="schema.name" v-model="mutable.value" :value="true" type="radio"> {{schema.schema.options[true]}}
    </label>
    <label class="radio">
        <input :name="schema.name" v-model="mutable.value" :value="false" type="radio"> {{schema.schema.options[false]}}
    </label>
</div><!-- field -->
</template>

<script>
export default {
    model:{
        prop: 'field',
        event: 'updated',
    },
    props:['field', 'schema'],
    data (){
        return {
            mutable:this.field
        }
    },
    watch: {
        mutable: {
            deep: true,
            handler(val){
                this.$emit('updated', val)
            },
        },
    },
}
</script>
