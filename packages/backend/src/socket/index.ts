import http from "http";
import { Server } from "socket.io";
import { VisitorConn } from "./VisitorConn";
import { UserConn } from "./UserConn";
import { HEADER_TOKEN_KEY } from "@mono/common";
import { socketModules } from "./mods";

let socketServer: Server;
export function startSocketServer(server: http.Server) {
    socketServer = new Server(server, {
        path: '/socket'
    });
    socketServer.on('connect', async socket => {
        const token = socket.handshake.auth[HEADER_TOKEN_KEY] as string;
        if (!token) {
            throw new Error("需要token");
        }
        await new VisitorConn(socket, token).init();
    });
    socketModules.forEach(m => {
        m.init && m.init();
    });
}

export async function roomEmit(room: string, name: string, msg: any) {
    if (!socketServer) {
        console.error('socketio没有初始化');
        return;
    }
    socketServer.to(room).emit(name, msg);
}


export const RoomEmitKey_user = 'user:';
export const RoomEmitKey_token = 'token:';
