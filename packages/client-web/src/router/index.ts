import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/login/LoginView.vue';
import RegisterView from '../views/register/RegisterView.vue';
import UserView from '../views/user/UserView.vue';
import ModifyPasswordView from '../views/user/ModifyPasswordView.vue';
import SettingsView from '../views/settings/SettingsView.vue';
import GameView from '../views/GameView.vue';
import { userStore } from '../store/user';
import { evtBus } from '../sigleton/evtBus';

declare module 'vue-router' {
    interface RouteMeta {
        /**
         * 访客可以访问
         */
        visitor?: boolean
    }
}
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: HomeView,
        meta: {
            visitor: true
        }
    }, {
        path: "/login",
        name: "登录页面",
        component: LoginView,
        meta: {
            visitor: true
        }
    }, {
        path: '/register',
        component: RegisterView,
        meta: {
            visitor: true
        }
    }, {
        path: '/user',
        component: UserView
    }, {
        path: '/user/modify-password',
        component: ModifyPasswordView
    }, {
        path: '/settings',
        component: SettingsView
    }, {
        path: '/game',
        component: GameView
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 导航守卫
router.beforeEach((to, _from, next) => {
    if (userStore.status !== 'loggedOut' || to.meta.visitor) {
        next();
    } else {
        next({
            path: "/login",
            query: { redirect: to.path }
        });
    }
})

export default router;


evtBus.on('API:Unauthorized', () => {
    const curRoute = router.currentRoute.value;
    router.push({
        path: '/login',
        query: {
            redirect: curRoute.path
        }
    });
});

