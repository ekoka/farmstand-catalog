<template>
<section class="section" v-if="ready">
    <div class="container">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title is-1">{{root.catalog.label}}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-primary">
                                Request access
                            </button>
                        </div>
                        <div class="control">
                            <button class="button is-primary">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import URI from 'urijs'

export default{
    data(){
        return {
            ready: false,
        }
    },
    mounted(){
        this.$store.dispatch('api/getPublicRoot').then(root=>{
            this.ready = true
        })
    },
    computed:{
        root(){
            return this.$store.getters['api/publicRoot'].data
        }
    },
}
</script>
