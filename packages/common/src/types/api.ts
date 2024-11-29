import { UpdateCardsType } from "../card";
import { ApiErrorCode } from "../error";
import { CardModel, CardType } from "./model";


interface ApiMapBase {
    [key: string]: {
        fn: (...args: any[]) => Promise<any>;
    }
}

export interface ApiMap<User = { _id: string }> extends ApiMapBase {
    "/api/register/submit": {
        fn: (body: {
            username: string;
            password: string;
            nickname: string;
            email: string;
            verCode: string;
        }) => Promise<{
            token: string;
        }>,
    },

    '/api/register/checkUsername': {
        fn: (body: {
            username: string;
        }) => Promise<void>,
    },

    '/api/register/checkEmail': {
        fn: (body: {
            email: string
        }) => Promise<void>,
    },

    '/api/register/checkNickname': {
        fn: (body: {
            nickname: string
        }) => Promise<void>,
    },

    '/api/auth/login': {
        fn: (body: {
            username: string;
            password: string;
        }) => Promise<{ token: string }>,
    },

    '/api/user/setPassword': {
        fn: (body: {
            oldPassword: string;
            newPassword: string;
        }, user: User) => Promise<void>,
    },

    '/api/user/setEmail': {
        fn: (body: {
            email: string;
            verCode: string;
        }, user: User) => Promise<void>,
    },

    '/api/user/setNickname': {
        fn: (body: {
            nickname: string;
        }, user: User) => Promise<void>,
    },

    '/api/user/sendVerCode': {
        fn: (body: {
            email: string;
        }) => Promise<void>,
    },

    '/api/card/cards': {
        fn: (body: {
        }, user: User) => Promise<{
            gameTime: number;
            cards: {
                [_id: string]: CardModel
            }
        }>,
    },

    '/api/card/buy': {
        fn: (body: {
            type: CardType, num: number
        }, user: User) => Promise<UpdateCardsType>,
    },

    // '/test': {
    //     fn: (body: {
    //         uuuu: string
    //     }) => number
    // }
}
type UnwrappedReturnType<T> = T extends Promise<infer U> ? U : T;
export type ApiMapFn<K extends keyof ApiMap> = ApiMap[K]['fn'];
export type ApiMapBody<K extends keyof ApiMap> = Parameters<ApiMapFn<K>>[0];
export type ApiMapUser<K extends keyof ApiMap> = Parameters<ApiMapFn<K>>[1];
export type ApiMapReturn<K extends keyof ApiMap> = ReturnType<ApiMapFn<K>>;
export type ApiMapUnwrappedReturn<K extends keyof ApiMap> = UnwrappedReturnType<ApiMapReturn<K>>;


export type ApiResult<K extends keyof ApiMap> = {
    ok: 1,
    data: ApiMapUnwrappedReturn<K>
} | {
    ok?: 0,
    error?: string;
    errorCode?: ApiErrorCode;
}
