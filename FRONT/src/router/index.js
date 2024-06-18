import { createRouter, createWebHistory } from 'vue-router';
import IntroPage from '@/views/IntroPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import MainOne from '@/views/MainOne.vue';
import CardRecom from '@/views/CardRecom.vue';  // CardRecom 컴포넌트 임포트
import CardDetail from '@/views/CardDetail.vue';

const routes = [
    {
        path: '/',
        name: 'IntroPage',
        component: IntroPage
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/signup',
        name: 'SignupPage',
        component: SignupPage
    },
    {
        path: '/mainone',
        name: 'MainOne',
        component: MainOne
    },
    {
        path: '/card-recom',
        name: 'CardRecom',
        component: CardRecom,
        props: route => ({
            routes: JSON.parse(route.query.routes || '[]'),
            startPoint: route.query.startPoint,
            endPoint: route.query.endPoint
        })
    },
    {
        path: '/card-detail/:id',
        name: 'CardDetail',
        component: CardDetail,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
