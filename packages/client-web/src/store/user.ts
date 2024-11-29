import { UserModel } from "@mono/common";
import { defineStore } from "pinia";
import pinia from "./pinia";
import { checkRule } from "../router";
import { ref } from "vue";
import { ws } from "../sigleton/ws";

const useUserStore = defineStore('user', () => {
    const status = ref<'initial' | 'loggedIn' | 'loggedOut'>('initial');
    const user = ref<UserModel | null>(null);
    function updateUser(userModel: UserModel | null) {
        user.value = userModel;
        checkRule();
    }
    return { status, user, updateUser };
});

export const userStore = useUserStore(pinia);

ws.on('user', (user) => {
    userStore.updateUser(user);
    if (user) {
        userStore.status = 'loggedIn';
    } else {
        userStore.status = 'loggedOut';
    }
});

// evtBus.on('API:USER_UPDATE', (user) => {
//     userStore.updateUser(user);
// });

