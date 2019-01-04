// components
import Showcase from '@/components/showcase'
import Inquiry from '@/components/showcase/inquiry'

export default {
    name: 'Showcase', 
    path: '/', 
    component: Showcase, 
    children:[
        {
            name: 'ShowcaseInquiry', 
            path: '/inquiry', 
            component: Inquiry, 
            path:'inquiry'
        }
    ],
}

