import { Socket } from "socket.io";
import _ from "lodash";
import { ApiMap, ApiMapBody, ApiResult, log, UserModel } from "@mono/common";
import { socketModules } from "./mods";
import { execApi } from "../api";
export class VisitorConn {
    public socket: Socket;
    user: UserModel | null = null;
    private subs = new Set<string>();//用来取消订阅的
    constructor(socket: Socket) {
        this.socket = socket;
        socket.on('request', this._doRequest.bind(this));
        socket.on('subscribe', this._doSubscribe.bind(this));
    }
    public async init() {
        this.socket.emit('user', this.user);
    }
    async _doRequest<K extends keyof ApiMap>(data: {
        path: K,
        body: ApiMapBody<K>,
    }, callback: (result: ApiResult<K>) => void) {
        const path = data.path;
        const body = data.body;
        const result = await execApi({ path, body, user: this.user });
        callback(result);
    }
    async _doSubscribe(channel: string) {
        this.subs.add(channel);
        for (const module of socketModules) {
            try {
                await module.subscribe(channel, this);
            } catch (e) {
                log('订阅出错', e);
            }
        }
    }

}