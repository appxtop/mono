import axios from "axios";
import { HEADER_TOKEN_KEY, ApiErrorCode, ApiMap, ApiMapBody, ApiResult, ApiMapUnwrappedReturn } from "@mono/common";
import { getToken } from "../data";
import { evtBus } from "../sigleton/evtBus";
import { ws } from "../sigleton/ws";
const apiClient = axios.create({
    // baseURL: '/',//api
});

apiClient.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers[HEADER_TOKEN_KEY] = token;
    }
    return config;
});

//检查是否登录的拦截器
// apiClient.interceptors.response.use(response => {
//     return response;
// }, error => {
//     if (error.response && error.response.status === 401) {
//         router.push('/login')
//     }
//     return Promise.reject(error);
// });

export async function apiRequest<K extends keyof ApiMap>(path: K, body: ApiMapBody<K>): Promise<ApiMapUnwrappedReturn<K>> {
    const res = await ws.request(path, body);
    if (res.ok) {
        return res.data;
    } else {
        if (res.errorCode === ApiErrorCode.Unauthorized) {
            evtBus.emit('API:Unauthorized');
        }
        throw new Error(res.error);
    }
}


export { apiClient };
