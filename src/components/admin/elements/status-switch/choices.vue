<template>
<div class="control">
    <div v-for="o,k in options">
        <button @click="update(o)" class="button is-small " :class="o.css">
            {{o.label}}
        </button>
        </span>
    </div>
</div><!-- control -->
</template>

<script>
export default {
    model:{
        prop: 'options',
    },
    props: ['options'],

    methods:{
        update(o){
            this.$emit('updated', o)
        },
    },
}
</script>

