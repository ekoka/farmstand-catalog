<template>
    <div class="group">
        <div class="group-header has-icon-right has-pointer">
            <p @click="toggleExpansion" class="subtitle is-5">
                {{group.label}}
                <span v-show="!expanded" class="icon">
                    <i class="iconify mdi" data-icon="mdi-chevron-right">
                    </i>
                </span>
                <span v-show="expanded" class="icon">
                    <i  class="iconify mdi" data-icon="mdi-chevron-down">
                    </i>
                </span>

            </p>
        </div><!-- group-header -->
        <div v-if="expanded" class="group-content">
            <div class="group-item" v-for="o,i in group.options">
                <label class="group-item-label">
                    <input v-model="mutable.options" :value="o.group_option_id" type="checkbox">
                    {{o.label}}
                </label><!-- group-item-label -->
            </div><!-- group-item -->
        </div><!-- group-content -->
    </div><!-- group -->
</template>

<script>
export default {
    model: {
        prop: 'group',
        event: 'group:updated',
    },
    props: ['group'],
    data (){
        return {
            expanded: false,
            mutable:{
                options: this.options || [],
            },
        }
    },
    mounted(){
        this.options = this.group.options
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
    /*
.group {
    display: flex;
    width: 14em;
    flex-direction: column; 
    margin-top: 30px;

}

.has-pointer, .group .group-header{
    cursor: pointer;
}

.group .group-header.has-icon-right{
    padding-right: 10px;
    position: relative;
}

.group .group-header.has-icon-right .icon{
    position: absolute;
    top: 3px;
    right: 3px;
}

.group .group-content{
    position: relative;
    top: 5px;
}

.group .group-item{
    position: relative;
    left: 10px;
    width: 100%;
    margin-bottom: 4px;
    margin-top: 3px;
}

.group .group-item-label{
    display: block;
}

.group * {
}
*/
</style>

