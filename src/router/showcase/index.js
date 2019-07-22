// components
import Showcase from '@/components/showcase'
import Inquiry from '@/components/showcase/inquiry'

export default [
    {
        name: 'Showcase', 
        path: '/catalog', 
        component: Showcase, 
    },
    {
        name: 'ShowcaseInquiry', 
        component: Inquiry, 
        path:'/inquiry'
    }
]

