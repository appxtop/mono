import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/login/LoginView.vue';
import RegisterView from '../views/register/RegisterView.vue';
import UserView from '../views/user/UserView.vue';
import ModifyPasswordView from '../views/user/ModifyPasswordView.vue';
import SettingsView from '../views/settings/SettingsView.vue';
import GameView from '../views/GameView.vue';
import { userStore } from '../store/user';
const routes: { path: string, name?: string, meta?: { visitor?: boolean }, component: any }[] = [
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
    },
    {
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


export function checkRule() {
    const curRoute = router.currentRoute.value;
    if (userStore.user) {//认证成功了,判断是否需要跳转
        if (curRoute.path === '/login' || curRoute.path === '/register') {
            const redirect = curRoute.query.redirect?.toString() || '/';
            router.push(redirect);
        }
    } else if (userStore.user === null) {//认证失败
        if (!curRoute.meta?.visitor) {
            router.push({
                path: '/login',
                query: {
                    redirect: curRoute.path
                }
            });
        }
    }
}


// 导航守卫
router.beforeEach((to, _from, next) => {
    if (userStore.user || userStore.user === 0 || to.meta.visitor) {
        next();
    } else {
        next({
            path: "/login",
            query: { redirect: to.path }
        });
    }
})


export default router;
