import {
    ApiError,
    ApiErrorCode,
    ApiMap,
    ApiMapBody,
    ApiResult,
} from "@mono/common";
import { SessionUser } from "../types";
import { checkToken } from "../authlib";
import { auth } from "./auth";
import { register } from "./register";
import { user } from "./user";
import { card } from "./card";
import _ from "lodash";

const apiMap: ApiMap = {
    ...auth,
    ...register,
    ...user,
    ...card,
    // "/test": {  
    //     fn: (body: { uuuu: string }) => {
    //         const { uuuu } = body;
    //         console.log(uuuu);
    //         return 123;
    //     }860 7 0000000006  1 78
    // }
};


export async function execApi<K extends keyof ApiMap>(opts: {
    path: K;
    body: ApiMapBody<K>,
    token?: string;
    user?: SessionUser | null;
}): Promise<ApiResult<K>> {
    const { path, token, body, user } = opts;
    const apiItem = apiMap[path];
    if (!apiItem) {
        return {
            errorCode: ApiErrorCode.ApiNotFound,
            error: 'Api不存在'
        };
    }
    try {
        const fn = apiItem.fn as any
        if (fn.length == 2) {
            const user_ = user || (await checkToken(token));
            if (!user_) {
                throw new ApiError(ApiErrorCode.Unauthorized);
            }
            const data = await fn(body, user_);
            return {
                ok: 1,
                data: data as any
            };
        } else if (fn.length == 1) {
            const data = await fn(body);
            return {
                ok: 1,
                data
            }
        }
        throw new Error('api定义错误');
    } catch (e) {
        if (e instanceof ApiError) {
            return {
                errorCode: e.errorCode,
                error: e.error
            }
        } else {
            return {
                errorCode: ApiErrorCode.SystemError,
                error: "系统异常"
            }
        }
    }
}
