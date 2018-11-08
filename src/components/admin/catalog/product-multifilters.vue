<template>
    <div>
        <h2 class="subtitle is-5">{{filterSet.key('label')}}</h2>
        <div v-for="f in filterSet.embedded('filters')"><label>
            {{f.key('label')}}<input :value="f.key('filter_id')" v-model="mutable.filters" 
            type="checkbox" />
        </label></div>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'productFilters',
        event: 'update',
    },

    props:['productFilters', 'filterSet'],

    data(){
        return {
            mutable:{
                filters:[]
            },
        }
    },

    watch:{
        'productFilters':function(nv){
            this.filterSync()
        },

        'filterSet': function(){
            this.filterSync()
        },
        'mutable.filters': function(){
            this.sendUpdate()
        }
    },

    created(){
        this.filterSync()
    },

    methods:{
        filterSync(){
            let d = {}
            this.filterSet.embedded('filters').forEach(f=>{
                let filter_id = f.key('filter_id')
                d[filter_id] = filter_id
            })

            this.mutable.filters = this.productFilters.filter(f=>{
                return d[f]
            })
        },

        sendUpdate(){
            this.$emit('update', this.mutable.filters)
        },
    }
}
</script>
