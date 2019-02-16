<template>
<div>
    <nav class="menu">
        <p class="menu-label">
           User management 
        </p>
        <ul class="menu-list">
            <li>
                <router-link :to="{name:'AdminUserList'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Users</span>
                </router-link>
            </li>
        </ul>
    </nav><!-- menu -->
</div><!-- column -->
</template>
