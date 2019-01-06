<template>
<component :is="currentInput" :field="field" :schema="schema" 
    @updated="$emit('updated', $event)"/>
</template>

<script>
import shorttext from '@/components/admin/data-fields/shorttext'
import longtext from '@/components/admin/data-fields/longtext'
import mediumtext from '@/components/admin/data-fields/mediumtext'
import radio from '@/components/admin/data-fields/radio'

export default {
    model: {
        prop: 'field',
        event: 'updated'
    },
    props: ['field', 'schema'],

    computed: {
        currentInput (){
            const control = this.schema.control || this.schema.field_type
            return {
                //BOOL:Bool,
                //MULTI_CHOICE:MultiChoice,
                SHORT_TEXT:shorttext,
                MEDIUM_TEXT:mediumtext,
                LONG_TEXT:longtext,
                BOOL:radio,
                radio: radio,
                //SINGLE_CHOICE:SingleChoice,
            }[control]
        },
    },
}
</script>
