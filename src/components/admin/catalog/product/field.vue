<template>
<component :is="currentInput" :field="field" :schema="schema" 
    @updated="$emit('updated', $event)"/>
</template>

<script>
import shorttext from '@/components/admin/data-fields/shorttext'
import longtext from '@/components/admin/data-fields/longtext'
import mediumtext from '@/components/admin/data-fields/mediumtext'

export default {
    model: {
        prop: 'field',
        event: 'updated'
    },
    props: ['field', 'schema'],
    components: {
        shorttext, longtext, mediumtext,
    },

    computed: {
        currentInput (){
            return {
                //BOOL:Bool,
                //MULTI_CHOICE:MultiChoice,
                SHORT_TEXT:shorttext,
                MEDIUM_TEXT:mediumtext,
                LONG_TEXT:longtext,
                //SINGLE_CHOICE:SingleChoice,
            }[this.schema.field_type]
        },
    },
}
</script>
