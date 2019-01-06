<template>
<div class="field">
    <div class="control">
        <label class="label">{{schema.schema.label}}</label>
    </div>
    <!-- TODO: add meta controls (display, searchable) -->
    <div class="control">
        <textarea class="textarea" v-model="mutable.value">
        </textarea>
    </div>
</div>
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
            mutable: this.field       
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
