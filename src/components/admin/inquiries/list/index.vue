<template>
<div>
    <nav class="breadcrumb is-large has-arrow-separator">
        <ul>
            <li class="is-active">
                <router-link :to="{name:'AdminUserList'}">Clients</router-link>
            </li>
        </ul>
    </nav> <!-- breadcrumb -->
    <div class="level">
        <div class="level-left">
            <div class="level-item is-hidden-tablet-only">
                <div class="field has-addons">
                    <p class="control">
                        <input class="input" placeholder="Client name, email, address…">
                    </p>
                    <p class="control">
                        <button class="button">Search</button>
                    </p>
                </div><!-- field -->
            </div><!-- level-item -->
        </div><!-- level-left -->
    </div><!-- level -->
    <div class="box">
        <h1 class="title is-3">Under construction...</h1>
    </div>
</div>
</template>
