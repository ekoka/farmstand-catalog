<template>
    <div class="filter">
        <div class="filter-header has-icon-right">
            <h3 @click="toggleExpansion" class="subtitle is-5">
                {{filter.label}}
                <span class="icon"><i class="mdi" :class="{'mdi-chevron-down': expanded, 'mdi-chevron-right':!expanded}"></i></span>
            </h3>
        </div><!-- filter-header -->
        <div v-if="expanded" class="filter-content">
            <div class="filter-item" v-for="o,i in filter.options">
                <label class="filter-item-label">
                    <input v-model="mutable.options" :value="o.filter_option_id" type="checkbox">
                    {{o.label}}
                </label><!-- filter-item-label -->
            </div><!-- filter-item -->
        </div><!-- filter-content -->
    </div><!-- filter -->
</template>

<script>
export default {
    model: {
        prop: 'filter',
        event: 'filter:updated',
    },
    props: ['filter'],
    data (){
        return {
            expanded: false,
            mutable:{
                options: this.options || [],
            },
        }
    },
    mounted(){
        this.options = this.filter.options
    },

    watch:{
        'mutable.options': {
            deep: true,
            handler(v){
                this.$emit('options:updated', v)
            }
        }
    },
    methods:{
        toggleExpansion(){
            this.expanded = !this.expanded
        }
    },

}
</script>

<style>
.filter {
    display: flex;
    width: 14em;
    flex-direction: column; 
    margin-top: 30px;

}

.filter .filter-header{
    cursor: pointer;
}

.filter .filter-header.has-icon-right{
    padding-right: 10px;
    position: relative;
}

.filter .filter-header.has-icon-right .icon{
    position: absolute;
    top: 3px;
    right: 3px;
}

.filter .filter-content{
    position: relative;
    top: 5px;
}

.filter .filter-item{
    position: relative;
    left: 10px;
    width: 100%;
    margin-bottom: 4px;
    margin-top: 3px;
}

.filter .filter-item-label{
    display: block;
}

.filter * {
    /*border: 1px solid black;*/
}
</style>
