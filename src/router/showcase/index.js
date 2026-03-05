export default [
    {
        name: 'Showcase',
        path: '/catalog',
        component: () => import('@/components/showcase'),
    },
    {
        component: () => import(/* webpackChunkName: "ShowcaseInquiry" */ '@/components/showcase/inquiry'),
        path:'/inquiry',
        children: [
            {
                path: '/inquiry/form',
                name: 'ShowcaseInquiry',
                component: () => import(/* webpackChunkName: "ShowcaseInquiry" */ '@/components/showcase/inquiry/form'),
            },
            {
                path: '/inquiry/sent',
                name: 'InquirySent',
                component: () => import(/* webpackChunkName: "ShowcaseInquiry" */ '@/components/showcase/inquiry/sent'),
            },
        ],
    },
]
