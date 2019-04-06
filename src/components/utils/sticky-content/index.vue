<template>
<div class="content sticky-content">
    <slot></slot>
</div>
</template>

<style>
.sticky-content {
    position: sticky;
    top: 5%;
    z-index: 9;
}
</style>
