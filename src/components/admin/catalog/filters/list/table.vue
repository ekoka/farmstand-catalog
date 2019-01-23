<template>
<div>
    <div class="card">
        <div class="card-content">
            <div v-for="f,i in filters" class="media">
                <div class="media-left">
                    <p class="title is-5 is-spaced">
                        <router-link :to="{name: 'AdminEditFilter', params:{filter_id: f.filter_id}}">{{f.data.label}}</router-link>
                    </p>
                </div>
                <div class="media-content">
                </div>

                <div class="media-left">
                    {{f.data.description}}
                </div>
                <div class="media-right">
                    14 Multiple choice options
                </div>
                <div class="media-right">
                    <a class="button is-small" :class="{'is-warning': !f.active, 'is-success':f.active}">currently disabled</a> 
                </div>
            </div><!-- media -->

            <div class="media"></div><!-- media -->
            <a class="button is-outlined is-link" href="books.html">Add a new filters</a>
        </div><!-- card-content -->
    </div><!-- card -->
</div><!-- column -->
</template>

<script>
export default{
    props: ['filters']
}
</script>
