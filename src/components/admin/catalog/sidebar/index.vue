<template>
<div>
    <nav class="menu">
        <p class="menu-label">
           Catalog 
        </p>
        <ul class="menu-list">
            <li>
                <router-link :to="{name:'AdminProductList'}" active-class="is-active">
                    <!--<span class="icon">
                        <i class="mdi mdi-note"></i>
                    </span>-->
                    <span>Products</span>
                </router-link>
            </li>

            <li>
                <router-link :to="{name:'AdminFilterList'}" active-class="is-active">
                    <span>Filters</span>
                </router-link>
            </li>

        </ul>
    </nav><!-- menu -->
</div><!-- column -->
</template>
