import { v4 as uuid } from 'uuid';

const LOCALSTORAGE_TOKEN_KEY = 'token';
export function getToken() {
    return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) || uuid();
}
export function setToken(token: string) {
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
}
