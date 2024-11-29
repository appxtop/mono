import { UserModel } from "@mono/common";
import { defineStore } from "pinia";
import pinia from "./pinia";
import { ref } from "vue";
import { ws } from "../sigleton/ws";

const useUserStore = defineStore('user', () => {
    const status = ref<'initial' | 'loggedIn' | 'loggedOut'>('initial');
    const user = ref<UserModel | null>(null);
    function updateUser(userModel: UserModel | null) {
        user.value = userModel;
        if (userModel) {
            status.value = 'loggedIn';
        } else {
            status.value = 'loggedOut';
        }
    }
    return { status, user, updateUser };
});

export const userStore = useUserStore(pinia);

ws.on('user', (user) => {
    userStore.updateUser(user);
});

