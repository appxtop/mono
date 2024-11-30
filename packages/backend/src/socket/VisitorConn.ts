import { Socket } from "socket.io";
import _ from "lodash";
import { ApiMap, ApiMapBody, ApiResult, log, UserModel } from "@mono/common";
import { socketModules } from "./mods";
import { execApi } from "../api";
import { checkToken } from "../authlib";
import { client } from "@mono/dbman";
export class VisitorConn {
    socket: Socket;
    token: string;
    user: UserModel | null = null;
    private subs = new Set<string>();//用来取消订阅的
    constructor(socket: Socket, token: string) {
        this.socket = socket;
        this.token = token;
        socket.on('request', this._doRequest.bind(this));
        socket.on('subscribe', this._doSubscribe.bind(this));
        const room = 'token:' + token;
        socket.join(room);
    }
    public async init() {
        const user = await checkToken(this.token);
        if (user) {
            this.user = await client.collection('users').findOne({ _id: user._id });
        }
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