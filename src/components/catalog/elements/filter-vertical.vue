<template>
    <div class="filter">
        <div class="filter-header has-icon-right">
            <h3 class="subtitle is-5">
                {{filterSet.key('label')}}
                <span class="icon"><i class="mdi mdi-chevron-down"></i></span>
            </h3>
        </div><!-- filter-header -->
        <div class="filter-content">
            <div class="filter-item" v-for="f in filterSet.key('filters')">
                <label class="filter-item-label">
                    <input v-model="mutable.filters" :value="f.filter_id" type="checkbox">
                    {{f.label}}
                </label><!-- filter-item-label -->
            </div><!-- filter-item -->
        </div><!-- filter-content -->
    </div><!-- filter -->
</template>

<script>
export default {
    model: {
        prop: 'filters',
        event: 'changed',
    },
    props: ['filterSet', 'filters'],
    data (){
        return {
            mutable:{
                filters: this.filters || [],
            },
        }
    },

    watch:{
        'mutable.filters': {
            deep: true,
            handler(v){
                this.$emit('changed', v)
            }
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
