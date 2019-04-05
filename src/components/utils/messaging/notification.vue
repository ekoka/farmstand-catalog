<template>
<div :class="position">
    <div v-for="m in messages" >
        <span :key="m.key" class="tag" :class="m.css">
            {{m.message}}
            <button v-if="m.close" @click="popMessage(m.key)" class="delete"></button>
        </span>
    </div>
</div>
</template>

<script>
import {join, remove} from 'lodash/fp'
export default {

    props: ['eventName', 'defaults'],

    data(){
        return {
            messages: [],
        }
    },

    computed: {
        defaultTimeout(){
            return this.defaults && this.defaults.timeout || 3 // in seconds
        },
        position(){
            const position = this.defaults && this.defaults.position || 'relative'
            return 'notification-is-' + position
        },
    },

    mounted(){
        this.$eventBus.$on(this.eventName, (e)=>{
            const css = this.setCss(e.options)

            const timeout = this.setTimeout(e.options && e.options.timeout)
            const close = e.options && e.options.close
            
            const message = {
                css, 
                message:e.message, 
                close: close===false?false:true,  
                timeout,
                // we use a timeout as a key for the message, not perfect
                // but for this purpose it works
                key: Date.now(),
            }
            if(timeout!=Infinity){
                setTimeout(()=>{
                    this.popMessage(message.key)
                }, timeout)
            }
            this.messages.push(message)
        })
    },

    // it's important to register a callback that's fired
    // when the component is destroyed, otherwise it remains 
    // registered as a listener for the event and is thus kept
    // alive.
    beforeDestroy(){
        this.$eventBus.$off(this.eventName)
    },

    methods:{
        setCss(options){
            return join(' ')([
                options.color || '',
                options.size || '',
            ])
        },

        setTimeout(timeout){
            if (timeout==Infinity){
                return Infinity
            }
            return (timeout || this.defaultTimeout) * 1000
        },

        popMessage(key){
            this.messages = remove(m=>{
                return m.key==key
            })(this.messages)
        },

    },
}
</script>

<style>
.notification-is-fixed-top {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    /*width: 33%;*/
    z-index: 10;
}

.notification-is-relative {
    position: relative;
}
</style>
