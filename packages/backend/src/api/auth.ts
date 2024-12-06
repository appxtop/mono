import { client } from "@mono/dbman";
import { comparePwd, genToken } from "../authlib";
import { ApiError, ApiMap } from "@mono/common";
import { roomEmit, RoomEmitKey_token } from "../socket";

export const auth: Pick<ApiMap, '/api/auth/login'> = {
    "/api/auth/login": {
        fn: async (body: {
            username: string;
            password: string;
            token: string;
        }) => {
            const username = body.username;
            const password = body.password;
            let token = body.token;
            const userModel = await client.collection('users').findOne({
                username
            });
            if (!userModel || !await comparePwd(password, userModel.passwordHash)) {
                throw new ApiError('用户名或密码错误');
            }
            token = await genToken({ _id: userModel._id }, token);

            const room = RoomEmitKey_token + token;
            await roomEmit(room, "user", userModel);

            return { token };
        }
    }
}



