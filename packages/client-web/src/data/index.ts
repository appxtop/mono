import { v4 as uuid } from 'uuid';

const LOCALSTORAGE_TOKEN_KEY = 'token';
export function getToken() {
    let val = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    if (!val) {
        val = uuid();
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, val);
    }
    return val;
}
export function setToken(token: string) {
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
}
