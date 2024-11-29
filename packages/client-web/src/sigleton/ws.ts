import { io, Socket } from "socket.io-client";
import { getToken } from "../data";
import { ApiMap, ApiMapBody, ApiResult, Emiter, HEADER_TOKEN_KEY } from "@mono/common";

class MySocketIO {
    private socket: Socket;
    private emiter: Emiter = new Emiter();
    //记录下来,用来重连的时候重新订阅
    private subs: {
        [channel: string]: number;
    } = {};
    constructor() {
        const token = getToken();
        this.socket = io({
            path: '/socket',
            reconnection: true,//启用自动重连
            reconnectionAttempts: 100,  // 重连最大次数
            reconnectionDelay: 1000,  // 重连延迟
            auth: {
                [HEADER_TOKEN_KEY]: token
            }
        });
        this.socket.onAny((channel, data) => {
            //subscribe
            this.emiter.emit(channel, data);
        });
    }
    async request<K extends keyof ApiMap>(path: K, body: ApiMapBody<K>): Promise<ApiResult<K>> {
        return await new Promise((resolve, reject) => {
            this.socket.emit('request', { path, body }, (data: any, err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        });
    }
    on(channel: string, fn: (data: any) => void) {
        this.emiter.on(channel, fn);
    }
    once(channel: string, fn: (data: any) => void) {
        this.emiter.once(channel, fn);
    }
    off(channel: string, fn: (data: any) => void) {
        this.emiter.off(channel, fn);
    }
    subscribe(channel: string) {
        this.socket.emit('subscribe', channel);
        this.subs[channel] ??= 0;
        this.subs[channel]++;
    }
    unSubscribe(channel: string) {
        if (this.subs[channel]) {
            this.subs[channel]--;
            if (this.subs[channel] <= 0) {
                delete this.subs[channel];
                this.socket.emit('unsubscribe', channel)
            }
        } else {
            console.warn('多余的订阅', channel);
        }
    }
}


export const ws = new MySocketIO();