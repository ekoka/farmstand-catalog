<template>
<div>
<component :is="currentInput" :field="field||fieldDefault" :schema="schema" 
    @updated="$emit('updated', $event)"/>
</div>
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

    data(){
        return {
            fieldDefault: null,
        }
    },

    mounted(){
        if(!this.field){
            this.setDefault()
        }
    },

    computed: {
        currentInput (){
            const control = this.schema.control || this.schema.field_type
            return {
                //BOOL:Bool,
                //MULTI_CHOICE:MultiChoice,
                SHORT_TEXT:shorttext,
                MEDIUM_TEXT:mediumtext,
                //MEDIUM_TEXT:shorttext,
                LONG_TEXT:longtext,
                BOOL:radio,
                radio: radio,
                RADIO: radio,
                //SINGLE_CHOICE:SingleChoice,
            }[control]
        },
    },
    methods:{
        setDefault(){
            this.fieldDefault = {
                name: this.schema.name,
                field_type: this.schema.field_type,
                searchable: this.schema.searchable,
                display: this.schema.display,
            }
        }
    },
}
</script>
