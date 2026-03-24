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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventStore } from '@/store/events' 

const props = defineProps(['eventName', 'defaults'])
const messages = ref([])
const store = useStore()

defaultTimeout = computed(() => defaults && defaults.timeout || 3 /* in seconds */ )
position = computed(() => {
    const position = defaults && defaults.position || 'relative'
    return 'notification-is-' + position
}

onMounted(() => {
    this.$eventBus.$on(eventName, (e)=>{
        const css = setCss(e.options)

        const timeout = _setTimeout(e.options && e.options.timeout)
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
                popMessage(message.key)
            }, timeout)
        }
        messages.push(message)
    })
})

// it's important to register a callback that's fired
// when the component is destroyed, otherwise it remains 
// registered as a listener for the event and is thus kept
// alive.
function beforeDestroy(){
    this.$eventBus.$off(this.eventName)
}

    
function setCss(options){
    return [
        options.color || '',
        options.size || '',
    ].join(' ')
}

function _setTimeout(timeout){
    if (timeout===Infinity){
        return Infinity
    }
    return (timeout || defaultTimeout) * 1000
}

function popMessage(key){
    messages.remove(m => {
        return m.key==key
    })
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
