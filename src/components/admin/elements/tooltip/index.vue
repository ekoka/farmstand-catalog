<template>
<div class="tooltip">
    <span class="icon" 
        @mouseover="showMessage=true" 
        @mouseleave="showMessage=false" >
        <i class="mdi mdi-help-circle-outline"></i>
        <!--
        mdi-help-box
        mdi-help-circle
        -->
    </span>

    <div v-show="showMessage" class="notification is-warning tooltip-message">
        <slot></slot>
    </div>
</div>
</template>

<script>
export default {
    props: {
    },
    data(){
        return {
            showMessage: false,
        }
    },
}
</script>

<style>
.tooltip {
    position: relative;
}

.tooltip .tooltip-message{
    z-index: 1;
    position: absolute;
    left: 30px;
    top: 0px;
    width: 200px;
    padding: 4px 10px; 
}
</style>
