<template>
<div>
    <div v-if="groups.length==0" class="is-size-4">
        You have no group yet.
    </div>
    <div v-else class="card">
        <div class="card-content">
            <div v-for="f,i in groups" class="media">
                <div class="media-left">
                    <p class="title is-5 is-spaced">
                        <router-link :to="{name: 'AdminEditGroup', params:{group_id: f.group_id}}">{{f.data.label}}</router-link>
                    </p>
                </div>
                <div class="media-content">
                </div>

                <div class="media-left">
                    {{f.data.description}}
                </div>
                <!--<div class="media-right">
                    14 Multiple choice options
                </div>-->
                <div class="media-right">
                    <a class="button is-small" :class="{'is-warning': !f.active, 'is-success':f.active}">{{f.active ? 'currently enabled' :  'currently disabled'}}</a> 
                </div>
            </div><!-- media -->
        </div><!-- card-content -->
    </div><!-- card -->
</div><!-- column -->
</template>

<script>
export default{
    props: ['groups']
}
</script>
