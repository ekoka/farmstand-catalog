<template>
<div>
    <div class="field">
        <label class="label">
        </label>
        <div class="control">
            <label class="label">
                Do you have comments or questions about this product?
            </label>
        </div>
        <div class="control">
            <textarea class="textarea" v-model="comments" />
        </div>
    </div>

    <div class="field">
        <button class="button is-link is-small">Send</button>
        <button class="button is-warning is-small">Cancel</button>
    </div>
</div>
</template>

<script>
export default {}
</script>

<style>
</style>
