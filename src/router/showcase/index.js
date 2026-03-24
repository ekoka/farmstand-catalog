export default [
    {
        name: 'Showcase',
        path: '/catalog',
        component: () => import('@/components/showcase/index.vue'),
    },
    {
        component: () => import('@/components/showcase/inquiry/index.vue'),
        path:'/inquiry',
        children: [
            {
                path: '/inquiry/form',
                name: 'ShowcaseInquiry',
                component: () => import('@/components/showcase/inquiry/form/index.vue'),
            },
            {
                path: '/inquiry/sent',
                name: 'InquirySent',
                component: () => import('@/components/showcase/inquiry/sent/index.vue'),
            },
        ],
    },
]
