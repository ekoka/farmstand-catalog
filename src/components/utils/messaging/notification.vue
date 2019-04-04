<template>
<div class="fixed-top">
    <div v-for="m in messages" :key="m.key" class="message" :class="m.css">
        <div class="message-header">
            <p>{{m.message}}</p>
            &nbsp;&nbsp;<button @click="popMessage(m.key)" class="delete"></button>
        </div>
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
            return this.defaults.timeout || 3 // in seconds
        }
    },

    mounted(){
        console.log(this.eventName)
        this.$eventBus.$on(this.eventName, (e)=>{
            console.log('heard the message')
            const css = this.setCss(e.options)

            const timeout = this.setTimeout(e.options && e.options.timeout)
            console.log('timeout is ', timeout)
            const settings = this.settings(e.options)
            const message = {
                css, 
                message:e.message, 
                timeout,
                // we use a timeout as a key for the message, not perfect
                // but for this purpose it works
                key: Date.now(),
                settings, 
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
                this.color(options),
            ])
        },

        setTimeout(timeout){
            if (timeout==Infinity){
                return Infinity
            }
            return (timeout || this.defaultTimeout) * 1000
        },

        color(options){
            if(options.color){
                return options.color || 'is-primary'
            }
            return ''
        },

        settings(options){
            return {}
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
.fixed-top {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    /*width: 33%;*/
    z-index: 10;
}
</style>
