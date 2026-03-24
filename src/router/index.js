import { createRouter, createWebHistory } from 'vue-router'
import Showcase from './showcase'
//import Admin from './admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Admin,
    ...Showcase,
    {
      path: '/',
      name: 'Index',
      component: () => import('@/components/home/index.vue'),
    },
    //{
    //  path: '/about',
    //  name: 'about',
    //  // route level code-splitting
    //  // this generates a separate chunk (About.[hash].js) for this route
    //  // which is lazy-loaded when the route is visited.
    //  component: () => import('../views/AboutView.vue'),
    //},
  ],
})

export default router
