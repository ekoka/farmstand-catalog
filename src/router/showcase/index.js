// components
import Showcase from '@/components/showcase'
import Inquiry from '@/components/showcase/inquiry'
import InquiryForm from '@/components/showcase/inquiry/form'
import InquirySent from '@/components/showcase/inquiry/sent'

export default [
    {
        name: 'Showcase',
        path: '/catalog',
        component: Showcase,
    },
    {
        component: Inquiry,
        path:'/inquiry',
        children: [
            {
                path: '/inquiry/form',
                name: 'ShowcaseInquiry',
                component: InquiryForm,
            },
            {
                path: '/inquiry/sent',
                name: 'InquirySent',
                component: InquirySent,
            },
        ],
    },
]
